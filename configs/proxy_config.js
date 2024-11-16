/* Proxy Auto-Configuration File 
 * Этот скрипт проксирует трафик для указанных доменов и их поддоменов через указанный прокси.
 */
function FindProxyForURL(url, host) {
    // Сайты, которые должны использовать прокси
    if (
        dnsDomainIs(host, "chatgpt.com") || // chatgpt.com и поддомены
        dnsDomainIs(host, "openai.com") || // openai.com и поддомены
        dnsDomainIs(host, "2ip.ru")        // 2ip.ru и поддомены
    ) {
        return "PROXY 127.0.0.1:10050"; // Указание адреса прокси
    }

    // Все остальные запросы идут напрямую
    return "DIRECT";
}
