# CLAUDE.md

Этот файл предоставляет руководство для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Содержание

1. [Системный промпт для разработки](#системный-промпт-для-разработки)
2. [Быстрый старт](#быстрый-старт)
3. [Git Workflow](#git-workflow-для-claude-code)
4. [Архитектура проекта](#архитектура-проекта)
5. [Требования к среде](#требования-к-среде)
6. [Стратегия развития](#стратегия-развития-проекта)

## Системный промпт для разработки

Ты элитный архитектор ПО, создающий безупречный production-ready код. Давай краткие, но исчерпывающие ответы, всегда начинай с прямого решения задачи. Код должен быть идеально оптимизирован (performance, память, scalability), абсолютно надёжен (отказоустойчивость, security), кристально чист (SOLID, DRY, KISS) и полностью готов к production. Перед кодированием уточняй неясные требования. Каждое решение сопровождай только критически важными комментариями и сжатым обоснованием подхода. Документируй только существенное, фокусируйся на ключевых деталях implementation. Testability, security и scalability обязательны. Поддерживай баланс между лаконичностью и понятностью. Цель: создавать образцовый код высочайшего класса.

## Быстрый старт

### Основные команды Backend
```bash
cd backend/
npm install                 # Установка зависимостей
npm run start:dev          # Запуск в режиме разработки
npm run build              # Сборка для production
npm run lint               # Проверка кода
npm run test               # Запуск тестов
```

### Переменные окружения
```bash
# Обязательные переменные (backend/.env)
SESSION_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=development
```

## Git Workflow для Claude Code

### Правила коммитов
- **Принцип**: Информативность + краткость - четко указывать ЧТО сделано
- **Формат**: `git commit -m "Действие + конкретные детали"`
- **Примеры**: 
  - "Обновлены зависимости: NestJS ^11.0.7, Fastify ^13.0.2"
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

## Архитектура проекта

### Структура репозитория
```
shifry/
├── .github/                    # GitHub Actions CI/CD
│   └── workflows/
│       ├── deploy-backend.yml
│       └── deploy-static-frontend.yml
├── .gitignore                  # Правила игнорирования
├── backend/                    # NestJS API сервер
│   ├── src/
│   │   ├── ai/                # AI модули (Gemini интеграция)
│   │   ├── types/             # TypeScript типы
│   │   ├── main.ts            # Точка входа
│   │   └── app.module.ts      # Корневой модуль
│   ├── test/                  # E2E тесты
│   ├── package.json           # Зависимости и скрипты
│   └── tsconfig.json          # Конфигурация TypeScript
├── frontend/                   # Статический фронтенд
│   ├── css/                   # Стили (Bootstrap + кастомные)
│   ├── javascript/            # ES6 модули
│   ├── images/                # Статические ресурсы
│   └── index.html             # Главная страница
└── CLAUDE.md                   # Документация для ассистента
```

## Требования к среде

### Версии платформы
- **Node.js**: `>=22.14.0` (контролируется в `backend/package.json`)
- **npm**: `>=10.9.2` (контролируется в `backend/package.json`)

### Ключевые зависимости
- **NestJS**: `^11.0.x` (framework)
- **Fastify**: `^13.0.x` (HTTP server, не Express)
- **Google Gemini**: `^0.13.x` (AI API)
- **TypeScript**: `^5.7.x` (строгая типизация)
- **Bootstrap**: `5.x` (CSS framework)

### Файлы контроля версий
- `backend/package.json` - engines.node, engines.npm
- `backend/tsconfig.json` - TypeScript конфигурация
- `.gitignore` - правила игнорирования файлов

### Backend (NestJS/Fastify)

#### Технический стек
- **Фреймворк**: NestJS ^11.0.x с Fastify адаптером (performance-первый подход)
- **TypeScript**: Строгая конфигурация с пользовательскими типами в `src/types/`
- **Валидация**: class-validator + class-transformer с глобальными pipes
- **Безопасность**: Fastify Helmet, CORS, защищённые сессии с httpOnly cookies
- **AI интеграция**: Google Gemini API ^0.13.x с контролем сессий

#### Дополнительные команды
```bash
# Расширенные команды (основные см. в разделе "Быстрый старт")
npm run test:watch     # Тесты в watch режиме
npm run test:cov       # Покрытие кода
npm run test:e2e       # End-to-end тестирование
npm run start:debug    # Запуск с отладкой
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

## Стратегия развития проекта

**ТЕКУЩЕЕ СОСТОЯНИЕ**: Лаборатория (backend: NestJS/Fastify, frontend: Bootstrap/Vanilla JS)  
**ЦЕЛЬ**: Масштабируемая платформа с продажей ИИ по подписке (API/SDK), мини-YouTube блогом, wiki-блогом

### Ключевые технические решения
- **Backend**: Сохраняем NestJS/Fastify (надёжная основа)
- **Frontend**: Переход на Next.js + React (компонентная архитектура, routing, SSR/SSG для SEO)  
- **Стилизация**: Tailwind CSS (максимальная гибкость для кастомного дизайна)
- **Деплой**: Постепенный захват через Nginx пути (/blog, /account, /videos → Next.js app, / → legacy app)

**ТЕКУЩИЙ ФОКУС**: Реализация первого нового раздела (/blog) на Next.js, настройка Nginx routing, освоение Next.js + Tailwind + API integration.

### Следующие шаги развития

1. **Создание Next.js приложения** для нового функционала
2. **Настройка Nginx** для роутинга между legacy и новым приложением  
3. **Миграция UI компонентов** на React + Tailwind
4. **API расширение** для блог-функциональности
5. **Система подписок** и монетизация AI API