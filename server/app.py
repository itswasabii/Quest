from flask import Flask, request, jsonify
from sqlalchemy_serializer import Serializer
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os
import uuid
from flask_mail import Mail, Message



# Initialize CORS and the app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://your-allowed-origin.com"}})  # Specify the allowed origin

# Configure database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)


# Configure mail settings
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'

mail = Mail(app)


def send_verification_email(user_email, token):
    # Create the verification link
    verification_link = f"http://localhost:5555/verify/{token}"
    
    # Create a new email message
    msg = Message(
        subject='Verify Your Email Address',
        sender='your-email@gmail.com',
        recipients=[user_email],
    )
    msg.body = f"Please verify your email by clicking on the following link: {verification_link}"
    
    # Send the email
    mail.send(msg)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(15), nullable=True)
    education = db.Column(db.String(100), nullable=True)
    relevant_skills = db.Column(db.String(200), nullable=True)
    profession = db.Column(db.String(100), nullable=True)
    desired_job_role = db.Column(db.String(100), nullable=True)
    resume = db.Column(db.String(100), nullable=True)
    is_email_verified = db.Column(db.Boolean, default=False)  # New column for email verification status
    email_verification_token = db.Column(db.String(100), nullable=True)  # New column for verification token

# Create database and tables
with app.app_context():
    db.create_all()

# Define a schema for serializing User data
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Define the user profile retrieval and update endpoint
@app.route('/api/user/profile', methods=['GET', 'PUT'])
def user_profile():
    # Assume the user's email is known or passed as a parameter
    # In a real application, you should use a proper authentication method (e.g., JWT) to identify the user
    user_email = 'user@example.com'

    # Find the user in the database
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if request.method == 'GET':
        # Return the user's information as JSON
        return jsonify(user_schema.dump(user))

    elif request.method == 'PUT':
        # Update the user's information with the data from the request
        data = request.get_json()

        user.name = data.get('name', user.name)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.education = data.get('education', user.education)
        user.relevant_skills = data.get('relevant_skills', user.relevant_skills)
        user.profession = data.get('profession', user.profession)
        user.desired_job_role = data.get('desired_job_role', user.desired_job_role)

        # Save the updated user information to the database
        db.session.commit()

        # Return the updated user's information as JSON
        return jsonify(user_schema.dump(user))

# Define the user registration endpoint
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        # Extract data from the request
        data = request.form
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'education', 'relevant_skills', 'profession', 'desired_job_role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already in use'}), 400
        
        
        
        
        # Generate a unique verification token
        verification_token = str(uuid.uuid4())

        # Set the token in the new user object
        new_user.email_verification_token = verification_token
        
        # Hash the password
        hashed_password = generate_password_hash(data['password'])
        
        # Define resume directory
        RESUME_DIR = os.path.join(app.root_path, 'resumes')
        if not os.path.exists(RESUME_DIR):
            os.makedirs(RESUME_DIR)

        # Handle file upload for resume
        resume = None
        if 'resume' in request.files:
            resume_file = request.files['resume']
            if resume_file:
                resume_filename = os.path.join(RESUME_DIR, resume_file.filename)
                resume_file.save(resume_filename)
                resume = resume_filename
        
        # Create a new user
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            phone_number=data.get('phone_number'),
            education=data['education'],
            relevant_skills=data['relevant_skills'],
            profession=data['profession'],
            desired_job_role=data['desired_job_role'],
            resume=resume
        )
        
        # Save the user to the database
        db.session.add(new_user)
        db.session.commit()
        

        send_verification_email(data['email'], verification_token)
        # Serialize the new user and send a successful response
        return jsonify(user_schema.dump(new_user)), 201
        
    except Exception as e:
        # Handle any other errors
        print(f'Error registering user: {e}')
        return jsonify({'error': 'Internal server error'}), 500
    # Define the verification endpoint
@app.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        # Deserialize the token
        email = Serializer.loads(token, salt='email-verification', max_age=3600)
        
        # Find the user in the database
        user = User.query.filter_by(email=email).first()
        if user is None:
            return jsonify({'error': 'Invalid token or user not found'}), 400
        
        # Verify the user's email
        user.verified = True
        db.session.commit()
        
        return jsonify({'message': 'Email verified successfully'}), 200
    except:
        return jsonify({'error': 'Invalid or expired token'}), 400
 


   

# Start the Flask app
if __name__ == '__main__':
    app.run(port=5555, debug=True)
