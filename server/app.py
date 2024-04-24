from flask import Flask, request, jsonify
from sqlalchemy_serializer import Serializer
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os
import uuid
from flask_mail import Mail, Message
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask import render_template_string
from sqlalchemy import Column, Boolean, Engine
from sqlalchemy import text
from flask import Flask, jsonify
from sqlalchemy import create_engine
from flask import redirect, url_for
from flask import send_from_directory


# Initialize the Flask app
app = Flask(__name__)

# Initialize JWTManager
jwt = JWTManager(app)

app.config['JWT_SECRET_KEY'] = '4927'

# Configure CORS
CORS(app, origins=["http://localhost:3000"])

# Configure database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobss.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)


verification_tokens = {}

# Initialize Mail
app.config['MAIL_SERVER']='sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = '826b1a7105478e'
app.config['MAIL_PASSWORD'] = '99a571bbd34f7c'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)




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

# Define User model
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
    is_locked = db.Column(db.Boolean, default=False)
    is_disabled = db.Column(db.Boolean, default=False)

def set_email_verified(self, status=True):
        self.is_email_verified = status
        db.session.commit()


# Define a schema for serializing User data
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)


@app.route('/test-db-connection')
def test_db_connection():
    try:
        # Try to connect to the database
        with Engine.connect() as connection:
            # If connection succeeds, return success message
            return jsonify({'message': 'Database connection successful'})
    except Exception as e:
        # If connection fails, return error message
        return jsonify({'error': 'Failed to connect to the database', 'details': str(e)}), 500



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

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Query the user from the database
    user = User.query.filter_by(email=email).first()
    
    if user:
        # Check if the user's email is verified
        if not user.is_email_verified:
            return jsonify({'error': 'Email not verified'}), 403
        
        # Check if the user's account is locked or disabled
        if user.is_locked or user.is_disabled:
            return jsonify({'error': 'Account locked or disabled'}), 403
        
        # Check if the password is correct
        if check_password_hash(user.password, password):
            # Authentication successful, generate JWT token
            access_token = create_access_token(identity=user.id)
            return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
        else:
            # Invalid password
            return jsonify({'error': 'Invalid credentials'}), 401
    else:
        # User not found
        return jsonify({'error': 'User not found'}), 404

    

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logout successful'}), 200

def extract_jwt_token():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    return None

@app.route('/api/user/profile', methods=['GET', 'PUT'])
@jwt_required()  # This decorator ensures that the request contains a valid JWT token
def user_profile():
    auth_token = extract_jwt_token()
    if not auth_token:
        return jsonify({'error': 'Authorization token is missing'}), 401

    user_id = get_jwt_identity()  # This function returns the identity (user id) stored in the JWT token
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if request.method == 'GET':
        return jsonify(user_schema.dump(user))
    elif request.method == 'PUT':
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.education = data.get('education', user.education)
        user.relevant_skills = data.get('relevant_skills', user.relevant_skills)
        user.profession = data.get('profession', user.profession)
        user.desired_job_role = data.get('desired_job_role', user.desired_job_role)
        db.session.commit()
        return jsonify(user_schema.dump(user))


#from flask import render_template_string

