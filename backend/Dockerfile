# 使用官方 Python 3.11 slim 版本作為基礎
FROM python:3.11-slim

WORKDIR /app

# 先複製 requirements.txt，利用 Layer Cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 建立非 root 使用者
RUN adduser --disabled-password --gecos '' appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
