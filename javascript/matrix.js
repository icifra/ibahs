class MatrixEffect {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        // Настройки
        this.settings = {
            fontSize: 16, // Размер текста (по умолчанию)
            textColor: "#00FF00", // Зеленый цвет текста (по умолчанию)
            backgroundFade: 0.05, // Шлейф затухания (по умолчанию)
            speed: 1, // Скорость движения (по умолчанию)
            symbols: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789", // Символы (по умолчанию)
            ...options, // Переопределяем значениями из matrix = new MatrixEffect(...options)
        };

        // Позиции для анимации
        this.columns = [];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.initialize();
        window.addEventListener("resize", () => this.resize());
    }

    // Инициализация
    initialize() {
        const { fontSize } = this.settings;
        this.columns = Array(Math.floor(this.canvas.width / fontSize)).fill(0);
    }

    // Обновление размеров холста
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initialize();
    }

    // Отрисовка кадра
    draw() {
        const { fontSize, textColor, backgroundFade, symbols, speed } = this.settings;

        // Затемняем предыдущий кадр
        this.ctx.fillStyle = `rgba(0, 0, 0, ${backgroundFade})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Настройка текста
        this.ctx.font = `${fontSize}px monospace`;
        this.ctx.fillStyle = textColor;

        // Рендер символов
        this.columns.forEach((y, index) => {
            // Редкое изменение символов
            if (Math.random() > 0.95) { // Меняем символы реже
                const text = symbols.charAt(Math.floor(Math.random() * symbols.length));
                const x = index * fontSize;
                this.ctx.fillText(text, x, y * fontSize);
            }

            // Движение текста вниз
            if (y * fontSize > this.canvas.height && Math.random() > 0.975) {
                this.columns[index] = 0; // Обнуляем колонку
            } else {
                this.columns[index] += speed; // Увеличиваем позицию
            }
        });
    }

    // Анимация
    start() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Пользовательские настройки
const matrix = new MatrixEffect("matrix", {
    fontSize: 16, // Размер символов
    textColor: "#00FF00", // Цвет текста
    backgroundFade: 0.05, // Затухание шлейфа (от 0 до 1) Чем выше значение, тем быстрее затухает шлейф
    speed: 0.1, // Скорость движения
});
matrix.start();
