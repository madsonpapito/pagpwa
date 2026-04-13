import crypto from 'crypto';

/**
 * Envia um evento de conversão para a Graph API do Facebook (CAPI)
 */
export async function sendCapiEvent({
  eventName,
  eventId,
  req, // Request object para extrair IP e User Agent
  userData = {},
  customData = {}
}) {
  try {
    const pixelId = process.env.FB_PIXEL_ID || "1514318250732031";
    const accessToken = process.env.FB_ACCESS_TOKEN || "EAAXafogI9v8BRE6XCmRZBgOKquMVnNTZCQFzW7fd9GbZBhtUFo1LGhaku4Kay73URgFW6AHLqL7IYS7y54enpBdgr3z37zgZASxtanc0djUqAvHvy7lVe4ML7MtWW6txEdNnex7xVAcpSBwekrKxKJA0w0IvCZAtlV5Pi3g0EkEhgqLs6ZBWgtuec3voK2ppbjwwZDZD";

    if (!pixelId || !accessToken) {
      console.warn('⚠️ FB CAPI: Pixel ID ou Token não configurados.');
      return null;
    }

    // Extrair dados do cabeçalho se disponíveis (para melhor match rate)
    let clientIpAddress = '';
    let clientUserAgent = '';

    if (req) {
      clientIpAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || '';
      clientUserAgent = req.headers.get('user-agent') || '';
    }

    const testCode = process.env.FB_TEST_EVENT_CODE || "";

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: eventId,
          user_data: {
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
            ...userData
          },
          custom_data: customData
        }
      ]
    };

    if (testCode) {
      payload.test_event_code = testCode;
    }

    console.log(`📡 Enviando CAPI: ${eventName} (ID: ${eventId})`);

    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.error) {
        console.error('❌ Erro FB CAPI:', result.error);
    } else {
        console.log('✅ FB CAPI Sucesso:', result);
    }

    return result;
  } catch (error) {
    console.error('❌ Falha crítica no Webhook CAPI:', error);
    return null;
  }
}

/**
 * Helper para hash SHA256 (exigido pelo FB para dados sensíveis)
 */
export function hashData(data) {
  if (!data) return '';
  return crypto.createHash('sha256').update(String(data).toLowerCase().trim()).digest('hex');
}
