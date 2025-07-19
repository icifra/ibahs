# API Reference

## Gemini AI Text Chat

### Эндпоинт
```
POST /api/ai/gemini/text-chat
```

### Запрос
```json
{
  "model": "gemini-2.0-flash",
  "message": "Текст сообщения пользователя",
  "systemInstruction": "Роль и контекст для AI (опционально)",
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 350,
    "topP": 0.8,
    "topK": 10,
    "stopSequences": ["END"]
  },
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_NONE"
    }
  ]
}
```

### Обязательные поля
- `model` - модель Gemini (gemini-2.0-flash, gemini-1.5-flash-latest)
- `message` - сообщение пользователя

### Ответ
```json
{
  "text": "Ответ от AI модели"
}
```

### Коды ошибок
- **400 Bad Request** - невалидные данные в запросе
- **500 Internal Server Error** - ошибка API или отсутствует GEMINI_API_KEY

### Сессии
- Автоматическое управление через cookies
- Сохранение истории чата в рамках сессии  
- Таймаут: 30 минут неактивности

### Пример cURL
```bash
curl -X POST http://localhost:3001/api/ai/gemini/text-chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash",
    "message": "Привет! Как дела?"
  }'
```