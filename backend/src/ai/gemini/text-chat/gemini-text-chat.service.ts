import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerateContentResponse, ChatSession } from '@google/generative-ai';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';

@Injectable()
export class GeminiTextChatService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly chatHistory = new Map<string, ChatSession>();
  private readonly lastAccessed = new Map<string, number>();
  private readonly SESSION_TIMEOUT = 1800000; // 30 минут в миллисекундах

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in .env file');
      throw new InternalServerErrorException(
        'Google Gemini API Key is not configured.',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('GeminiTextChatService initialized.');
  }

  async chat(requestDto: GeminiTextChatRequestDto, sessionId: string): Promise<GenerateContentResponse> {
    try {
      // Очистка устаревших сессий
      const now = Date.now();
      for (const [sid, time] of this.lastAccessed.entries()) {
        if (now - time > this.SESSION_TIMEOUT) {
          this.chatHistory.delete(sid);
          this.lastAccessed.delete(sid);
        }
      }

      let chat: ChatSession;

      if (this.chatHistory.has(sessionId)) {
        chat = this.chatHistory.get(sessionId)!;
        this.lastAccessed.set(sessionId, now);
        console.log(`Using existing chat session for sessionId: ${sessionId}`);
      } else {
        const model = this.genAI.getGenerativeModel({
          model: requestDto.model,
          systemInstruction: requestDto.systemInstruction,
        });

        chat = model.startChat({
          generationConfig: requestDto.generationConfig,
          safetySettings: requestDto.safetySettings,
        });

        this.chatHistory.set(sessionId, chat);
        this.lastAccessed.set(sessionId, now);
        console.log(`Creating new chat session for sessionId: ${sessionId}`);
      }

      const result = await chat.sendMessage(requestDto.message);
      const response = result.response;
      return response as GenerateContentResponse;

    } catch (error) {
      console.error('Error in GeminiTextChatService chat:', error);
      throw new InternalServerErrorException(
        'Failed to process chat using Google Gemini API',
        error,
      );
    }
  }
}