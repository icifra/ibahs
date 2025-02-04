import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiTextChatController } from './gemini-text-chat.controller';
import { GeminiTextChatService } from './gemini-text-chat.service';

@Module({
  imports: [ConfigModule],
  controllers: [GeminiTextChatController],
  providers: [GeminiTextChatService],
  exports: [GeminiTextChatService],
})
export class GeminiTextChatModule {}
