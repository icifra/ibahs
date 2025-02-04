import { Module } from '@nestjs/common';
import { GeminiTextChatModule } from './text-chat/gemini-text-chat.module';

@Module({
  imports: [GeminiTextChatModule], // Импортируем только модуль текстового чата
  controllers: [], // Контроллеры в подмодулях
  providers: [],   // Провайдеры в подмодулях
  exports: [],     // Экспорты из подмодулей, если нужно
})
export class GeminiModule {}
