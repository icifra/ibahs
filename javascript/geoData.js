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

            // Создаем объект с данными
            this.data = {
                ip: ip || 'Неизвестно',
                city: city || 'Неизвестно',
                country: country || 'Неизвестно'
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
        // Находим элементы один раз и обновляем их содержимое
        const ipElement = document.getElementById('geo-ip');
        const cityElement = document.getElementById('geo-city');
        const countryElement = document.getElementById('geo-country');

        if (ipElement) ipElement.textContent = this.data.ip;
        if (cityElement) cityElement.textContent = this.data.city;
        if (countryElement) countryElement.textContent = this.data.country;
    }
}