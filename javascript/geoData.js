// geoData.js
export default class GeoDataInitializer {
  static instance = null;

  constructor() {
    if (GeoDataInitializer.instance) {
      return GeoDataInitializer.instance;
    }
    GeoDataInitializer.instance = this;
  }

  // Функция для декодирования заголовков
  decodeHeader(header) {
    try {
      if (!header) return 'Неизвестно';

      // Преобразуем строку в массив байтов
      const bytes = new Uint8Array(header.split('').map(char => char.charCodeAt(0)));

      // Декодируем заголовок из UTF-8
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      return 'Неизвестно';
    }
  }

  async initialize() {
    try {
      const response = await fetch(window.location.href, {
        method: 'HEAD',
        credentials: 'same-origin',
        cache: 'no-cache'
      });

      // Получаем и декодируем данные из заголовков
      const ip = response.headers.get('X-Real-IP');
      const city = this.decodeHeader(response.headers.get('X-City'));
      const country = this.decodeHeader(response.headers.get('X-Country-Name'));

      // Создаем объект с данными
      this.data = {
        ip: ip || 'Неизвестно',
        city: city,
        country: country
      };

      // Обновляем информацию на странице
      this.updateGeoInfo();

    } catch {
      this.data = {
        ip: 'Неизвестно',
        city: 'Неизвестно',
        country: 'Неизвестно'
      };
      this.updateGeoInfo();
    }
  }

  updateGeoInfo() {
    const ipElement = document.getElementById('geo-ip');
    const cityElement = document.getElementById('geo-city');
    const countryElement = document.getElementById('geo-country');

    if (ipElement) ipElement.textContent = this.data.ip;
    if (cityElement) cityElement.textContent = this.data.city;
    if (countryElement) countryElement.textContent = this.data.country;
  }
}