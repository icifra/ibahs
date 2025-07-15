# CLAUDE.md

Этот файл предоставляет руководство для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Содержание

1. [Системный промпт](#системный-промпт-для-разработки)
2. [Быстрый старт](#быстрый-старт)
3. [Git Workflow](#git-workflow)
4. [Архитектура проекта](#архитектура-проекта)
5. [Стратегия развития](#стратегия-развития)

## Системный промпт для разработки

Ты элитный архитектор ПО, создающий безупречный production-ready код. Давай краткие, но исчерпывающие ответы, всегда начинай с прямого решения задачи. Код должен быть идеально оптимизирован (performance, память, scalability), абсолютно надёжен (отказоустойчивость, security), кристально чист (SOLID, DRY, KISS) и полностью готов к production. Перед кодированием уточняй неясные требования. Каждое решение сопровождай только критически важными комментариями и сжатым обоснованием подхода. Документируй только существенное, фокусируйся на ключевых деталях implementation. Testability, security и scalability обязательны. Поддерживай баланс между лаконичностью и понятностью. Цель: создавать образцовый код высочайшего класса.

## Быстрый старт

### Backend команды
```bash
cd backend/
npm install && npm run start:dev    # Установка и запуск
npm run build && npm run start:prod # Production
npm run lint && npm run test        # Проверка качества
```

### Переменные окружения
```bash
# backend/.env (обязательные)
SESSION_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
PORT=3001
NODE_ENV=development
```

## Git Workflow

### Принципы коммитов
- **Формат**: `git commit -m "Действие + конкретные детали"`
- **Примеры**: "Обновлены зависимости: NestJS ^11.0.7", "Добавлен API /users/:id"
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
├── .github/workflows/     # CI/CD (GitHub Actions)
├── .gitignore            # Правила игнорирования
├── backend/              # NestJS/Fastify API
│   ├── src/ai/          # Gemini AI интеграция
│   ├── src/types/       # TypeScript типы
│   ├── .nvmrc           # Версия Node.js для fnm/nvm
│   └── package.json     # Зависимости, команды
├── frontend/             # Bootstrap/Vanilla JS
│   ├── javascript/      # ES6 модули
│   ├── css/            # Стили
│   └── index.html      # Главная страница
└── CLAUDE.md            # Эта документация
```

### Технический стек

#### Backend (NestJS/Fastify)
- **Framework**: NestJS ^11.0.x + Fastify (не Express)
- **Platform**: Node.js >=22.17.0, npm >=10.9.2
- **AI**: Google Gemini API ^0.13.x с сессиями
- **Security**: Helmet, CORS, httpOnly cookies
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + ts-jest, E2E тесты

#### Frontend (Bootstrap/Vanilla JS)
- **UI**: Bootstrap 5 (тёмная тема)
- **JS**: ES6 модули, Web APIs
- **Media**: HLS.js для видео
- **Components**: ChatBot, GeoData, HLS Player

### Ключевые принципы

#### Безопасность
- **Backend**: Strict validation, secure sessions, environment secrets
- **Frontend**: XSS protection, CSRF tokens, input sanitization

#### Производительность
- **Backend**: Fastify adapter, TypeScript strict mode
- **Frontend**: Debouncing, lazy loading, ES6 modules

#### Архитектура
- **Модульность**: NestJS modules, ES6 classes
- **Типизация**: Strict TypeScript, custom types
- **Тестирование**: Unit + E2E coverage

## Стратегия развития

### Текущее состояние
**Лаборатория**: NestJS/Fastify backend + Bootstrap/Vanilla JS frontend

### Целевое состояние
**Платформа**: AI API/SDK продажи + блог + wiki-система

### Технические решения
- **Backend**: Сохраняем NestJS/Fastify (стабильная основа)
- **Frontend**: Миграция на Next.js + React + Tailwind
- **Deploy**: Nginx роутинг (/blog → Next.js, / → legacy)
- **Focus**: Первый раздел /blog на Next.js

### Этапы развития
1. Next.js приложение для блога
2. Nginx конфигурация для роутинга
3. React компоненты + Tailwind CSS
4. API расширения для CMS
5. Система подписок и монетизация

### Контроль версий
- **Node.js**: >=22.17.0 (backend/package.json, backend/.nvmrc)
- **Dependencies**: ^major.minor.x (гибкие patch версии)
- **CI/CD**: GitHub Actions для деплоя