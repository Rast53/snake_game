from flask import Flask, render_template
import pygame
import random

app = Flask(__name__)

@app.route('/')
def index():
    # Ваш код для инициализации и запуска Pygame
    # Вместо pygame.display.set_mode() используйте Flask для отдачи HTML и JavaScript
    return render_template('index.html')  # HTML-файл с веб-версией игры

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)