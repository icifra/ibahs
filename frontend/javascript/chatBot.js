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

    this.systemInstruction = 'Вы дружелюбный ассистент. Отвечайте кратко и по существу.';
  }

  setupEventListeners() {
    let debounceTimer;
    const handleSendAction = () => {
      if (this.isProcessing) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.handleSendMessage(), 300);
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
      this.logError(error);
      this.handleError(error);
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Превышено время ожидания ответа');
      }
      throw error;
    }
  }

  logError(error) {
    console.error('Chat error:', error);
  }

  updateUIState(isLoading) {
    this.sendButton.disabled = isLoading;
    this.messageInput.disabled = isLoading;
    this.sendButton.setAttribute('aria-busy', isLoading);
    this.messageInput.placeholder = isLoading ? 'Отправка...' : 'Напишите сообщение...';
  }

  handleError(error) {
    const errorMessage = error.message === 'Превышено время ожидания ответа'
      ? 'Превышено время ожидания ответа. Попробуйте еще раз.'
      : 'Произошла ошибка при обработке запроса. Попробуйте позже.';

    this.addBotMessage(`⚠️ ${errorMessage}`);
  }

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