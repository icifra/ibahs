/* Proxy Auto-Configuration File */
function FindProxyForURL(url, host) {
    // Сайты, которые должны использовать прокси
    if (
        dnsDomainIs(host, "chatgpt.com") || // chatgpt.com и поддомены
        dnsDomainIs(host, "openai.com") || // openai.com и поддомены
        dnsDomainIs(host, "microsoft.com")   // сайт и поддомены
    ) {
        return "PROXY 127.0.0.1:10050"; // Указание адреса прокси
    }

    // Все остальные запросы идут напрямую
    return "DIRECT";
}
