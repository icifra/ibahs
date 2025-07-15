import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  GoogleGenAI, 
  Chat, // Представляет собой инстанс чата с сохранением истории
  GenerateContentResponse, // Тип ответа от SDK при генерации контента
  Content, // Тип для представления истории чата в SDK
  GenerateContentConfig, // Тип для конфигурации генерации
  SafetySetting, // Тип для настроек безопасности
} from '@google/genai';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';

// Определяет ожидаемую структуру ответа от нашего API чата для фронтенда.
export interface GeminiChatApiResponse {
  text: string;
}

@Injectable()
export class GeminiTextChatService {
  private readonly genAI: GoogleGenAI; // Экземпляр SDK Google GenAI
  // Хранилище активных сессий чата. Ключ - sessionId, значение - объект Chat из SDK.
  // Потенциальное улучшение: Для продакшена рассмотреть внешнее хранилище (Redis, Memcached)
  // для масштабируемости и персистентности сессий.
  private readonly chatHistory = new Map<string, Chat>();
  // Хранилище времени последнего доступа к сессии для управления таймаутами.
  private readonly lastAccessed = new Map<string, number>();
  // Таймаут сессии в миллисекундах (30 минут).
  private readonly SESSION_TIMEOUT = 1800000; 

  constructor(private configService: ConfigService) {
    // Инициализация сервиса: получение API ключа и создание экземпляра GoogleGenAI.
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      // Критическая ошибка, если ключ API не найден. Приложение не сможет работать.
      console.error('GEMINI_API_KEY is not defined in .env file');
      throw new InternalServerErrorException('Google Gemini API Key is not configured.');
    }
    this.genAI = new GoogleGenAI({ apiKey });
    console.log('GeminiTextChatService initialized with @google/genai SDK.');
    // Потенциальное улучшение: Добавить периодическую задачу (cron) для очистки устаревших сессий,
    // чтобы не нагружать каждый запрос этой логикой.
  }

  // Основной метод для обработки чат-запроса.
  async chat(requestDto: GeminiTextChatRequestDto, sessionId: string): Promise<GeminiChatApiResponse> {
    try {
      const now = Date.now();
      // Блок управления таймаутами сессий: удаление устаревших сессий.
      for (const [sid, time] of this.lastAccessed.entries()) {
        if (now - time > this.SESSION_TIMEOUT) {
          this.chatHistory.delete(sid);
          this.lastAccessed.delete(sid);
          console.log(`Session ${sid} deleted due to timeout.`);
        }
      }

      let chat: Chat;
      // Логика получения или создания сессии чата.
      if (this.chatHistory.has(sessionId)) {
        // Если сессия существует, используем ее и обновляем время последнего доступа.
        chat = this.chatHistory.get(sessionId)!;
        this.lastAccessed.set(sessionId, now);
        console.log(`Using existing chat session for sessionId: ${sessionId}`);
      } else {
        // Если сессия не существует, создаем новую.
        // Инициализация истории чата для новой сессии.
        const initialHistory: Content[] = []; 
        chat = this.genAI.chats.create({
          model: requestDto.model, // Модель указывается при создании чата
          history: initialHistory, 
          // systemInstruction и generationConfig/safetySettings для первого сообщения
          // SDK @google/genai (v0.11.3 и выше) позволяет передавать их при создании чата,
          // но текущая логика передает их при chat.sendMessage, что тоже валидно.
          // Для консистентности, можно было бы передать их и здесь, если бы SDK это явно поддерживал
          // для `chats.create` таким же образом, как для `sendMessage`.
          // Текущий подход с передачей в `sendMessage` универсален.
        });
        this.chatHistory.set(sessionId, chat);
        this.lastAccessed.set(sessionId, now);
        console.log(`Creating new chat session for sessionId: ${sessionId} with model ${requestDto.model}`);
      }

      // Формирование конфигурации для генерации контента.
      // Объединяет generationConfig и safetySettings из DTO.
      const effectiveConfig: GenerateContentConfig = {}; 

      if (requestDto.generationConfig && Object.keys(requestDto.generationConfig).length > 0) {
        Object.assign(effectiveConfig, requestDto.generationConfig);
      }

      if (requestDto.safetySettings && requestDto.safetySettings.length > 0) {
        // Приведение типа здесь необходимо, т.к. DTO определяет более общую структуру.
        effectiveConfig.safetySettings = requestDto.safetySettings as SafetySetting[];
      }

      // Применение systemInstruction, если она предоставлена.
      // Эта инструкция будет влиять на поведение модели в текущем и последующих запросах в рамках сессии,
      // если передавать ее каждый раз или если SDK чата запоминает ее после первой передачи.
      // SDK @google/genai для `Chat.sendMessage` ожидает, что `systemInstruction` будет частью `GenerateContentRequest`,
      // которое передается в `config` поле `sendMessagePayload`.
      if (requestDto.systemInstruction) {
        effectiveConfig.systemInstruction = requestDto.systemInstruction; 
        console.log(`Applying systemInstruction for sessionId ${sessionId}: "${requestDto.systemInstruction.substring(0, 50)}..."`);
      }
      
      // Подготовка полезной нагрузки для метода sendMessage SDK.
      const sendMessagePayload: { message: string; config?: GenerateContentConfig } = {
        message: requestDto.message,
      };

      // Добавляем собранную конфигурацию, если она не пуста.
      if (Object.keys(effectiveConfig).length > 0) {
        sendMessagePayload.config = effectiveConfig;
      }
      
      // Отправка сообщения в Gemini API через SDK.
      // `chat.sendMessage` автоматически управляет историей диалога внутри объекта `chat`.
      const result: GenerateContentResponse = await chat.sendMessage(sendMessagePayload);
      
      // Проверка валидности ответа от API.
      if (!result || typeof result.text !== 'string') {
        console.error('Unexpected response structure from Gemini API or missing text:', result);
        throw new InternalServerErrorException('Invalid response format from Gemini API or text missing');
      }
      
      // Возвращение отформатированного ответа.
      return {
        text: result.text,
      };

    } catch (error) {
      // Комплексная обработка ошибок, включая логирование деталей.
      // Потенциальное улучшение: Более гранулированная обработка кодов ошибок Gemini API
      // для предоставления специфических сообщений пользователю.
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error in GeminiTextChatService chat:', errorMessage, error);
      // Проверка наличия response данных для HTTP ошибок
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.response?.data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error('API Error Details:', error.response.data);
      }
      throw new InternalServerErrorException(
        'Failed to process chat using Google Gemini API',
        errorMessage, // Передаем оригинальное сообщение об ошибке для отладки
      );
    }
  }
}