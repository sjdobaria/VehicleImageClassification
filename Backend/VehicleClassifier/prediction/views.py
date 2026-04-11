import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from pymongo import MongoClient
import tensorflow as tf
import numpy as np
from PIL import Image, ImageOps
from pathlib import Path

# Connect to MongoDB
# Load connection string from environment variables for cloud support, default to local if not set
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri)
db = client['VehicleClassifier_db']
predictions_collection = db['predictions']

# Load the Keras Model
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODEL_PATH = str(BASE_DIR / 'training' / 'efficientnetb0_new_split.keras')

classes = ['Bike', 'Bus', 'Car', 'Truck']  # Mapped alphabetically exactly to dataset folders (Bikes, Buses, Cars, Trucks)

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class PredictView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_id = request.user.id
        recent_preds = list(predictions_collection.find(
            {'user_id': user_id},
            {'_id': 0, 'predicted_class': 1, 'confidence': 1, 'filename': 1, 'timestamp': 1}
        ).sort('timestamp', -1).limit(5))
        
        history = []
        for p in recent_preds:
            history.append({
                'className': p.get('predicted_class'),
                'confidence': p.get('confidence'),
                'fileName': p.get('filename'),
                'timestamp': p.get('timestamp').strftime('%I:%M:%S %p') if 'timestamp' in p else ''
            })
            
        return Response(history, status=status.HTTP_200_OK)

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'No image uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        try:
            # 1. Process Image & Apply EXIF rotation
            raw_img = Image.open(image_file).convert('RGB')
            img = ImageOps.exif_transpose(raw_img)
            
            # 2. Preprocess for EfficientNetB0
            img = img.resize((224, 224))
            img_array = tf.keras.preprocessing.image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
            
            if model is None:
                return Response({'error': 'Model not loaded on server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 3. Predict
            predictions = model.predict(img_array)
            predicted_idx = np.argmax(predictions[0])
            confidence = predictions[0][predicted_idx]
            
            predicted_class = classes[predicted_idx]
            conf_score = round(float(confidence) * 100, 2)
            
            # 3. Save to MongoDB
            user_id = request.user.id if request.user.is_authenticated else None
            user_name = request.user.username if request.user.is_authenticated else "Guest"
            
            prediction_record = {
                'user_id': user_id,
                'user_name': user_name,
                'filename': image_file.name,
                'predicted_class': predicted_class,
                'confidence': conf_score,
                'timestamp': __import__('datetime').datetime.now()
            }
            predictions_collection.insert_one(prediction_record)
            
            # 4. Return Response
            return Response({
                'class': predicted_class,
                'confidence': conf_score,
                'filename': image_file.name
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
