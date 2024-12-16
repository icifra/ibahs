/* Proxy Auto-Configuration File */
function FindProxyForURL(url, host) {
  // Сайты, которые должны использовать прокси
  if (
    dnsDomainIs(host, "chatgpt.com") || // сайты и поддомены
    dnsDomainIs(host, "openai.com") ||
    dnsDomainIs(host, "claude.ai") ||
    dnsDomainIs(host, "microsoft.com")
  ) {
    return "SOCKS 127.0.0.1:10808"; // Указание адреса прокси
  }

  // Все остальные запросы идут напрямую
  return "DIRECT";
}
