from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import uuid
from flask_mail import Mail, Message
from flask_migrate import Migrate

# Initialize the app and CORS
# Initialize CORS and the app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Adjust the allowed origin as needed

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)


CORS(app, origins=["http://localhost:3000"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobs.db'
db = SQLAlchemy(app)

# Define JobListing model
class JobListing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Active')

# Define UserApplication model
class UserApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    job_listing_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Pending')

# Initialize database
with app.app_context():
    db.create_all()

# Routes for Job Listings
@app.route('/admin/joblistings', methods=['GET', 'POST'])
def admin_job_listings():
    if request.method == 'GET':
        listings = JobListing.query.all()
        return jsonify([{'id': listing.id, 'title': listing.title, 'description': listing.description, 'status': listing.status} for listing in listings])
    elif request.method == 'POST':
        data = request.json
        new_listing = JobListing(title=data['title'], description=data['description'])
        db.session.add(new_listing)
        db.session.commit()
        return jsonify({'message': 'Job listing added successfully'}), 201

@app.route('/admin/applications', methods=['GET', 'PUT'])
def admin_applications():
    if request.method == 'GET':
        applications = UserApplication.query.all()
        return jsonify([{'id': application.id, 'user_id': application.user_id, 'job_listing_id': application.job_listing_id, 'status': application.status} for application in applications])
    elif request.method == 'PUT':
        data = request.json
        application = UserApplication.query.get(data['id'])
        if application:
            application.status = data['status']
            db.session.commit()
            return jsonify({'message': 'Application status updated successfully'}), 200
        else:
            return jsonify({'error': 'Application not found'}), 404

# User authentication routes
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    users = {'example@example.com': 'password'}  # Moved the users dictionary here
    if email in users and users[email] == password:
        return jsonify({'message': 'Login successful', 'token': 'dummy-token'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logout successful'}), 200
 

# Configure mail settings
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'


mail = Mail(app)

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
    is_email_verified = db.Column(db.Boolean, default=False)
    email_verification_token = db.Column(db.String(100), nullable=True)

# Create the database and tables
with app.app_context():
    db.create_all()

# Define a schema for serializing User data
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Define the function to send verification email
def send_verification_email(user_email, token):
    verification_link = f"http://localhost:5555/verify-email/{token}"
    msg = Message(
        subject="Verify Your Email Address",
        sender=app.config['MAIL_USERNAME'],
        recipients=[user_email]
    )
    msg.body = f"Please verify your email by clicking on the link: {verification_link}"
    mail.send(msg)

# User profile retrieval and update endpoint
@app.route('/api/user/profile', methods=['GET', 'PUT'])
def user_profile():
    user_email = request.args.get('email')  # Use query parameter to identify the user
    
    # Find the user in the database
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if request.method == 'GET':
        # Return the user's information
        return jsonify(user_schema.dump(user))
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Update user data
        user.name = data.get('name', user.name)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.education = data.get('education', user.education)
        user.relevant_skills = data.get('relevant_skills', user.relevant_skills)
        user.profession = data.get('profession', user.profession)
        user.desired_job_role = data.get('desired_job_role', user.desired_job_role)
        
        db.session.commit()  # Save changes to the database
        return jsonify(user_schema.dump(user))

# User registration endpoint
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        # Extract data from the request form
        data = request.form
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'education', 'relevant_skills', 'profession', 'desired_job_role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if the email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already in use'}), 400
        
        # Generate a unique verification token
        verification_token = str(uuid.uuid4())
        
        # Hash the password
        hashed_password = generate_password_hash(data['password'])
        
        # Handle file upload for resume
        RESUME_DIR = os.path.join(app.root_path, 'resumes')
        if not os.path.exists(RESUME_DIR):
            os.makedirs(RESUME_DIR)
        
        resume = None
        if 'resume' in request.files:
            resume_file = request.files['resume']
            if resume_file:
                resume_filename = os.path.join(RESUME_DIR, str(uuid.uuid4()) + "_" + resume_file.filename)
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
            resume=resume,
            is_email_verified=False,
            email_verification_token=verification_token
        )
        
        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()
        
        # Send a verification email to the user
        send_verification_email(data['email'], verification_token)
        
        # Return a successful response
        return jsonify(user_schema.dump(new_user)), 201
    
    except Exception as e:
        print(f"Error registering user: {e}")
        return jsonify({'error': 'Internal server error'}), 500
    # Define the verification endpoint
    
@app.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        # Find the user with the given verification token
        user = User.query.filter_by(email_verification_token=token).first()
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 400
        
        # Verify the user's email
        user.is_email_verified = True
        user.email_verification_token = None
        db.session.commit()
        
        return jsonify({'message': 'Email verified successfully'}), 200
    except:
        return jsonify({'error': 'Invalid or expired token'}), 400
 
# Start the Flask app
if __name__ == '__main__':
    app.run(port=5555, debug=True)


