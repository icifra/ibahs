# Infrastructure Management для проекта Shifry

## Текущее состояние инфраструктуры

### Продакшен сервер
- **Хостинг**: Beget VPS
- **OS**: Debian 12, AMD EPYC 7763, 2GB RAM
- **IP**: 5.35.95.234
- **Домен**: шифры.рф

### Архитектура
- **Веб-сервер**: Nginx с модулем GeoIP2, SSL (Let's Encrypt ECDSA)
- **Backend**: NestJS + Fastify на порту 3001
- **Деплой**: Blue-Green через symlinks в `/var/www/shifry/backend/`
- **Frontend**: Статические файлы в `/var/www/shifry/static_frontend/`
- **Прокси**: xray-core через iptables NAT для Gemini API

## Структура конфигураций

```
infrastructure/
├── nginx/
│   ├── nginx.conf                 # Главный конфиг
│   ├── sites-available/
│   │   └── шифры.рф              # Конфиг сайта
│   └── conf.d/
│       ├── security.conf          # Security headers
│       ├── geoip2.conf           # GeoIP2 настройки
│       └── api_locations/
│           └── shifry.conf       # API маршрутизация
└── systemd/
    └── backend.service           # Systemd сервис backend
```

### GeoIP2 модуль
Извлекает геолокацию по IP, передает в frontend через заголовки `X-Country-Name`, `X-City`.

**База данных**: https://github.com/P3TERX/GeoLite.mmdb (автообновляется)  
**Путь**: `/etc/nginx/geoip/GeoLite2-City.mmdb`

**Установка модуля (Debian 12):**
```bash
sudo apt install libnginx-mod-http-geoip2
sudo systemctl restart nginx
```

**Обновление базы:**
```bash
wget -O GeoLite2-City.mmdb https://github.com/P3TERX/GeoLite.mmdb/raw/download/GeoLite2-City.mmdb
sudo mv GeoLite2-City.mmdb /etc/nginx/geoip/
sudo chown www-data:www-data /etc/nginx/geoip/GeoLite2-City.mmdb
sudo chmod 644 /etc/nginx/geoip/GeoLite2-City.mmdb
sudo systemctl reload nginx
```

## Процедуры управления

### Manual Sync (текущий подход)

**При изменении конфигураций на сервере:**

```bash
# Копирование конфигов в репозиторий
scp -i ~/.ssh/beget/ed25519 dos@5.35.95.234:/etc/nginx/nginx.conf ./infrastructure/nginx/
scp -i ~/.ssh/beget/ed25519 dos@5.35.95.234:/etc/nginx/sites-available/шифры.рф ./infrastructure/nginx/sites-available/
scp -r -i ~/.ssh/beget/ed25519 dos@5.35.95.234:/etc/nginx/conf.d/* ./infrastructure/nginx/conf.d/
scp -i ~/.ssh/beget/ed25519 dos@5.35.95.234:/etc/systemd/system/backend.service ./infrastructure/systemd/
```

**Тестирование и применение изменений:**

```bash
# Тестирование конфигурации
sudo nginx -t

# При успешном тесте - перезагрузка
sudo systemctl reload nginx

# Проверка статуса сервисов
sudo systemctl status nginx
sudo systemctl status backend.service
```

## Мониторинг и диагностика

```bash
# Проверка GeoIP функционала
curl -H "User-Agent: Mozilla/5.0" -I https://шифры.рф/

# Тест SSL сертификата
openssl s_client -connect шифры.рф:443 -servername шифры.рф
```

### Стратегия автоматизации

**Текущий подход**: Manual Sync для критичных nginx конфигураций
**Причина**: Максимальная надежность, изменения инфраструктуры редкие

**Будущее**: При росте проекта рассмотреть автоматизацию для:
- Новых сервисов (не nginx)
- Конфигураций мониторинга
- Systemd сервисов (менее критично)

## Безопасность

### SSH доступ
- Ключ: `~/.ssh/beget/ed25519` (права 600)
- Пользователь: `dos@5.35.95.234`

### Секреты для GitHub Actions
- `VPS_HOST`: 5.35.95.234
- `VPS_USER`: dos  
- `VPS_SSH_KEY`: приватный SSH ключ

### SSL сертификат
- Тип: Let's Encrypt ECDSA
- Автообновление через certbot

## Планы развития

Согласно [roadmap.md](../roadmap.md) проекта инфраструктура готова к будущим изменениям благодаря версионному контролю конфигураций.
