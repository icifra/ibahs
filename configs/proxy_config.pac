function FindProxyForURL(url, host) {
    // Сайты, которые должны использовать прокси
    if (dnsDomainIs(host, "chatgpt.com") || dnsDomainIs(host, "openai.com")) {
        return "PROXY 127.0.0.1:10050";
    }
    // Остальной трафик — напрямую
    return "DIRECT";
}
