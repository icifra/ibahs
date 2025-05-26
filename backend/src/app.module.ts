import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Ни envFilePath, ни validate здесь не нужны.
      // NestJS по умолчанию ищет .env в корне проекта.
      // Валидация runtime-переменных происходит в main.ts и конструкторах сервисов.
    }),
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}