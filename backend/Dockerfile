FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies + git (needed for GitPython)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Optional: silence GitPython warnings
ENV GIT_PYTHON_REFRESH=quiet

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]