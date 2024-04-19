from flask import Flask, request, jsonify
from sqlalchemy_serializer import Serializer
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os
import uuid
from flask_mail import Mail, Message

# Initialize the Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, origins=["http://localhost:3000"])

# Configure database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobs.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)

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

# Initialize database
with app.app_context():
    db.create_all()

# Define a schema for serializing User data
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)

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

@app.route('/api/user/profile', methods=['GET', 'PUT'])
def user_profile():
    user_email = 'user@example.com'
    user = User.query.filter_by(email=user_email).first()
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


# Define the function to send verification email
def send_verification_email(user_email, token):
    # Create the verification link
    verification_link = f"http://localhost:5555/api/verify-email/{token}"
    
    # Create the message
    msg = Message(
        subject='Verify Your Email Address',
        sender='your-email@gmail.com',
        recipients=[user_email]
    )
    msg.body = f"Please verify your email by clicking on the following link: {verification_link}"
    
    # Send the email
    mail.send(msg)


@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.form
        required_fields = ['name', 'email', 'password', 'education', 'relevant_skills', 'profession', 'desired_job_role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already in use'}), 400

        verification_token = str(uuid.uuid4())
        hashed_password = generate_password_hash(data['password'])
        RESUME_DIR = os.path.join(app.root_path, 'resumes')
        if not os.path.exists(RESUME_DIR):
            os.makedirs(RESUME_DIR)
        resume = None
        if 'resume' in request.files:
            resume_file = request.files['resume']
            if resume_file:
                resume_filename = os.path.join(RESUME_DIR, resume_file.filename)
                resume_file.save(resume_filename)
                resume = resume_filename
        
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
            email_verification_token=verification_token
        )
        db.session.add(new_user)
        db.session.commit()

        send_verification_email(data['email'], verification_token)
        return jsonify(user_schema.dump(new_user)), 201
        
    except Exception as e:
        print(f'Error registering user: {e}')
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        serializer = Serializer(app.config['SECRET_KEY'], salt='email-verification')
        email = serializer.loads(token, max_age=3600)
        user = User.query.filter_by(email=email).first()
        if user is None:
            return jsonify({'error': 'Invalid token or user not found'}), 400
        
        if user.is_email_verified:
            return jsonify({'message': 'Email already verified'}), 200
        
        user.is_email_verified = True
        db.session.commit()
        
        return jsonify({'message': 'Email verified successfully'}), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': 'Invalid or expired token'}), 400
    
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


if __name__ == '__main__':
    app.run(port=5555, debug=True)
