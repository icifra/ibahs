// Основные модули NestJS
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Модули NestJS для Fastify
import { 
  FastifyAdapter, 
  NestFastifyApplication 
} from '@nestjs/platform-fastify';

// Главный модуль приложения
import { AppModule } from './app.module';

// Плагины Fastify
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';


// Функция запуска приложения
async function bootstrap() {

  // Создаем экземпляр FastifyAdapter с базовыми настройками 
  const fastifyAdapter = new FastifyAdapter({
    logger: true,  // Включаем логгирование
    ignoreTrailingSlash: true,  // Игнорируем слеши в конце URL
    caseSensitive: false  // URL не чувствительны к регистру
  });

  // Создание приложения NestJS на Fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );

  // Базовая защита (регистрация)
  await app.register(fastifyCors);  // Упрощенная конфигурация CORS
  await app.register(fastifyHelmet); // Базовый Helmet достаточен

  // Настройка глобального префикса
  app.setGlobalPrefix('api');

  // Настройка глобальной валидации данных
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // автоматическое преобразование типов
    whitelist: true,  // удаление лишних полей из запросов
    forbidNonWhitelisted: true,  // Запрещает неописанные поля
    transformOptions: {
      enableImplicitConversion: true  // Включает неявное преобразование типов
    }
  }));

  // Определяем порт из переменной окружения
  const port = process.env.PORT || 3001;
  
  // Для Docker или внешнего доступа: 
  // const host = '0.0.0.0'; // Слушать на всех сетевых интерфейсах
  // await app.listen(port, host);
  
  // Запуск сервера
  await app.listen(port);  // await app.listen(port, host);
}

bootstrap();
