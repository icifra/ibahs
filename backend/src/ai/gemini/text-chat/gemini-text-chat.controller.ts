import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common'; 
import { GeminiTextChatService } from './gemini-text-chat.service';
import { GeminiTextChatRequestDto } from './gemini-text-chat-request.dto';
import { GenerateContentResponse } from '@google/generative-ai'; 

@Controller('ai/gemini')
export class GeminiTextChatController {
  constructor(private readonly geminiTextChatService: GeminiTextChatService) {}

  @Post('text-chat')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK) 
  async chat(@Body() body: GeminiTextChatRequestDto): Promise<GenerateContentResponse> { // <-- Изменен тип возврата
    return this.geminiTextChatService.chat(body);
  }
}
