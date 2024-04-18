#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask ,request, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
users = {'example@example.com': 'password'}

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in users and users[email] == password:
        return jsonify({'message': 'Login successful', 'token': 'dummy-token'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logout successful'}), 200


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

