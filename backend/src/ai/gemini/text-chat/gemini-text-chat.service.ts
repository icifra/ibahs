import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Google AI SDK
import { GoogleGenerativeAI, GenerateContentResponse, ChatSession } from '@google/generative-ai';

import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';

@Injectable()
export class GeminiTextChatService {
  // Приватные свойства
  private readonly genAI: GoogleGenerativeAI;
  private chatHistory: Map<string, ChatSession> = new Map();

  // Конструктор сервиса
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    // Проверка ключа
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in .env file');
      throw new InternalServerErrorException(
        'Google Gemini API Key is not configured.',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey); // Инициализация SDK
    console.log('GeminiTextChatService initialized.');
  }
  // Метод chat
  async chat(requestDto: GeminiTextChatRequestDto, sessionId: string): Promise<GenerateContentResponse> {

    try {
      let chat: ChatSession; // <-- хранит объект сессии чата

      // Проверка наличия сессии
      if (this.chatHistory.has(sessionId)) {
        chat = this.chatHistory.get(sessionId)!;
        console.log(`Using existing chat session for sessionId: ${sessionId}`);
        // Или новая сессия
      } else {
        // Новый экземпляр
        const model = this.genAI.getGenerativeModel({
          model: requestDto.model,
          systemInstruction: requestDto.systemInstruction,
        });
        // Инициализация сессии
        chat = model.startChat({
          generationConfig: requestDto.generationConfig,
          safetySettings: requestDto.safetySettings,
        });
        // Сохранение сессии
        this.chatHistory.set(sessionId, chat);
        console.log(`Creating new chat session for sessionId: ${sessionId}`);
      }

      // Отправка сообщения пользователя
      const result = await chat.sendMessage(requestDto.message);
      // Получение и возврат ответа
      const response = result.response;
      return response as GenerateContentResponse;

    } catch (error) { // Обработка ошибок
      console.error('Error in GeminiTextChatService chat:', error);
      throw new InternalServerErrorException(
        'Failed to process chat using Google Gemini API',
        error,
      );
    }
  }
}