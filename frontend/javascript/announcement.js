document.addEventListener("DOMContentLoaded", function () {
  const announcementText = document.getElementById("announcement-text");
  const messages = [
    "Вас видно в сети! Вы уязвимы. И это проблема",
    "Шифры – команда программирования и экспертов по кибербезопасности",
    "Готовы к диалогу? Пишите: dos@ya.ru"
  ];

  let messageIndex = 0;
  const speedPerPixel = 0.012; // Время в секундах на один пиксель движения

  // Функция для обновления текста и запуска анимации
  function updateMessage() {
    // Устанавливаем новое сообщение
    announcementText.textContent = messages[messageIndex];

    // Рассчитываем длину текста и ширину контейнера
    const textWidth = announcementText.offsetWidth;
    const containerWidth = announcementText.parentElement.offsetWidth;

    // Устанавливаем продолжительность анимации
    const animationDuration = (textWidth + containerWidth) * speedPerPixel;

    // Применяем параметры анимации и позиционирования
    announcementText.style.transition = "none"; // Отключаем анимацию на время позиционирования
    announcementText.style.transform = `translateX(${containerWidth}px)`; // Начальная позиция за правой границей контейнера

    // Включаем анимацию с небольшой задержкой, чтобы установка позиции прошла успешно
    setTimeout(() => {
      announcementText.style.transition = `transform ${animationDuration}s linear`;
      announcementText.style.transform = `translateX(-${textWidth}px)`;
    }, 50);

    // Переход к следующему сообщению
    messageIndex = (messageIndex + 1) % messages.length;
  }

  // Запускаем первое сообщение
  setTimeout(updateMessage, 3000); // В первый раз с задержкой в несколько секунд

  // Слушаем завершение анимации для запуска следующего сообщения
  announcementText.addEventListener("transitionend", updateMessage);
});
