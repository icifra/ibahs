# CLAUDE.md

Этот файл предоставляет руководство для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Системный промпт для разработки

Ты элитный архитектор ПО, создающий безупречный production-ready код. Давай краткие, но исчерпывающие ответы, всегда начинай с прямого решения задачи. Код должен быть идеально оптимизирован (performance, память, scalability), абсолютно надёжен (отказоустойчивость, security), кристально чист (SOLID, DRY, KISS) и полностью готов к production. Перед кодированием уточняй неясные требования. Каждое решение сопровождай только критически важными комментариями и сжатым обоснованием подхода. Документируй только существенное, фокусируйся на ключевых деталях implementation. Testability, security и scalability обязательны. Поддерживай баланс между лаконичностью и понятностью. Цель: создавать образцовый код высочайшего класса.

## Стратегия развития проекта

**ТЕКУЩЕЕ СОСТОЯНИЕ**: Лаборатория (backend: NestJS/Fastify, frontend: Bootstrap/Vanilla JS)  
**ЦЕЛЬ**: Масштабируемая платформа с продажей ИИ по подписке (API/SDK), мини-YouTube блогом, wiki-блогом

### Ключевые технические решения:
- **Backend**: Сохраняем NestJS/Fastify (надёжная основа)
- **Frontend**: Переход на Next.js + React (компонентная архитектура, routing, SSR/SSG для SEO)  
- **Стилизация**: Tailwind CSS (максимальная гибкость для кастомного дизайна)
- **Деплой**: Постепенный захват через Nginx пути (/blog, /account, /videos → Next.js app, / → legacy app)

**ТЕКУЩИЙ ФОКУС**: Реализация первого нового раздела (/blog) на Next.js, настройка Nginx routing, освоение Next.js + Tailwind + API integration.

## Архитектура проекта

### Общая структура
```
shifry/
├── backend/          # NestJS API сервер
├── frontend/         # Статический фронтенд (текущий)
└── CLAUDE.md        # Документация для ассистента
```

### Backend (NestJS/Fastify)

#### Технический стек
- **Фреймворк**: NestJS 11+ с Fastify адаптером (performance-первый подход)
- **Платформа**: Node.js 22.14.0, npm 10.9.2 (строго)
- **TypeScript**: Строгая конфигурация с пользовательскими типами в `src/types/`
- **Валидация**: class-validator + class-transformer с глобальными pipes
- **Безопасность**: Fastify Helmet, CORS, защищённые сессии с httpOnly cookies

#### Основные команды
```bash
# Из директории backend/
npm run build           # Сборка TypeScript → JavaScript
npm run start:dev      # Режим разработки с hot reload
npm run start:prod     # Production запуск
npm run lint           # ESLint с автофиксом
npm run test           # Unit тесты (Jest)
npm run test:watch     # Тесты в watch режиме
npm run test:cov       # Покрытие кода
npm run test:e2e       # End-to-end тестирование
```

#### Архитектура модулей
```
src/
├── main.ts                    # Точка входа с конфигурацией Fastify
├── app.module.ts             # Корневой модуль (ConfigModule + AIModule)
├── app.controller.ts         # Базовый контроллер
├── app.service.ts           # Базовый сервис
├── types/
│   └── fastify.d.ts         # Типизация сессий Fastify
└── ai/                      # AI модуль
    ├── ai.module.ts         # Агрегирующий AI модуль
    └── gemini/              # Google Gemini интеграция
        ├── gemini.module.ts
        └── text-chat/       # Текстовый чат
            ├── gemini-text-chat.module.ts
            ├── gemini-text-chat.controller.ts
            ├── gemini-text-chat.service.ts
            ├── gemini-text-chat-request.dto.ts
            └── *.spec.ts    # Тесты
```

#### Ключевые особенности
- **Fastify адаптер**: Высокая производительность (не Express)
- **Сессии**: Безопасное управление через `@fastify/session`
- **AI интеграция**: Google Gemini API v0.13.0 с контролем сессий
- **Валидация**: Автоматическое приведение типов и очистка данных
- **Безопасность**: XSS protection, CSRF защита, secure cookies

#### Переменные окружения
```bash
SESSION_SECRET=обязательная_для_сессий
PORT=3001                    # По умолчанию
NODE_ENV=production          # Влияет на security настройки
GEMINI_API_KEY=api_ключ      # Для AI функций
```

