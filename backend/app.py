# backend/app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.thermo_routes import thermo_blueprint
import os

# Path to built frontend
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/dist'))

app = Flask(__name__, static_folder=frontend_dist, static_url_path='')
CORS(app)

# Register blueprint for thermo API
app.register_blueprint(thermo_blueprint, url_prefix="/thermo")

# Serve frontend files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)
