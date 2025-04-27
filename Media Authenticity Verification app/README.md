# Media Authenticity Verification Android App

## Overview
An AI-powered mobile application designed to combat misinformation by detecting deepfakes and altered media content. Using advanced machine learning algorithms, this application provides real-time analysis to verify the authenticity of digital media, helping users distinguish between genuine and manipulated content.

## Structure
- `frontend/` : React Native Expo app
- `backend/` : Node.js Express server
- `model-server/` : Python Flask server for model inference

## System Architecture

### Mobile Application
- Built using **React Native** with **Expo** framework
- Cross-platform compatibility
- User-friendly interface for media verification
- Real-time analysis results and detailed reporting

### Backend Infrastructure
- **Node.js** server with **Express.js** framework
- RESTful API architecture
- File handling using **Multer**
- Cross-origin resource sharing (CORS) enabled
- **Axios** for HTTP requests

### ML Model Server
- **Python Flask** server for model inference
- Deep learning model built with **PyTorch**
- Image processing using **Pillow** and **torchvision**
- **Timm** library for model architecture

## Technologies Used

### Frontend Stack
- React Native
- Expo CLI
- JavaScript/TypeScript
- Native Mobile APIs

### Backend Stack
- Node.js
- Express.js
- Multer
- CORS
- Form-data
- Axios

### Machine Learning Stack
- Python 3.x
- Flask
- PyTorch
- Torchvision
- Timm
- Pillow

## Workflow
1. User uploads media content for verification
2. Content is processed through secure backend channels
3. AI model analyzes content for manipulation signatures
4. Detailed authenticity report is generated
5. Results displayed with confidence scores

## Key Features
- Advanced AI-powered media authentication
- Support for multiple media types
- Detailed manipulation detection reports
- User-friendly interface
- Fast processing and real-time results
- Privacy-focused design

## How to Run
1. Start model-server
```bash
cd model-server
pip install flask torch torchvision timm pillow
python app.py
```
2. Start backend
```bash
cd backend
npm install express multer cors axios form-data
node server.js
```
3. Start frontend (Expo)
```bash
cd frontend
npm install
expo start
```

Note: Replace `YOUR-IP` in App.js with your local machine's IP address for development.