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
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';

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

  // *** Регистрация плагинов Fastify ***

  // Базовая защита
  await app.register(fastifyCors);  // Обработка запросов CORS
  await app.register(fastifyHelmet); // Добавление заголовков безопасности HTTP

  // Куки
  await app.register(fastifyCookie);

  // Поддержка сессий
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  await app.register(fastifySession, {
    secret: sessionSecret,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Динамическое включение https в production
      httpOnly: true, // Защита от XSS
      sameSite: 'lax', // Защита от CSRF
    },
  });

  // Настройка глобального префикса для API эндпоинтов
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

  // Определяем порт из переменной окружения PORT или порт по умолчанию 3001
  const port = process.env.PORT || 3001;

  // Для Docker или внешнего доступа:
  // const host = '0.0.0.0'; // Слушать на всех сетевых интерфейсах
  // await app.listen(port, host);

  // Запуск сервера на указанном порту
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}/api`); // Выводим URL приложения в консоль после запуска
}

bootstrap();