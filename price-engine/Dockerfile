# Use the official Python base image
FROM python:3.13-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app
COPY  requirements.txt .
# Install requirements.txt
RUN pip install -r requirements.txt
# Copy app files
COPY . .



# Expose the port Flask will run on
EXPOSE 5000

# Run the application
CMD ["python", "run.py"]
