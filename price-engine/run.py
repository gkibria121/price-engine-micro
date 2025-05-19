
import os
import sys
from app import create_app



# Load from environment
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    sys.exit("❌ Environment variable MONGO_URL is not set. Please define it before starting the app.")


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
