import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const requiredEnvs = [
          'PORT',
          'NODE_ENV',
          'GEMINI_API_KEY',
        ];
        for (const env of requiredEnvs) {
          if (!config[env]) {
             throw new Error(`Environment variable ${env} is required`);
          }
        }
        return config;
      },
    }),
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}