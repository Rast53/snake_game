FROM python:3.9-slim

WORKDIR /app

# Устанавливаем зависимости
RUN apt-get update && apt-get install -y \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Копируем проект
COPY . /app

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir pygame Flask

ENV PYTHONUNBUFFERED=1

# Запускаем Flask
CMD ["python", "app.py"]