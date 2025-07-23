# Документация проекта Shifry

## Содержание

- [architecture.md](architecture.md) - Архитектура проекта (backend + frontend + AI)
- [development.md](development.md) - Как начать разработку
- [deployment.md](deployment.md) - Деплой и CI/CD
- [api-reference.md](api-reference.md) - API документация
- [../infrastructure/readme.md](../infrastructure/readme.md) - Управление серверной инфраструктурой

## Структура проекта

```
shifry/
├── docs/           # Общая документация проекта
├── backend/        # NestJS/Fastify API + Gemini AI
├── frontend/       # Bootstrap/Vanilla JS (текущий)
├── infrastructure/ # Nginx, systemd, инфраструктура
├── roadmap.md      # Планы развития
└── claude.md       # Инструкции для Claude Code
```

## Быстрый старт

1. Прочитать [development.md](development.md) для настройки окружения
2. Изучить [architecture.md](architecture.md) для понимания структуры
3. Использовать [api-reference.md](api-reference.md) для работы с API