from flask import Flask, request, jsonify
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import cv2
import base64
from timm import create_model
import io

app = Flask(__name__)

class XceptionNet(torch.nn.Module):
    def __init__(self, num_classes=2):
        super(XceptionNet, self).__init__()
        self.model = create_model('xception', pretrained=False, num_classes=num_classes)

    def forward(self, x):
        return self.model(x)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = XceptionNet().to(device)
model.load_state_dict(torch.load('E:\\Media app\\deepfake-detector-app\\model\\best_xception_model.pth', map_location=device))
model.eval()

transform = transforms.Compose([
    transforms.Resize((299, 299)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

def generate_gradcam(image, model, target_layer):
    feature_maps = []
    gradients = []

    def forward_hook(module, input, output):
        feature_maps.append(output)
    
    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    # Register hooks
    hook = target_layer.register_forward_hook(forward_hook)
    hook_back = target_layer.register_backward_hook(backward_hook)

    # Forward pass
    outputs = model(image)
    probs = torch.softmax(outputs, dim=1)
    confidence = probs.max().item() * 100
    pred_label = probs.argmax(1).item()

    # Backward pass for GradCAM
    model.zero_grad()
    outputs[:, pred_label].backward()

    # Remove hooks
    hook.remove()
    hook_back.remove()

    # Generate heatmap
    grad = gradients[0]
    fmap = feature_maps[0]
    pooled_grad = torch.mean(grad, dim=(0, 2, 3), keepdim=True)
    weighted_feat = fmap * pooled_grad
    heatmap = weighted_feat.squeeze().mean(dim=0).cpu().detach().numpy()
    
    # Normalize heatmap
    heatmap = np.maximum(heatmap, 0)
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-10)
    
    return heatmap, pred_label, confidence

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']
        img = Image.open(file.stream).convert('RGB')
        
        # Save original image size for later
        original_size = img.size
        
        # Transform image for model
        img_tensor = transform(img).unsqueeze(0).to(device)
        
        # Generate GradCAM
        heatmap, label, confidence = generate_gradcam(
            img_tensor, 
            model, 
            model.model.act4  # Target layer for GradCAM
        )
        
        # Convert original image to numpy array
        img_array = np.array(img)
        
        # Initialize heatmap_base64 as None
        heatmap_base64 = None
        
        # Only process and return heatmap if the image is predicted as fake (label = 1)
        if label == 1:
            # Resize heatmap to match original image size
            heatmap = cv2.resize(heatmap, (original_size[0], original_size[1]))
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            
            # Convert RGB to BGR for OpenCV
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            
            # Create superimposed image
            superimposed = cv2.addWeighted(img_array, 0.6, heatmap, 0.4, 0)
            
            # Encode the superimposed image to base64
            _, buffer = cv2.imencode('.jpg', superimposed)
            heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            'prediction': int(label),
            'confidence': round(confidence, 2),
            'heatmap': heatmap_base64
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)