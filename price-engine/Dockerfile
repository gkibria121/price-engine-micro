# Use the official Python base image
FROM python:3.13-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Run the application
RUN pip install "uvicorn[standard]"
RUN pip install httpx pytest pytest-asyncio pytest-cov pytest-mock
# Set work directory
WORKDIR /app
COPY  requirements.txt .
# Install requirements.txt
RUN pip install -r requirements.txt
# Copy app files
COPY . .



# Expose the port Flask will run on
EXPOSE 5000



CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "5000","--reload"]
