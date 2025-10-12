/* Proxy Auto-Configuration File */
function FindProxyForURL(url, host) {
  // Сайты, которые должны использовать прокси
  if (
    // OpenAI
    dnsDomainIs(host, "chatgpt.com") || 
    dnsDomainIs(host, "openai.com") ||
    
    // Claude/Anthropic
    dnsDomainIs(host, "claude.ai") ||
    dnsDomainIs(host, "anthropic.com") ||
    dnsDomainIs(host, "stripe.com") ||

    // AWS (общее + специфичные регионы)
    dnsDomainIs(host, "amazonaws.com") ||
    dnsDomainIs(host, "compute-1.amazonaws.com") ||
    shExpMatch(host, "*.compute-*.amazonaws.com") ||
    
    // Google AI
    dnsDomainIs(host, "google.com") ||
    dnsDomainIs(host, "googleapis.com") ||

    // Другие сервисы
    dnsDomainIs(host, "microsoft.com")
  ) {
    return "SOCKS 127.0.0.1:10808"; // Указание адреса прокси
  }

  // Все остальные запросы идут напрямую
  return "DIRECT";
}
