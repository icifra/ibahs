# Деплой и CI/CD

## Обзор
Автоматический деплой через GitHub Actions с Blue-Green стратегией для backend и rsync для frontend.

## Архитектура
```
/var/www/shifry/
├── backend/current -> releases/20241219123045/  # Symlink на активный релиз
└── static_frontend/                             # Статические файлы
```

## GitHub Actions
- `deploy-backend.yml` - NestJS деплой с версионированием
- `deploy-static-frontend.yml` - статические файлы через rsync

Детали: [.github/workflows/README.md](../.github/workflows/README.md)

## Конфигурация

### Systemd сервис
```ini
WorkingDirectory=/var/www/shifry/backend/current
```

### Nginx
```nginx
root /var/www/shifry/static_frontend;
```

### Продакшен переменные
```bash
# /var/www/shifry/backend/shared/.env
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=продакшен_ключ
SESSION_SECRET=секрет_сессии
```

## Troubleshooting
- **Backend сбой:** проверить `backend/.nvmrc`, `journalctl -u backend.service`
- **Frontend сбой:** проверить наличие `rsync`, права на директории
- **SSH проблемы:** проверить ключи в GitHub Secrets