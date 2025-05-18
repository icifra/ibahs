import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { GeminiTextChatService, GeminiChatApiResponse } from './gemini-text-chat.service';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';
import { FastifyRequest } from 'fastify'; // Тип запроса для Fastify

// Контроллер, отвечающий за обработку HTTP-запросов к эндпоинту Gemini text-chat.
// Базовый путь для всех эндпоинтов этого контроллера: /ai/gemini
@Controller('ai/gemini')
export class GeminiTextChatController {
  constructor(private readonly geminiTextChatService: GeminiTextChatService) {}

  // Обрабатывает POST-запросы на /ai/gemini/text-chat.
  @Post('text-chat')
  // Применяет глобальные пайпы для валидации входящего тела запроса (body).
  // ValidationPipe: проверяет DTO, transform: true - преобразует plain object в DTO instance,
  // whitelist: true - удаляет свойства, не описанные в DTO,
  // forbidNonWhitelisted: true - выбрасывает ошибку, если есть лишние свойства.
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  // Устанавливает HTTP-статус ответа на 200 OK.
  @HttpCode(HttpStatus.OK)
  async chat(
    @Body() body: GeminiTextChatRequestDto, // Входящие данные запроса, прошедшие валидацию
    @Req() request: FastifyRequest, // Объект запроса Fastify для доступа к сессии
  ): Promise<GeminiChatApiResponse> { 
    
    // Управление сессией на уровне Fastify.
    // Если sessionId отсутствует в сессии Fastify, генерируется новый.
    // Это гарантирует, что у каждого пользователя будет свой уникальный идентификатор сессии,
    // который затем используется сервисом для разделения историй чатов.
    if (!request.session.sessionId) {
      request.session.sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log(`New Fastify sessionID generated: ${request.session.sessionId}`);
    } else {
      console.log(`Using existing Fastify sessionID: ${request.session.sessionId}`);
    }
    // Потенциальное улучшение: Рассмотреть использование более криптостойкого генератора sessionId,
    // если требуется повышенная безопасность идентификаторов сессий.

    // Делегирование обработки запроса сервису GeminiTextChatService.
    // Передаем данные запроса и sessionId для корректного ведения диалога.
    return this.geminiTextChatService.chat(body, request.session.sessionId);
  }
}