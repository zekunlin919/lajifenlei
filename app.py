from flask import Flask, request, jsonify, send_file
import jwt
import datetime
from functools import wraps
from pathlib import Path
from ultralytics import YOLO
from flask_cors import CORS


MODEL = "runs/detect/custom_model_gpu_final/weights/best.pt"
UPLOAD_FOLDER = Path("uploads")

app = Flask(__name__)
CORS(app)
SECRET_KEY = 'your_secret_key'


users = {
    'user1': '123',
    'user2': '456'
}


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            current_user = data['username']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({'message': 'Invalid or expired token!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated_function

# 登录路由
@app.route('/api/login', methods=['POST'])
def login():
    auth = request.get_json()
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Username and password are required!'}), 400

    username = auth['username']
    password = auth['password']

    if username in users and users[username] == password:
        token = jwt.encode({
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials!'}), 401


@app.post('/api/image')
def return_image():

    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"


    upload_path = UPLOAD_FOLDER / file.filename
    upload_path.parent.mkdir(parents=True, exist_ok=True)
    file.save(upload_path)


    model = YOLO(MODEL)
    results = model(
        upload_path,
        conf=0.1,  # 进一步降低阈值，更容易检测到低置信度目标
        imgsz=640,  # 和训练尺寸完全一致
        save=True,
        project='runs/detect',
        name='predict',
        exist_ok=True
    )

    save_path = Path(results[0].save_dir) / file.filename


    return send_file(save_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
