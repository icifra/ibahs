/* Proxy Auto-Configuration File */
function FindProxyForURL(url, host) {
    // Сайты, которые должны использовать прокси
    if (
        dnsDomainIs(host, "chatgpt.com") || // сайты и поддомены
        dnsDomainIs(host, "openai.com") || 
        dnsDomainIs(host, "microsoft.com") ||
        dnsDomainIs(host, "claude.ai") ||
        dnsDomainIs(host, "corsair.com")
    ) {
        return "PROXY 127.0.0.1:10809"; // Указание адреса прокси
    }

    // Все остальные запросы идут напрямую
    return "DIRECT";
}
