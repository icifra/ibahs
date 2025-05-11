import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { GeminiTextChatService, GeminiChatApiResponse } from './gemini-text-chat.service';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';
import { FastifyRequest } from 'fastify';

@Controller('ai/gemini')
export class GeminiTextChatController {
  constructor(private readonly geminiTextChatService: GeminiTextChatService) {}

  @Post('text-chat')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.OK)
  async chat(
    @Body() body: GeminiTextChatRequestDto,
    @Req() request: FastifyRequest,
  ): Promise<GeminiChatApiResponse> { 
    
    if (!request.session.sessionId) {
      request.session.sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log(`New Fastify sessionID generated: ${request.session.sessionId}`);
    } else {
      console.log(`Using existing Fastify sessionID: ${request.session.sessionId}`);
    }

    return this.geminiTextChatService.chat(body, request.session.sessionId);
  }
}