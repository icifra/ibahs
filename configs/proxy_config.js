/* Proxy Auto-Configuration File */
function FindProxyForURL(url, host) {
    // Список доменов, которые должны использовать прокси:
    const proxyDomains = [
        "chatgpt.com",   // Основной сайт ChatGPT
        "openai.com",    // OpenAI и его поддомены
        "2ip.ru"         // Сервис для проверки IP
    ];

    // Проверка: использовать прокси для доменов из списка
    for (let i = 0; i < proxyDomains.length; i++) {
        if (dnsDomainIs(host, proxyDomains[i])) {
            return "PROXY 127.0.0.1:10050";
        }
    }

    // === Прямая обработка всего остального трафика ===
    return "DIRECT";
}

