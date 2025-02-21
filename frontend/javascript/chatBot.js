export default class ChatBotInitializer {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.messageInput = document.getElementById('message-input');
    this.sendButton = document.getElementById('send-button');

    this.chatConfig = {
      model: 'gemini-2.0-flash',
      systemInstruction: 'Вы дружелюбный ассистент. Отвечайте кратко и по существу.',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    };

    this.isSessionInitialized = false;
  }

  initialize() {
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.messageInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.handleSendMessage();
    });

    this.initializeChat();
  }

  async initializeChat() {
    try {
      const response = await this.sendMessage('', true);
      if (response) {
        this.addBotMessage(response);
        this.isSessionInitialized = true;
      }
    } catch (error) {
      console.error('Ошибка инициализации чата:', error);
    }
  }

  async handleSendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    this.messageInput.value = '';

    try {
      const response = await this.sendMessage(message);
      if (response) this.addBotMessage(response);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  }

  async sendMessage(message, isInitial = false) {
    const payload = {
      model: this.chatConfig.model,
      message,
      generationConfig: this.chatConfig.generationConfig
    };

    if (isInitial) {
      payload.systemInstruction = this.chatConfig.systemInstruction;
    }

    try {
      const response = await fetch('/api/ai/gemini/text-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw error;
    }
  }

  addUserMessage(text) {
    const messageHtml = `
      <div class="d-flex justify-content-end mb-2">
        <div class="bg-primary text-white p-2 rounded" style="max-width: 80%;">
          ${text}
        </div>
      </div>`;
    this.appendMessage(messageHtml);
  }

  addBotMessage(text) {
    const messageHtml = `
      <div class="d-flex justify-content-start mb-2">
        <div class="bg-success p-2 rounded" style="max-width: 80%;">
          ${text}
        </div>
      </div>`;
    this.appendMessage(messageHtml);
  }

  appendMessage(messageHtml) {
    this.messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}