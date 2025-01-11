// geoData.js
export default class GeoDataInitializer {
  static instance = null;

  constructor() {
      if (GeoDataInitializer.instance) {
          return GeoDataInitializer.instance;
      }
      GeoDataInitializer.instance = this;
  }

  async initialize() {
      try {
          const response = await fetch(window.location.href, {
              method: 'HEAD',
              credentials: 'same-origin',
              cache: 'no-cache'
          });

          // Получаем данные из заголовков
          const ip = response.headers.get('X-Real-IP');
          const city = response.headers.get('X-City');
          const country = response.headers.get('X-Country-Name');

          // Создаем объект с данными, заменяя null или пустые значения на "Неизвестно"
          this.data = {
              ip: ip || 'Неизвестно',
              city: city || 'Неизвестно',
              country: country || 'Неизвестно'
          };

          // Делаем данные доступными глобально
          window.geoData = this.data;

      } catch {
          // В случае ошибки все значения будут "Неизвестно"
          this.data = {
              ip: 'Неизвестно',
              city: 'Неизвестно',
              country: 'Неизвестно'
          };
          window.geoData = this.data;
      }
  }
}