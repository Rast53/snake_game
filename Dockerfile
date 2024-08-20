# Используем официальный образ Python
FROM python:3.9-slim

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Устанавливаем зависимости, включая необходимые для Pygame
RUN apt-get update && apt-get install -y \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Копируем все файлы проекта в рабочую директорию контейнера
COPY . /app

# Устанавливаем Python-зависимости
RUN pip install --no-cache-dir pygame

# Устанавливаем переменную окружения для запуска приложения
ENV PYTHONUNBUFFERED=1

# Запускаем приложение
CMD ["python", "snake.py"]
