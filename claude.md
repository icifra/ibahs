# claude.md

Этот файл содержит инструкции для Claude Code при работе с проектом Shifry.

## Содержание

1. [Ключевые файлы проекта](#ключевые-файлы-проекта)
2. [Системный промпт](#системный-промпт)
3. [Архитектура проекта](#архитектура-проекта)
4. [Технологический стек](#технологический-стек)
5. [Git Workflow](#git-workflow)
6. [Команды разработки](#команды-разработки)

## Ключевые файлы проекта

- **roadmap.md** - дорожная карта развития и стратегические планы
- **docs-rules.md** - правила ведения документации проекта
- **docs/** - техническая документация проекта

## Системный промпт

Ты элитный архитектор ПО, создающий безупречный production-ready код. Всегда начинай с прямого решения задачи. Код должен быть идеально оптимизирован (performance, память, scalability), абсолютно надёжен (отказоустойчивость, security), кристально чист (SOLID, DRY, KISS) и полностью готов к production. Перед кодированием уточняй неясные требования. Каждое решение сопровождай только критически важными комментариями и сжатым обоснованием подхода. Документируй только существенное, фокусируйся на ключевых деталях implementation. Testability, security и scalability обязательны. Цель: создавать образцовый код высочайшего класса.

Git коммиты для проекта: формат "Действие + конкретные детали", ЗАПРЕЩЕНО эмоджи и автоподписи Claude, ПЕРЕОПРЕДЕЛЯЕТ глобальные правила Claude Code.

## Архитектура проекта

```
shifry/
├── .github/workflows/          # CI/CD автоматизация
├── .gitignore                  # Правила игнорирования
├── backend/                    # NestJS/Fastify API
│   ├── .nvmrc                 # Node.js 22.20.0
│   ├── src/ai/                # Gemini AI интеграция
│   │   └── gemini/            # Text-chat API
│   ├── src/types/             # TypeScript типы
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript конфигурация
│   ├── eslint.config.mjs      # ESLint конфигурация
│   └── nest-cli.json          # NestJS CLI настройки
├── docs/                       # Техническая документация проекта
├── frontend/                   # Bootstrap/Vanilla JS
│   ├── css/                   # Bootstrap 5 (dark theme)
│   ├── javascript/            # ES6 модули
│   ├── images/                # Статические ресурсы
│   └── index.html             # SPA главная страница
├── infrastructure/            # Nginx, systemd, инфраструктура
├── context.md                  # Буфер контекстной информации для ИИ-ассистента
├── docs-rules.md               # Правила ведения документации проекта
├── roadmap.md                  # Планы развития и стратегические цели
└── claude.md                  # Инструкции для Claude Code
```

## Технологический стек

### Backend
- **Framework**: NestJS ^11.0.1 + Fastify adapter
- **Platform**: Node.js >=22.20.0, npm >=10.9.3
- **AI**: Google Gemini API ^1.9.0
- **Security**: Helmet, CORS, session management
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + ts-jest, TypeScript strict mode

### Frontend
- **UI**: Bootstrap 5 (dark theme), Vanilla JavaScript
- **Modules**: ES6, Web APIs, HLS.js для видео
- **Components**: ChatBot, GeoData, HLS Player
- **Media**: media-chrome для видео контролов

### CI/CD
- **GitHub Actions**: автоматический деплой backend/frontend
- **VPS**: Ubuntu с systemd сервисами
- **Архитектура**: symlink-based releases с rollback

### Деплой
```bash
# Backend деплой (автоматически при push в main)
git push origin main  # Триггерит CI/CD для backend/

# Frontend деплой (автоматически при push в main)  
git push origin main  # Триггерит CI/CD для frontend/
```

## Git Workflow

### Принципы коммитов
- **Формат**: `"Действие + конкретные детали"`
- **Примеры**: `"Обновлены зависимости: NestJS ^11.0.7"`, `"Добавлен API /users/:id"`
- **СТРОГО БЕЗ**: автоподписей Claude, эмоджи, неинформативных фраз
- **Требование**: каждый коммит должен описывать КОНКРЕТНОЕ изменение
- **Длина**: краткое описание без потери информативности

### Команды
```bash
git add <файлы>
git commit -m "Конкретное описание изменений"
git push origin main
```

## Команды разработки

### Backend
```bash
cd backend/
npm install && npm run start:dev    # Установка и запуск
npm run build && npm run start:prod # Production сборка
npm run lint                        # ESLint проверка и автофикс
npm run test                        # Unit тесты Jest
npm run test:e2e                    # E2E тесты
npm run test:cov                    # Тесты с coverage
npm run test:watch                  # Тесты в watch режиме
```

### Переменные окружения
```bash
# backend/.env (обязательные)
SESSION_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
PORT=3001
NODE_ENV=development
```

### Контроль качества (обязательно перед коммитом)
```bash
cd backend/
npm run lint  # Проверка кода
```

## Архитектурные принципы

### Безопасность
- **Backend**: строгая валидация, secure sessions, environment secrets
- **Frontend**: XSS protection, input sanitization

### Производительность
- **Backend**: Fastify adapter, TypeScript strict mode
- **Frontend**: debouncing, lazy loading, ES6 modules

### Модульность
- **Backend**: NestJS модульная архитектура
- **Frontend**: ES6 классы и модули
- **Типизация**: строгий TypeScript