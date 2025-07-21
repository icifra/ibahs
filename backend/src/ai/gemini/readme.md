# Gemini AI интеграция

## Назначение
Интеграция с Google Gemini API для текстовых чатов с сессиями.

## Структура
```
gemini/
├── gemini.module.ts
└── text-chat/           # Текстовый чат с Gemini
```

## Настройка
```env
GEMINI_API_KEY=ваш_api_ключ_от_google
SESSION_SECRET=секретный_ключ_сессий
```

Генерация session secret:
```bash
openssl rand -base64 48
```

## Использование
```bash
# Основной эндпоинт
POST /api/ai/gemini/text-chat

# Пример запроса
{
  "model": "gemini-2.0-flash",
  "message": "Привет!"
}
```

Подробная API документация: [docs/api-reference.md](../../../docs/api-reference.md)

## Сессии
- Автоматическое создание при первом запросе
- Таймаут: 30 минут неактивности  
- Хранение в памяти (для продакшена нужен Redis)

## Troubleshooting
- **API Key не найден** → проверить .env файл
- **Превышение таймаута** → проверить сетевое соединение
- **Ошибки валидации** → проверить формат JSON запроса