#### API эндпоинты
- **База**: `http://localhost:3001/api`
- **AI чат**: `POST /api/ai/gemini/text-chat`

### Frontend (Bootstrap/Vanilla JS)

#### Технический стек
- **CSS**: Bootstrap 5 (тёмная тема по умолчанию)
- **JavaScript**: ES6 модули, нативные Web APIs
- **Медиа**: HLS.js для видео стриминга
- **Дизайн**: Адаптивная трёхколоночная компоновка

#### Структура
```
frontend/
├── index.html              # Главная страница
├── css/
│   ├── bootstrap.min.css   # Bootstrap фреймворк
│   ├── style.css          # Основные стили
│   ├── fonts.css          # Arimo шрифт
│   ├── logo.css           # Анимация логотипа
│   ├── announcement.css   # Бегущая строка
│   └── icon.css           # Иконки
├── javascript/
│   ├── main.js            # Инициализация модулей
│   ├── chatBot.js         # AI чат интерфейс
│   ├── hlsInitializer.js  # HLS видео
│   ├── geoData.js         # Геолокация пользователя
│   ├── navbar.js          # Навигация
│   ├── announcement.js    # Бегущие новости
│   └── image-protection.js # Защита изображений
├── images/                # Статические ресурсы
├── icons/                 # SVG иконки
└── videos/               # HLS видео файлы
```

#### Ключевые компоненты
- **ChatBot**: Класс для взаимодействия с Gemini API
- **HLS Player**: Поддержка адаптивного видео стриминга
- **GeoData**: Определение местоположения пользователя
- **Bootstrap UI**: Карусели, модальные окна, адаптивная сетка

#### Особенности реализации
- **Модульная архитектура**: ES6 классы с инкапсуляцией
- **Обработка ошибок**: Comprehensive error handling с пользовательскими сообщениями
- **Производительность**: Debouncing для UI событий, таймауты для запросов
- **Безопасность**: CSRF токены, валидация на клиенте

### Качество кода и тестирование

#### Backend тестирование
- **Unit тесты**: Jest с ts-jest, полное покрытие сервисов
- **E2E тесты**: Настройка в `test/` директории
- **Mocking**: Моки для внешних API (Gemini)
- **Типизация**: Строгий TypeScript без `any`

#### Linting и форматирование
- **ESLint**: TypeScript-specific правила
- **Prettier**: Единообразное форматирование (если настроен)
- **Git hooks**: Pre-commit проверки (при настройке)

#### Мониторинг
- **Логирование**: Структурированные логи через NestJS Logger
- **Ошибки**: Централизованная обработка через Exception Filters
- **Производительность**: Мониторинг времени ответа API

### Безопасность

#### Backend Security
- **Helmet**: Настройка security headers
- **CORS**: Контроль cross-origin запросов
- **Sessions**: HttpOnly cookies с защитой от CSRF
- **Validation**: Строгая валидация входных данных
- **Environment**: Безопасное хранение конфиденциальных данных

#### Frontend Security
- **XSS Protection**: Санитизация пользовательского ввода
- **Image Protection**: Защита от копирования изображений
- **HTTPS**: Принудительное использование в production

### Развёртывание и DevOps

#### Требования среды
- Node.js 22.14.0 (точная версия)
- npm 10.9.2
- SSL сертификат для production

#### Production настройки
- `NODE_ENV=production`
- Secure session cookies
- Минификация статических ресурсов
- CDN для медиа файлов

## Git Workflow для Claude Code

### Правила коммитов
- **Принцип**: Информативность + краткость - четко указывать ЧТО сделано
- **Формат**: `git commit -m "Действие + конкретные детали"`
- **Примеры**: 
  - "Обновлены зависимости: NestJS 11.0.7, Fastify 5.3.2"
  - "Исправлена ошибка валидации email в AuthController"
  - "Добавлен API эндпоинт GET /api/users/:id"
  - "Реализован модуль аутентификации с JWT токенами"
- **БЕЗ**: автоподписей, эмоджи, неинформативных фраз

### Команды
```bash
git add <файлы>
git commit -m "Конкретное описание изменений"
git push origin main
```

## Следующие шаги разработки

1. **Создание Next.js приложения** для нового функционала
2. **Настройка Nginx** для роутинга между legacy и новым приложением  
3. **Миграция UI компонентов** на React + Tailwind
4. **API расширение** для блог-функциональности
5. **Система подписок** и монетизация AI API