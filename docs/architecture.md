# Архитектура проекта

## Общая структура
```
shifry/
├── backend/          # NestJS API + Gemini AI
├── frontend/         # Bootstrap + Vanilla JS
├── infrastructure/   # Nginx, systemd, GeoIP2
├── docs/            # Техническая документация
└── .github/workflows/ # CI/CD автоматизация
```

## Технологии

### Backend
- **Framework:** NestJS + Fastify
- **AI:** Google Gemini API
- **Node.js:** ≥22.17.0
- **Деплой:** GitHub Actions → VPS

### Frontend
- **Текущий:** Bootstrap 5 + Vanilla JS
- **Планируется:** Next.js + Tailwind CSS (см. roadmap.md)

## Деплой архитектура
- **Backend:** Blue-Green через symlinks
- **Frontend:** rsync статических файлов
- **VPS структура:** `/var/www/shifry/{backend/current,static_frontend}`

Подробности в соответствующих модульных readme.md