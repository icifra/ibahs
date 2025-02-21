import HLSInitializer from './hlsInitializer.js';
import GeoDataInitializer from './geoData.js';
import ChatBotInitializer from './chatBot.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Инициализируем HLS
  const hlsInit = new HLSInitializer();
  hlsInit.initializeAll();

  // Инициализируем гео-данные
  const geoInit = new GeoDataInitializer();
  await geoInit.initialize();

  // Инициализируем чат-бот
  new ChatBotInitializer();
});