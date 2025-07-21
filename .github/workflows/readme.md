# GitHub Actions CI/CD

## Назначение
Автоматический деплой backend (NestJS) и frontend (статика) на VPS через GitHub Actions с Blue-Green стратегией.

## Workflows

### 1. Backend Deploy (`deploy-backend.yml`)
**Триггер:** изменения в `backend/` или самого workflow файла

**Процесс:**
1. Build NestJS приложения (`npm run build`)
2. Удаление dev зависимостей (`npm prune --production`)
3. Создание архива с `dist/`, `node_modules/`, `package.json`
4. Загрузка на VPS в `/tmp/`
5. Blue-Green деплой через symlink `/var/www/shifry/backend/current`
6. Перезапуск `systemd` сервиса `backend.service`
7. Health check с автоматическим rollback при сбое

### 2. Frontend Deploy (`deploy-static-frontend.yml`) 
**Триггер:** изменения в `frontend/` или самого workflow файла

**Процесс:**
1. Валидация структуры (проверка `index.html`)
2. Rsync статических файлов в `/var/www/shifry/static_frontend/`
3. Верификация деплоя

## Структура на VPS

```
/var/www/shifry/
├── backend/
│   ├── releases/           # Версионные релизы
│   ├── shared/            # Общие файлы (.env)
│   └── current -> releases/20241219123045/  # Symlink на активный релиз
└── static_frontend/       # Статические файлы фронтенда
```

## Требуемые GitHub Secrets

- `VPS_HOST` - IP адрес VPS
- `VPS_USER` - пользователь SSH (dos)  
- `VPS_SSH_KEY` - приватный SSH ключ
- `VPS_BACKEND_BASE_PATH` - `/var/www/shifry/backend`
- `VPS_STATIC_FRONTEND_PATH` - `/var/www/shifry/static_frontend`

## Особенности
- **Blue-Green Deploy:** атомарное переключение, автоматический rollback
- **Оптимизации:** кеширование npm, pruning dev зависимостей
- **Безопасность:** ограниченные SSH права, health checks

## Troubleshooting

### Backend деплой не работает
- Проверить `.nvmrc` файл в `backend/`
- Убедиться что `backend.service` существует на VPS
- Проверить права доступа к `/var/www/shifry/backend/`
- Проверить SSH ключ в secrets

### Frontend деплой не работает  
- Убедиться что `rsync` установлен на VPS
- Проверить права доступа к `/var/www/shifry/static_frontend/`
- Проверить структуру `frontend/index.html`

### Общие проблемы
- SSH подключение: проверить `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
- Права пользователя: `dos` должен иметь sudo доступ для systemctl
- Сетевые ограничения: GitHub IP должны иметь доступ к VPS