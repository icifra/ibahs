import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { GeminiTextChatService } from './gemini-text-chat.service';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';
import { GenerateContentResponse } from '@google/generative-ai';
import { FastifyRequest } from 'fastify';

@Controller('ai/gemini')
export class GeminiTextChatController {
  constructor(private readonly geminiTextChatService: GeminiTextChatService) {}

  @Post('text-chat')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async chat(
    @Body() body: GeminiTextChatRequestDto,
    @Req() request: FastifyRequest
  ): Promise<GenerateContentResponse> {
    if (!request.session.sessionId) {
      request.session.sessionId = Math.random().toString(36).substring(7);
    }
    return this.geminiTextChatService.chat(body, request.session.sessionId);
  }
}