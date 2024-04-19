from app import app, db, User, JobListing, UserApplication

def seed_database():
    # Set up the application context
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Add sample data for Users
        users = [
            User(
                name='John Doe',
                email='john.doe@example.com',
                password='password123',
                phone_number='123-456-7890',
                education='B.S. in Computer Science',
                relevant_skills='Python, JavaScript',
                profession='Software Engineer',
                desired_job_role='Full Stack Developer',
                is_email_verified=True
            ),
            User(
                name='Jane Smith',
                email='jane.smith@example.com',
                password='password123',
                phone_number='987-654-3210',
                education='B.A. in Marketing',
                relevant_skills='SEO, Copywriting',
                profession='Marketing Specialist',
                desired_job_role='Content Marketing Manager',
                is_email_verified=True
            ),
            # Add more users if needed
        ]

        db.session.bulk_save_objects(users)
        db.session.commit()

        # Add sample data for Job Listings
        job_listings = [
            JobListing(
                title='Full Stack Developer',
                description='Looking for an experienced full stack developer to join our team. Proficiency in Python and JavaScript required.',
                status='Active'
            ),
            JobListing(
                title='Marketing Manager',
                description='Seeking a creative and motivated marketing manager to lead our team.',
                status='Active'
            ),
            # Add more job listings if needed
        ]

        db.session.bulk_save_objects(job_listings)
        db.session.commit()

        # Add sample data for User Applications
        applications = [
            UserApplication(
                user_id=1,  # Assuming John Doe has ID 1
                job_listing_id=1,  # Assuming Full Stack Developer has ID 1
                status='Pending'
            ),
            UserApplication(
                user_id=2,  # Assuming Jane Smith has ID 2
                job_listing_id=2,  # Assuming Marketing Manager has ID 2
                status='Pending'
            ),
            # Add more applications if needed
        ]

        db.session.bulk_save_objects(applications)
        db.session.commit()

        print('Database seeded with sample data.')

if __name__ == '__main__':
    seed_database()
