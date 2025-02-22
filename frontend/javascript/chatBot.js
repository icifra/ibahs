// chatBot.js
export default class ChatBotInitializer {
  constructor() {
    this.initializeElements();
    this.initializeConfig();
    this.isProcessing = false; // Флаг активного запроса
    this.isFirstMessage = true; // Флаг первого сообщения
    this.setupEventListeners();
  }

  initializeElements() {
    const elements = {
      messagesContainer: document.getElementById('chat-messages'),
      messageInput: document.getElementById('message-input'),
      sendButton: document.getElementById('send-button')
    };

    // Валидация критических элементов UI
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) throw new Error(`Required DOM element not found: ${key}`);
    });

    Object.assign(this, elements);
  }

  initializeConfig() {
    this.chatConfig = {
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
      /* Опциональные настройки безопасности
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
      */
    };

    this.systemInstruction = 'Вы дружелюбный ассистент. Отвечайте кратко и по существу.';
  }

  setupEventListeners() {
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.messageInput.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.handleSendMessage();
      }
    });
  }

  async handleSendMessage() {
    if (this.isProcessing) return;
    
    const message = this.messageInput.value.trim();
    if (!message) return;

    try {
      this.isProcessing = true;
      this.updateUIState(true);
      
      this.addUserMessage(message);
      this.messageInput.value = '';

      const payload = {
        ...this.chatConfig,
        message,
        ...(this.isFirstMessage && { systemInstruction: this.systemInstruction })
      };

      const response = await this.sendMessageWithTimeout(payload);
      if (response) {
        this.addBotMessage(response);
        this.isFirstMessage = false;
      }
    } catch (error) {
      console.error('Chat error:', error);
      this.handleError(error);
    } finally {
      this.isProcessing = false;
      this.updateUIState(false);
    }
  }

  async sendMessageWithTimeout(payload) {
    const controller = new AbortController();
    
    try {
      const response = await Promise.race([
        fetch('/api/ai/gemini/text-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        }),
        new Promise((_, reject) => 
          setTimeout(() => {
            controller.abort();
            reject(new Error('Request timeout'));
          }, 60000) // 60 секунд максимальное время ожидания ответа
        )
      ]);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Превышено время ожидания ответа');
      }
      throw error;
    }
  }

  updateUIState(isLoading) {
    this.sendButton.disabled = isLoading;
    this.messageInput.disabled = isLoading;
  }

  handleError(error) {
    const errorMessage = error.message === 'Request timeout' 
      ? 'Извините, сервер не отвечает. Попробуйте повторить запрос.'
      : 'Произошла ошибка при обработке запроса. Попробуйте позже.';
    
    this.addBotMessage(`⚠️ ${errorMessage}`);
  }

  addUserMessage(text) {
    const messageHtml = `
      <div class="d-flex justify-content-end mb-2">
        <div class="bg-primary-subtle text-primary-emphasis p-2 rounded" style="max-width: 80%;">
          ${this.escapeHtml(text)}
        </div>
      </div>`;
    this.appendMessage(messageHtml);
  }

  addBotMessage(text) {
    const messageHtml = `
      <div class="d-flex justify-content-start mb-2">
        <div class="bg-success-subtle text-success-emphasis p-2 rounded" style="max-width: 80%;">
          ${this.escapeHtml(text)}
        </div>
      </div>`;
    this.appendMessage(messageHtml);
  }

  appendMessage(messageHtml) {
    this.messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}