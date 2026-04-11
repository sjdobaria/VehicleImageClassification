import os
from pymongo import MongoClient
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer

# Connect to MongoDB for sinking Users
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri)
db = client['VehicleClassifier_db']
users_collection = db['users']

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Replicate the user data into MongoDB mapping
            users_collection.insert_one({
                'django_id': user.id,
                'username': user.username,
                'email': user.email,
                'date_joined': __import__('datetime').datetime.now()
            })
            
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': {'username': user.username, 'email': user.email}}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': {'username': user.username, 'email': user.email}})
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
