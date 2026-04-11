# VehicleNet — Intelligent Vehicle Classification 🚗

![License](https://img.shields.io/badge/license-MIT-blue) ![Accuracy](https://img.shields.io/badge/accuracy-98.90%25-brightgreen) ![React](https://img.shields.io/badge/frontend-React-61DAFB) ![Django](https://img.shields.io/badge/backend-Django-092E20) ![TensorFlow](https://img.shields.io/badge/model-TensorFlow-FF6F00) ![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248)

VehicleNet is a full-stack, AI-driven web application that allows users to upload images of vehicles and receive instant, high-accuracy classifications. The platform features an interactive React dashboard, a robust Django backend, and a deep learning model fine-tuned entirely on a custom dataset.

## ✨ Features
- **Highly Accurate Deep Learning:** Uses a fine-tuned EfficientNetB0 architecture achieving **98.90% accuracy** on a 70/15/15 dataset split.
- **4-Class Detection:** Accurately distinguishes between `Bike`, `Bus`, `Car`, and `Truck`.
- **User Authentication:** Complete Signup/Login flow managed safely via Django Token Auth and synced into NoSQL.
- **Cloud Database:** Seamlessly integrates with MongoDB (Atlas) to store user profiles and a persistent history of image classifications.
- **Modern Dashboard:** A sleek React-based drag-and-drop dashboard tracking your personal "Recent Activity" and confidence scores.

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- React Router (for SPA navigation)
- Vanilla CSS + Lucide Icons

**Backend & Database:**
- Django & Django REST Framework (API layer)
- MongoDB / PyMongo (Persistent NoSQL storage)
- Python Dotenv (Environment variable management)

**Machine Learning:**
- TensorFlow / Keras (EfficientNetB0)
- PIL / Numpy (Image preprocessing)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and Python 3.9+ installed on your system.

### 1. Database Setup
Create an account on MongoDB Atlas and get your cluster connection string.
Inside `Backend/VehicleClassifier/`, create a `.env` file and add:
```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.yourstring.mongodb.net/?retryWrites=true&w=majority"
```

### 2. Backend Setup
Navigate into the backend directory and run the Django server:
```bash
cd Backend/VehicleClassifier
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
Open a new terminal tab, navigate to the frontend directory, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173/` to interact with the application!

## 🧠 Model Training
If you wish to retrain the model or look into the data pipeline:
1. All training code is located in `training/training_pipeline.ipynb`.
2. Model parameters require image reshaping to `(224, 224, 3)`.
3. Note: The exact `.keras` model weights and `.jpg` datasets are explicitly ignored in `.gitignore` to prevent repository bloat. Model weights should be trained locally or hosted externally.

## 🛡️ License
This project is open-source and available under the MIT License.
