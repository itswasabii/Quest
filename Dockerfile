# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the app.py file into the container at /app
COPY server/app.py /app/app.py

# Install Flask and its dependencies
RUN pip install flask

# Make port 5555 available to the world outside this container
EXPOSE 5555

# Define the command to run your Flask app when the container starts
CMD ["python", "app.py"]
