FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run uvicorn on port 8000
CMD ["uvicorn", "app.main:app", "--reload", "0.0.0.0", "--port", "8000"]
