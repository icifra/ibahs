/* Proxy Auto-Configuration File */
function FindProxyForURL(url, host) {
  // Сайты, которые должны использовать прокси
  if (
    // Microsoft
    dnsDomainIs(host, "microsoft.com") ||

    // OpenAI
    dnsDomainIs(host, "chatgpt.com") || 
    dnsDomainIs(host, "openai.com") ||
    
    // Claude/Anthropic
    dnsDomainIs(host, "claude.ai") ||
    dnsDomainIs(host, "anthropic.com") ||
    dnsDomainIs(host, "amazonaws.com") ||
    
    // Google AI
    dnsDomainIs(host, "google.com") ||
    dnsDomainIs(host, "googleapis.com") ||

    // Оплаты 
    dnsDomainIs(host, "stripe.com")
  ) {
    return "SOCKS 127.0.0.1:10808"; // Указание адреса прокси
  }

  // Все остальные запросы идут напрямую
  return "DIRECT";
}