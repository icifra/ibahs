import { Module } from '@nestjs/common';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AIModule {}
