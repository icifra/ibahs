# Руководство по разработке

## Требования системы
- **Node.js:** версия из `backend/.nvmrc` (текущая: ≥22.17.0)
- **npm:** ≥10.9.2
- **Среда:** Linux/WSL2 (Windows через WSL)

## Быстрый старт

### 1. Настройка Node.js (через fnm)
```bash
# Установка fnm (если не установлен)
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc

# Установка нужной версии Node.js (из backend/.nvmrc)
fnm install $(cat backend/.nvmrc)
fnm default $(cat backend/.nvmrc)
fnm use $(cat backend/.nvmrc)

# Проверка версий
node -v  # должно показать версию из backend/.nvmrc
npm -v   # должно показать ≥10.9.2
```

### 2. Установка зависимостей
```bash
# Перейти в backend директорию
cd backend/

# Установить зависимости проекта
npm install  # для разработки
# или npm ci  # для точного воспроизведения (как в CI/CD)

# Установить NestJS CLI глобально
npm install -g @nestjs/cli

# Проверить установку
nest --version
```

### 3. Настройка переменных окружения
```bash
# Создать .env из примера
cp .env.example .env

# Отредактировать переменные
nano .env
```

Обязательные переменные в `.env`:
```env
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=ваш_реальный_api_ключ
SESSION_SECRET=ваш_секретный_ключ_сессий
```

Генерация SESSION_SECRET:
```bash
openssl rand -base64 48
```

### 4. Запуск разработки
```bash
# Режим разработки с hot reload
npm run start:dev

# Проверка API
curl http://localhost:3001/api

# Запуск тестов
npm run test
```

## Технологический стек
- **Framework:** NestJS ^11.0.1 + Fastify
- **Node.js:** ≥22.17.0 (см. `backend/.nvmrc`)
- **Валидация:** class-validator + class-transformer
- **AI:** Google Gemini API ^1.9.0
- **Сессии:** HTTP-only cookies, 30 мин таймаут

## Команды разработки

### Основные команды
```bash
# Разработка
npm run start:dev        # Hot reload (рекомендуется)
npm run start:debug      # Debug режим
npm run start            # Обычный запуск

# Production
npm run build           # Сборка в dist/
npm prune --production  # Удалить devDependencies (для production)
npm run start:prod      # Запуск production сборки
```

### Тестирование
```bash
npm run test            # Unit тесты
npm run test:watch      # Watch режим
npm run test:e2e        # E2E тесты
npm run test:cov        # Coverage отчет
```

### Качество кода
```bash
npm run lint            # ESLint проверка + автофикс
```

## Troubleshooting

### Node.js проблемы
**Проблема:** Неправильная версия Node.js
```bash
# Решение
fnm use 22.17.0
# или
fnm default 22.17.0
```

**Проблема:** fnm команды не найдены
```bash
# Решение
source ~/.bashrc
# или перезапустить терминал
```

### Backend проблемы
**Проблема:** Порт 3001 уже занят
```bash
# Найти процесс
lsof -i :3001
# Убить процесс
kill -9 <PID>
# или изменить PORT в .env
```

**Проблема:** SESSION_SECRET не найден
```bash
# Ошибка: "SESSION_SECRET environment variable is required"
# Решение: проверить .env файл и наличие переменной
echo "SESSION_SECRET=$(openssl rand -base64 48)" >> .env
```

**Проблема:** GEMINI_API_KEY ошибки
```bash
# Проверить .env файл
cat .env | grep GEMINI
# Убедиться что ключ валидный (начинается с определенного префикса)
```

### Hot reload проблемы
**Проблема:** Изменения не применяются
```bash
# Решение 1: перезапустить dev сервер
# Ctrl+C -> npm run start:dev

# Решение 2: очистить dist и пересобрать
rm -rf dist/
npm run build
npm run start:dev
```

### Общие проблемы
- **npm install ошибки:** `rm -rf node_modules/ package-lock.json && npm install`
- **TypeScript ошибки:** проверить `npm list typescript`

## Переменные окружения

Обязательные в `.env`:
- `PORT` - порт API (по умолчанию 3001)
- `NODE_ENV` - development/production
- `GEMINI_API_KEY` - API ключ Google Gemini
- `SESSION_SECRET` - секрет сессий (генерировать: `openssl rand -base64 48`)

Безопасность: `chmod 600 .env` и проверить что `.env` в `.gitignore`