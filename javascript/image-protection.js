document.addEventListener('DOMContentLoaded', function() {
    // Находим все изображения с классом 'protected' для применения защиты
    const protectedImages = document.querySelectorAll('img.protected');

    protectedImages.forEach(function(img) {
        // Отключаем правый клик для изображений
        img.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });

        // Отключаем возможность перетаскивания изображений
        img.addEventListener('dragstart', function(event) {
            event.preventDefault();
        });
    });
});

  