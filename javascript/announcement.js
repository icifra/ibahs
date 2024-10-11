// Настройка скорости анимации
// Меняет скорость анимации текста объявления
document.addEventListener("DOMContentLoaded", function() {
    const announcementText = document.getElementById("announcement-text");
    
    // Устанавливаем начальную скорость анимации (время в секундах)
    let animationSpeed = 16; // Регулирование скорости в JS
    
    // Применяем скорость анимации
    announcementText.style.animation = `scroll-text ${animationSpeed}s linear infinite`;
});
