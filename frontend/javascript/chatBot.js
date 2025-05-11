// Файл: chatBot.js
export default class ChatBotInitializer {
  constructor() {
    this.initializeElements();
    this.initializeConfig();
    this.isProcessing = false;
    this.isFirstMessage = true;
    this.setupEventListeners();
  }

  initializeElements() {
    const elements = {
      messagesContainer: document.getElementById('chat-messages'),
      messageInput: document.getElementById('message-input'),
      sendButton: document.getElementById('send-button')
    };

    Object.entries(elements).forEach(([key, element]) => {
      if (!element) throw new Error(`Critical UI element not found: ${key}`);
    });

    Object.assign(this, elements);
  }

  initializeConfig() {
    this.chatConfig = {
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350
      }
    };

    this.systemInstruction = 'Ты - дружелюбный помощник, который помогает пользователю с вопросами и задачами. Будь кратким и полезным.';
  }

  setupEventListeners() {
    let debounceTimer;
    const handleSendAction = () => {
      if (this.isProcessing) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.handleSendMessage(), 300); // Твой оригинальный debounce
    };

    this.sendButton.addEventListener('click', handleSendAction);
    this.messageInput.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendAction();
      }
    });
  }

  async handleSendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    // try/catch/finally и управление isProcessing/updateUIState остаются как в твоем оригинале
    try {
      this.isProcessing = true;
      this.updateUIState(true);

      this.addUserMessage(message);
      this.messageInput.value = '';

      const payload = {
        ...this.chatConfig,
        message,
        systemInstruction: this.systemInstruction
      };

      // Вызываем sendMessageWithTimeout, который теперь будет правильно обрабатывать ответ
      const botResponseText = await this.sendMessageWithTimeout(payload); 
      if (botResponseText) { // Проверяем, что botResponseText не пустой или undefined
        this.addBotMessage(botResponseText);
        this.isFirstMessage = false;
      }
    } catch (error) {
      this.logError(error); // Твой оригинальный logError
      this.handleError(error); // Твой оригинальный handleError
    } finally {
      this.isProcessing = false;
      this.updateUIState(false);
    }
  }

  async sendMessageWithTimeout(payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('/api/ai/gemini/text-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'same-origin'
      });

      clearTimeout(timeoutId); // <-- ВАЖНО: Очищаем таймаут здесь, если ответ получен

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();

      // --- ОСНОВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
      // Бэкенд теперь возвращает { "text": "..." }
      if (data && typeof data.text === 'string') {
        return data.text;
      } else {
        // Если формат ответа неожиданный, логируем и возвращаем null или выбрасываем ошибку
        console.error('Unexpected API response format:', data);
        // Можно вернуть специальное сообщение об ошибке или null, чтобы handleError его обработал
        throw new Error('Получен некорректный формат ответа от сервера.'); 
      }
      // --- КОНЕЦ ОСНОВНОГО ИЗМЕНЕНИЯ ---

    } catch (error) {
      // clearTimeout(timeoutId); // Уже очищен выше, если запрос был успешным до этой точки.
                               // Если ошибка произошла до clearTimeout (например, сеть упала до fetch),
                               // то timeoutId еще активен и его очистка здесь имеет смысл,
                               // но если это AbortError, то controller уже сделал свое дело.
                               // Для простоты и избежания двойной очистки оставим как было,
                               // т.к. основная очистка теперь в try.
      if (error.name === 'AbortError') {
        throw new Error('Превышено время ожидания ответа');
      }
      throw error;
    }
  }

  logError(error) {
    console.error('Chat error:', error); // Твоя оригинальная функция
  }

  updateUIState(isLoading) {
    this.sendButton.disabled = isLoading;
    this.messageInput.disabled = isLoading;
    this.sendButton.setAttribute('aria-busy', isLoading.toString()); // Убедимся, что это строка
    this.messageInput.placeholder = isLoading ? 'Отправка...' : 'Напишите сообщение...'; // Твои оригинальные плейсхолдеры
  }

  handleError(error) {
    // Твоя оригинальная логика обработки ошибок
    const errorMessage = error.message === 'Превышено время ожидания ответа' || error.message.includes('Получен некорректный формат ответа от сервера.')
      ? error.message // Показываем специфичное сообщение об ошибке
      : 'Произошла ошибка при обработке запроса. Попробуйте позже.';

    this.addBotMessage(`⚠️ ${errorMessage}`);
  }

  // Твои оригинальные методы addUserMessage и addBotMessage
  addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'd-flex justify-content-end mb-2';
    const innerDiv = document.createElement('div');
    innerDiv.className = 'bg-primary-subtle text-primary-emphasis p-2 rounded';
    innerDiv.style.maxWidth = '80%';
    innerDiv.textContent = text;
    messageDiv.appendChild(innerDiv);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'd-flex justify-content-start mb-2';
    const innerDiv = document.createElement('div');
    innerDiv.className = 'bg-success-subtle text-success-emphasis p-2 rounded';
    innerDiv.style.maxWidth = '80%';
    innerDiv.textContent = text;
    messageDiv.appendChild(innerDiv);
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}