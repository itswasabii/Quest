from sqlalchemy import create_engine, text

# Define SQLAlchemy engine
engine = create_engine('sqlite:///jobs.db')

# Define the CREATE TABLE query for the "user" table
create_table_query = text("""
CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    education VARCHAR(100),
    relevant_skills VARCHAR(200),
    profession VARCHAR(100),
    desired_job_role VARCHAR(100),
    resume VARCHAR(100),
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(100),
    is_locked BOOLEAN DEFAULT FALSE,
    is_disabled BOOLEAN DEFAULT FALSE
)
""")

# Execute the CREATE TABLE query
with engine.connect() as conn:
    conn.execute(create_table_query)

# Define the ALTER TABLE query
alter_query = text("""
ALTER TABLE "user"
ADD COLUMN is_disabled BOOLEAN DEFAULT FALSE
""")

# Execute the ALTER TABLE query
with engine.connect() as conn:
    conn.execute(alter_query)
