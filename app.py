#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from interview_routes import interview_bp  # Importing the interview routes
# Add your model imports


# Views go here!
app.register_blueprint(interview_bp, url_prefix='/api')  # Registering the interview routes

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

