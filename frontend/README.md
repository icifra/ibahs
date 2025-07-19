# Frontend

## Назначение
Клиентская часть проекта на Bootstrap 5 + Vanilla JavaScript с поддержкой AI чат-бота.

## Технологии
- **Bootstrap 5** (dark theme)
- **Vanilla JavaScript** ES6 модули
- **HLS.js** для видео проигрывания
- **media-chrome** для видео контролов

## Структура
```
frontend/
├── index.html           # Главная страница
├── css/                 # Стили
│   ├── bootstrap.min.css
│   ├── style.css
│   └── fonts.css
├── javascript/          # JS модули
│   ├── main.js
│   ├── chatBot.js       # AI чат-бот
│   ├── navbar.js
│   └── hlsInitializer.js
├── images/              # Изображения
├── videos/              # Видео файлы
└── drafts/              # Экспериментальные компоненты
```

## AI чат-бот (chatBot.js)

### Назначение
Интерфейс для взаимодействия с Gemini AI через backend API.

### Возможности
- Сессионные чаты с сохранением истории
- Настраиваемые параметры AI (temperature, maxTokens)
- Системные инструкции для настройки роли AI
- Debouncing для предотвращения спама
- Автоматическая прокрутка к новым сообщениям
- Обработка ошибок и таймаутов

### Конфигурация
```javascript
this.chatConfig = {
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 350
  }
};

this.systemInstruction = 'Ты - дружелюбный помощник...';
```

### API интеграция
- **Эндпоинт:** `/api/ai/gemini/text-chat`
- **Метод:** POST
- **Таймаут:** 30 секунд
- **Сессии:** автоматически через cookies

### Особенности UI
- **Пользователь:** сообщения справа (bg-primary-subtle)
- **AI:** сообщения слева (bg-success-subtle)
- **Состояние загрузки:** блокировка ввода + aria-busy
- **Ошибки:** отображение в интерфейсе чата

### Безопасность
- Валидация формата ответа от API
- Обработка XSS через textContent (не innerHTML)
- CSRF защита через X-Requested-With заголовок
- same-origin credentials для сессий

## Быстрый старт

### Локальная разработка
1. Запустить backend на порту 3001
2. Открыть `index.html` в браузере
3. Использовать чат-бот в интерфейсе

### Deployment
- Статические файлы деплоятся через GitHub Actions
- Nginx проксирует /api на backend
- HTTPS termination на уровне Nginx

## Планируемые улучшения
- Миграция на **Next.js + React**
- Замена Bootstrap на **Tailwind CSS**
- Модульная архитектура компонентов
- TypeScript для типобезопасности

Детали миграции в [roadmap.md](../roadmap.md)