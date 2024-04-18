from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
