document.addEventListener("DOMContentLoaded", function () {
  const announcementText = document.getElementById("announcement-text");
  const messages = [
    `<div class="d-flex align-items-center">
      <svg xmlns="http://www.w3.org/2000/svg" 
        width="1rem" height="1rem" 
        fill="currentColor" 
        class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" 
        viewBox="0 0 16 16"
      >
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
      </svg>
      <span>
        Вас видно в сети! Вы уязвимы, и это проблема
      </span>
    </div>`,
    
    `<div class="d-flex align-items-center">
      <span class="me-2">
        Шифры – команда программирования и экспертов по кибербезопасности
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" 
        width="1rem" height="1rem" 
        fill="currentColor" 
        class="bi bi-emoji-wink-fill flex-shrink-0" 
        viewBox="0 0 16 16"
      >
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M7 6.5C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5M4.285 9.567a.5.5 0 0 0-.183.683A4.5 4.5 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.5 3.5 0 0 1 8 11.5a3.5 3.5 0 0 1-3.032-1.75.5.5 0 0 0-.683-.183m5.152-3.31a.5.5 0 0 0-.874.486c.33.595.958 1.007 1.687 1.007s1.356-.412 1.687-1.007a.5.5 0 0 0-.874-.486.93.93 0 0 1-.813.493.93.93 0 0 1-.813-.493"/>
      </svg>
    </div>`,

    `<span>
      Готовы к диалогу? Пишите: 
      <a href="#" class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">dos@ya.ru</a>
    </span>`
  ];

  let messageIndex = 0;
  const speedPerPixel = 0.012; // Время в секундах на один пиксель движения

  // Функция для обновления текста и запуска анимации
  function updateMessage() {
    // Устанавливаем новое сообщение
    announcementText.innerHTML = messages[messageIndex];

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
