import HLSInitializer from './hlsInitializer.js';
import GeoDataInitializer from './geoData.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Инициализируем HLS
  const hlsInit = new HLSInitializer();
  hlsInit.initializeAll();

  // Инициализируем гео-данные
  const geoInit = new GeoDataInitializer();
  await geoInit.initialize();
});