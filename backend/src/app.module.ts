import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Добавляем валидацию наличия необходимых переменных
      validate: (config: Record<string, unknown>) => {
        const requiredEnvs = [
          'PORT', 
          'NODE_ENV'
        ];
        for (const env of requiredEnvs) {
          if (!config[env]) {
            throw new Error(`Environment variable ${env} is required`);
          }
        }
        return config;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
