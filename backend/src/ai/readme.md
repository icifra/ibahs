# AI модуль

## Назначение
Модуль для интеграции с различными AI провайдерами. Поддерживает сессионные чаты с управлением в памяти.

## Архитектура
```
ai/
├── ai.module.ts           # Главный AI модуль
├── gemini/                # Google Gemini интеграция
│   ├── gemini.module.ts
│   └── text-chat/         # Текстовый чат
├── openai/                # OpenAI интеграция (планируется)
└── anthropic/             # Anthropic интеграция (планируется)
```

## Технологии
- **NestJS** + Fastify адаптер
- **@google/genai** SDK для Gemini
- **Управление сессиями** через Fastify sessions
- **Валидация** через class-validator

## Переменные окружения
```env
GEMINI_API_KEY=ваш_gemini_api_ключ
SESSION_SECRET=секретный_ключ_для_сессий
```

## Быстрый старт
```bash
# Установка зависимостей
npm install @google/genai @fastify/session @fastify/cookie

# Генерация session secret
openssl rand -base64 48

# Запуск
npm run start:dev
```

## Особенности
- **Сессии:** хранение в памяти, автоочистка через 30 мин
- **Модульность:** разделение по провайдерам (gemini, openai, anthropic)  
- **Безопасность:** валидация данных + HTTP-only cookies

## API эндпоинты
- `POST /api/ai/gemini/text-chat` - текстовый чат с Gemini

Подробная документация в [docs/api-reference.md](../../docs/api-reference.md)