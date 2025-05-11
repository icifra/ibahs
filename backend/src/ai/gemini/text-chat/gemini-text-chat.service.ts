import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  GoogleGenAI, 
  Chat,
  GenerateContentResponse,
  Content,
  GenerateContentConfig,
  SafetySetting,
} from '@google/genai';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';

export interface GeminiChatApiResponse {
  text: string;
}

@Injectable()
export class GeminiTextChatService {
  private readonly genAI: GoogleGenAI;
  private readonly chatHistory = new Map<string, Chat>();
  private readonly lastAccessed = new Map<string, number>();
  private readonly SESSION_TIMEOUT = 1800000;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in .env file');
      throw new InternalServerErrorException('Google Gemini API Key is not configured.');
    }
    this.genAI = new GoogleGenAI({ apiKey });
    console.log('GeminiTextChatService initialized with @google/genai SDK.');
  }

  async chat(requestDto: GeminiTextChatRequestDto, sessionId: string): Promise<GeminiChatApiResponse> {
    try {
      const now = Date.now();
      for (const [sid, time] of this.lastAccessed.entries()) {
        if (now - time > this.SESSION_TIMEOUT) {
          this.chatHistory.delete(sid);
          this.lastAccessed.delete(sid);
          // this.sessionFirstMessageSent.delete(sid); // Больше не нужно
          console.log(`Session ${sid} deleted due to timeout.`);
        }
      }

      let chat: Chat;
      if (this.chatHistory.has(sessionId)) {
        chat = this.chatHistory.get(sessionId)!;
        this.lastAccessed.set(sessionId, now);
        console.log(`Using existing chat session for sessionId: ${sessionId}`);
      } else {
        const initialHistory: Content[] = []; 
        chat = this.genAI.chats.create({
          model: requestDto.model,
          history: initialHistory, 
        });
        this.chatHistory.set(sessionId, chat);
        this.lastAccessed.set(sessionId, now);
        // this.sessionFirstMessageSent.set(sessionId, false); // Больше не нужно
        console.log(`Creating new chat session for sessionId: ${sessionId} with model ${requestDto.model}`);
      }

      let effectiveConfig: GenerateContentConfig = {}; 

      if (requestDto.generationConfig && Object.keys(requestDto.generationConfig).length > 0) {
        Object.assign(effectiveConfig, requestDto.generationConfig);
      }

      if (requestDto.safetySettings && requestDto.safetySettings.length > 0) {
        effectiveConfig.safetySettings = requestDto.safetySettings as SafetySetting[];
      }

      // --- ИЗМЕНЕНИЕ: ВСЕГДА передаем systemInstruction, если она пришла от фронтенда ---
      if (requestDto.systemInstruction) {
        // Тип systemInstruction в GenerateContentConfig это string | Part | Content
        // Передача строки должна работать напрямую.
        effectiveConfig.systemInstruction = requestDto.systemInstruction; 
        console.log(`Applying systemInstruction for sessionId ${sessionId}: "${requestDto.systemInstruction.substring(0, 50)}..."`);
      }
      // ------------------------------------------------------------------------------------
      
      const sendMessagePayload: { message: string; config?: GenerateContentConfig } = {
        message: requestDto.message,
      };

      if (Object.keys(effectiveConfig).length > 0) {
        sendMessagePayload.config = effectiveConfig;
      }
      
      const result: GenerateContentResponse = await chat.sendMessage(sendMessagePayload);
      
      // Логика флага this.sessionFirstMessageSent.set(sessionId, true); больше не нужна здесь

      if (!result || typeof result.text !== 'string') {
        console.error('Unexpected response structure from Gemini API or missing text:', result);
        throw new InternalServerErrorException('Invalid response format from Gemini API or text missing');
      }
      
      return {
        text: result.text,
      };

    } catch (error) {
      // ... (обработка ошибок остается прежней)
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error in GeminiTextChatService chat:', errorMessage, error);
      if (error.response && error.response.data) {
        console.error('API Error Details:', error.response.data);
      }
      throw new InternalServerErrorException(
        'Failed to process chat using Google Gemini API',
        errorMessage,
      );
    }
  }
}