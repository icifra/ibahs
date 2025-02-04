import { Injectable, InternalServerErrorException } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerateContentResponse } from '@google/generative-ai';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';

@Injectable()
export class GeminiTextChatService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in .env file');
      throw new InternalServerErrorException(
        'Google Gemini API Key is not configured.',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey); // Инициализация genAI

    console.log('GeminiTextChatService initialized.');
  }

  async chat(requestDto: GeminiTextChatRequestDto): Promise<GenerateContentResponse> { // <-- Изменен тип возврата
    try {
      const model = this.genAI.getGenerativeModel({ // Получаем модель
        model: requestDto.model,
        systemInstruction: requestDto.systemInstruction, // <-- Устанавливаем systemInstruction ЗДЕСЬ, при получении модели
      });
      const chat = model.startChat({ // Начинаем чат (без истории)
        generationConfig: requestDto.generationConfig,
        safetySettings: requestDto.safetySettings,
      });

      const result = await chat.sendMessage(requestDto.message);
      const response = result.response;
      return response as GenerateContentResponse; // Возвращаем полный и проверенный response
    } catch (error) {
      console.error('Error in GeminiTextChatService chat:', error);
      throw new InternalServerErrorException(
        'Failed to process chat using Google Gemini API',
        error,
      );
    }
  }
}