# backend/app.py
from flask import Flask
from flask_cors import CORS
from routes.thermo_routes import thermo_blueprint

app = Flask(__name__)
CORS(app)

# Register blueprint for p-H data
app.register_blueprint(thermo_blueprint, url_prefix="/thermo")

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)