def send_verification_email(user_email, token):
    verification_link = f"http://localhost:5555/api/verify-email/{token}"
    
    # Render the email body using an HTML template
    email_body = render_template_string(
        """
        <p>Please verify your email by clicking on the following link:</p>
        <a href="{{ verification_link }}">{{ verification_link }}</a>
        """,
        verification_link=verification_link
    )

    msg = Message(
        subject='Verify Your Email Address',
        sender='your-email@gmail.com',
        recipients=[user_email]
    )
    msg.html = email_body
    
    # Send the email
    mail.send(msg)
    
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.form

        # Check if 'resume' field exists in the request files
        if 'resume' not in request.files:
            return jsonify({'error': 'Resume file is required'}), 400
        
        resume_file = request.files['resume']
        resume_filename = save_resume(resume_file)

        if not resume_filename:
            return jsonify({'error': 'Failed to save resume'}), 500

        required_fields = ['name', 'email', 'password', 'education', 'relevant_skills', 'profession', 'desired_job_role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already in use'}), 400

        verification_token = str(uuid.uuid4())
        hashed_password = generate_password_hash(data['password'])

        # Send verification email
        send_verification_email(data['email'], verification_token)

        # Create new user
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            phone_number=data.get('phone_number'),
            education=data['education'],
            relevant_skills=data['relevant_skills'],
            profession=data['profession'],
            desired_job_role=data['desired_job_role'],
            resume=resume_filename,
            email_verification_token=verification_token
        )
        db.session.add(new_user)

        # Save verification token and user email in the database
        new_user.email_verification_token = verification_token
        db.session.commit()

        return jsonify(user_schema.dump(new_user)), 201
        
    except Exception as e:
        print(f'Error registering user: {e}')
        return jsonify({'error': 'Internal server error'}), 500


    
def save_resume(resume_file):
        if resume_file:
           resume_filename = f"{uuid.uuid4()}.pdf"  # Generate unique filename
           resume_path = os.path.join(app.root_path, 'resumes', resume_filename)
           resume_file.save(resume_path)
           return resume_filename
        return None

@app.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        # Find user by verification token
        user = User.query.filter_by(email_verification_token=token).first()
        if user:
            # Update user's email verification status
            user.is_email_verified = True
            user.email_verification_token = None
            db.session.commit()
            return jsonify({'message': 'Email verified successfully'}), 200
        else:
            return jsonify({'error': 'Invalid verification token'}), 400

    except Exception as e:
        print(f'Error verifying email: {e}')
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/user/applications/<int:user_id>', methods=['GET'])
def get_user_applications(user_id):
    user_applications = UserApplication.query.filter_by(user_id=user_id).all()
    
    applications_data = []
    for app in user_applications:
        job_listing = JobListing.query.get(app.job_listing_id)
        applications_data.append({
            'id': app.id,
            'job_title': job_listing.title if job_listing else 'Unknown',
            'status': app.status
        })
    
    return jsonify(applications_data)    

@app.route('/api/joblistings', methods=['GET'])
def get_job_listings():
    listings = JobListing.query.all()
    return jsonify([{'id': listing.id, 'title': listing.title, 'description': listing.description, 'status': listing.status} for listing in listings])


@app.route('/api/apply', methods=['POST'])
def apply_for_job():
    data = request.json
    user_id = data.get('user_id')
    job_listing_id = data.get('job_listing_id')
    
    # Check if the user has already applied for this job
    existing_application = UserApplication.query.filter_by(user_id=user_id, job_listing_id=job_listing_id).first()
    if existing_application:
        return jsonify({'error': 'You have already applied for this job'}), 400
    
    new_application = UserApplication(user_id=user_id, job_listing_id=job_listing_id)
    db.session.add(new_application)
    db.session.commit()
    
    return jsonify({'message': 'Application submitted successfully'}), 201

@app.route('/admin/application/status', methods=['PUT'])
def update_application_status():
    data = request.json
    application_id = data.get('application_id')
    status = data.get('status')
    
    application = UserApplication.query.get(application_id)
    if application:
        application.status = status
        db.session.commit()
        return jsonify({'message': 'Application status updated successfully'}), 200
    else:
        return jsonify({'error': 'Application not found'}), 404

def add_is_locked_column():
    # Create a SQL query to add the column to the table
    query = text('ALTER TABLE user ADD COLUMN is_locked BOOLEAN DEFAULT FALSE')
    
    # Execute the SQL query
    with db.engine.connect() as connection:
        connection.execute(query)
def serve_react_app():
    return send_from_directory('server/static', 'index.html')

@app.route('/static/<path:path>')
def serve_static_files(path):
    return send_from_directory('server/static', path)


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5555, debug=True)
