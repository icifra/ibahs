document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    let lastScrollTop = 0; // Последняя известная позиция скролла

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY; // Современный способ получения текущей позиции скролла

        if (scrollTop > lastScrollTop) {
            // Скроллим вниз — скрываем навбар
            navbar.style.top = `-${navbar.offsetHeight}px`;
        } else {
            // Скроллим вверх — показываем навбар
            navbar.style.top = "0";
        }

        // Обновляем последнюю позицию скролла
        lastScrollTop = Math.max(scrollTop, 0); // Убеждаемся, что скролл не уходит в отрицательные значения
    });
});
