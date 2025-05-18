// Файл: chatBot.js

// Класс ChatBotInitializer инкапсулирует всю логику фронтенд-части чат-бота.
export default class ChatBotInitializer {
  constructor() {
    // Инициализация DOM-элементов и конфигурации при создании экземпляра.
    this.initializeElements();
    this.initializeConfig();
    this.isProcessing = false; // Флаг, указывающий, обрабатывается ли запрос в данный момент.
    this.isFirstMessage = true; // Флаг для отслеживания первого сообщения (сейчас не используется для systemInstruction).
    this.setupEventListeners(); // Настройка обработчиков событий.
  }

  // Находит и сохраняет ссылки на ключевые DOM-элементы.
  initializeElements() {
    const elements = {
      messagesContainer: document.getElementById('chat-messages'),
      messageInput: document.getElementById('message-input'),
      sendButton: document.getElementById('send-button')
    };

    // Проверка наличия всех необходимых элементов для предотвращения ошибок во время выполнения.
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) throw new Error(`Critical UI element not found: ${key}`);
    });

    Object.assign(this, elements); // Присваивание найденных элементов свойствам экземпляра.
  }

  // Инициализация конфигурации чата, включая модель и параметры генерации.
  initializeConfig() {
    this.chatConfig = {
      model: 'gemini-2.0-flash', // Модель Gemini по умолчанию.
      // Потенциальное улучшение: Позволить пользователю выбирать модель или настраивать параметры через UI.
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350 // Ограничение длины ответа бота.
      }
      // Потенциальное улучшение: Добавить возможность настройки safetySettings с фронтенда,
      // если это будет необходимо для кастомизации пользователем.
    };

    // Системная инструкция, определяющая роль и поведение бота.
    this.systemInstruction = 'Ты - дружелюбный помощник, который помогает пользователю с вопросами и задачами. Будь кратким и полезным.';
    // Потенциальное улучшение: Дать пользователю возможность изменять systemInstruction через UI.
  }

  // Настройка обработчиков событий для кнопки отправки и поля ввода.
  setupEventListeners() {
    let debounceTimer;
    // Функция-обработчик для отправки сообщения с debounce для предотвращения слишком частых запросов.
    const handleSendAction = () => {
      if (this.isProcessing) return; // Игнорировать, если запрос уже в обработке.
      clearTimeout(debounceTimer);
      // Debounce: отправка сообщения произойдет через 300 мс после последнего действия (клик/Enter).
      debounceTimer = setTimeout(() => this.handleSendMessage(), 300);
    };

    this.sendButton.addEventListener('click', handleSendAction);
    this.messageInput.addEventListener('keydown', event => {
      // Отправка сообщения по нажатию Enter (если не зажат Shift для переноса строки).
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Предотвратить стандартное поведение Enter (например, перенос строки в textarea).
        handleSendAction();
      }
    });
  }

  // Асинхронная функция обработки отправки сообщения.
  async handleSendMessage() {
    const message = this.messageInput.value.trim(); // Получение и очистка текста сообщения.
    if (!message) return; // Не отправлять пустое сообщение.

    try {
      this.isProcessing = true; // Установить флаг обработки.
      this.updateUIState(true); // Обновить состояние UI (заблокировать ввод и кнопку).

      this.addUserMessage(message); // Отобразить сообщение пользователя в чате.
      this.messageInput.value = ''; // Очистить поле ввода.

      // Формирование полезной нагрузки для запроса к бэкенду.
      // Включает конфигурацию чата, сообщение пользователя и системную инструкцию.
      const payload = {
        ...this.chatConfig,
        message,
        systemInstruction: this.systemInstruction 
        // systemInstruction передается с каждым сообщением, что позволяет бэкенду
        // применять ее корректно, особенно если сессия новая или если бэкенд ее не "запоминает" надолго.
      };

      // Отправка запроса с таймаутом и ожидание ответа.
      const botResponseText = await this.sendMessageWithTimeout(payload); 
      if (botResponseText) { // Если получен валидный текстовый ответ.
        this.addBotMessage(botResponseText); // Отобразить ответ бота.
        // this.isFirstMessage = false; // Флаг первого сообщения, если он еще нужен для какой-то логики.
                                     // В текущей реализации systemInstruction передается всегда,
                                     // поэтому этот флаг может быть не критичен для этой цели.
      }
    } catch (error) {
      this.logError(error); // Логирование ошибки в консоль.
      this.handleError(error); // Отображение ошибки пользователю.
    } finally {
      this.isProcessing = false; // Сбросить флаг обработки.
      this.updateUIState(false); // Восстановить состояние UI.
    }
  }

  // Отправка запроса на бэкенд с использованием fetch и AbortController для таймаута.
  async sendMessageWithTimeout(payload) {
    const controller = new AbortController(); // Контроллер для прерывания запроса.
    // Таймаут в 30 секунд. Если ответ не получен, запрос будет прерван.
    const timeoutId = setTimeout(() => controller.abort(), 30000); 
    // Потенциальное улучшение: Сделать таймаут настраиваемым.

    try {
      const response = await fetch('/api/ai/gemini/text-chat', { // Эндпоинт бэкенда.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // Часто используется для идентификации AJAX-запросов.
        },
        body: JSON.stringify(payload), // Тело запроса в формате JSON.
        signal: controller.signal, // Привязка AbortController к запросу.
        credentials: 'same-origin' // Важно для корректной работы сессий (cookies).
      });

      clearTimeout(timeoutId); // Очистка таймаута, так как ответ (или ошибка сети) получен.

      if (!response.ok) {
        // Обработка HTTP-ошибок (статус не 2xx).
        const errorText = await response.text(); // Попытка получить тело ошибки.
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json(); // Парсинг JSON-ответа.

      // Проверка структуры ответа от бэкенда. Ожидается объект с полем "text".
      if (data && typeof data.text === 'string') {
        return data.text; // Возвращаем текст ответа бота.
      } else {
        // Если формат ответа некорректный.
        console.error('Unexpected API response format:', data);
        throw new Error('Получен некорректный формат ответа от сервера.'); 
      }

    } catch (error) {
      // Важно: clearTimeout(timeoutId) уже был вызван в `try` блоке, если ответ пришел.
      // Если ошибка произошла до `clearTimeout` (например, сеть недоступна), `timeoutId` еще активен.
      // Если ошибка - `AbortError`, значит сработал наш таймаут.
      // Повторный `clearTimeout` здесь не навредит, но уже не всегда нужен.
      // Для чистоты можно оставить как есть или добавить проверку `if (timeoutId) clearTimeout(timeoutId);`
      // но основная логика очистки в `try` при успешном ответе/сетевой ошибке до таймаута.
      if (error.name === 'AbortError') {
        // Специфическая ошибка для таймаута.
        throw new Error('Превышено время ожидания ответа');
      }
      throw error; // Переброс других ошибок.
    }
  }

  // Логирование ошибок в консоль разработчика.
  logError(error) {
    console.error('Chat error:', error);
  }

  // Обновление состояния элементов UI в зависимости от статуса загрузки.
  updateUIState(isLoading) {
    this.sendButton.disabled = isLoading;
    this.messageInput.disabled = isLoading;
    // Атрибут aria-busy важен для доступности (accessibility), указывает на занятость элемента.
    this.sendButton.setAttribute('aria-busy', isLoading.toString()); 
    this.messageInput.placeholder = isLoading ? 'Отправка...' : 'Напишите сообщение...';
    // Потенциальное улучшение: Добавить визуальный индикатор загрузки (spinner).
  }

  // Обработка ошибок для отображения пользователю.
  handleError(error) {
    // Формирование сообщения об ошибке для пользователя.
    const errorMessage = error.message === 'Превышено время ожидания ответа' || error.message.includes('Получен некорректный формат ответа от сервера.')
      ? error.message 
      : 'Произошла ошибка при обработке запроса. Попробуйте позже.'; // Общее сообщение.

    this.addBotMessage(`⚠️ ${errorMessage}`); // Отображение сообщения об ошибке в интерфейсе чата.
    // Потенциальное улучшение: Использовать более дружелюбные уведомления (например, toast-сообщения).
  }

  // Добавляет сообщение пользователя в контейнер чата.
  addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'd-flex justify-content-end mb-2'; // Стили для выравнивания справа.
    const innerDiv = document.createElement('div');
    innerDiv.className = 'bg-primary-subtle text-primary-emphasis p-2 rounded'; // Стили для сообщения пользователя.
    innerDiv.style.maxWidth = '80%';
    innerDiv.textContent = text;
    messageDiv.appendChild(innerDiv);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight; // Автопрокрутка к последнему сообщению.
    // Потенциальное улучшение: Рассмотреть использование шаблонизаторов или Virtual DOM
    // для более эффективного обновления списка сообщений при большом их количестве.
  }

  // Добавляет сообщение бота в контейнер чата.
  addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'd-flex justify-content-start mb-2'; // Стили для выравнивания слева.
    const innerDiv = document.createElement('div');
    innerDiv.className = 'bg-success-subtle text-success-emphasis p-2 rounded'; // Стили для сообщения бота.
    innerDiv.style.maxWidth = '80%';
    // Потенциальное улучшение: Добавить поддержку Markdown или HTML-форматирования для ответов бота.
    // Это потребует безопасной обработки HTML (санитизации) во избежание XSS.
    // Потенциальное улучшение: Реализовать эффект "печатания" для сообщений бота.
    innerDiv.textContent = text;
    messageDiv.appendChild(innerDiv);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight; // Автопрокрутка.
  }
}