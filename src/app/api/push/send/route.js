import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import webpush from 'web-push';

// Configurar VAPID (Usando as chaves geradas anteriormente)
webpush.setVapidDetails(
  'mailto:contato@ganhoubet.xyz',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BCQ7_QJfE6cBwcIpyABHGu0yqw6OCTQlQcEefDVAMcAnPvzCblWTebMoK37s7yuYnlyK7jE65qndMn21TVBCQJk',
  process.env.VAPID_PRIVATE_KEY || 'j_yYHfM1MmtdfB3QoFl7ZXJXGcWCasWacX_E1EFh-jA'
);

export async function POST(req) {
  try {
    const { title, body, url } = await req.json();
    const subscriptions = await kv.get('push_subscriptions') || [];

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'Nenhum assinante encontrado.' });
    }

    const payload = JSON.stringify({
      title: title || 'GanhouBet',
      body: body || '🎰 O Touro está solto! Recupere sua sorte agora.',
      url: url || 'https://play.ganhoubet.xyz/'
    });

    const results = await Promise.allSettled(
        subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );

    // Limpeza de assinaturas inválidas (expiradas ou removidas pelo browser)
    const invalidEndpoints = results
        .filter(r => r.status === 'rejected' && (r.reason.statusCode === 410 || r.reason.statusCode === 404))
        .map((_, i) => subscriptions[i].endpoint);

    if (invalidEndpoints.length > 0) {
        const updatedSubs = subscriptions.filter(s => !invalidEndpoints.includes(s.endpoint));
        await kv.set('push_subscriptions', updatedSubs);
    }

    return NextResponse.json({ 
        success: true, 
        sentCount: results.filter(r => r.status === 'fulfilled').length,
        removedCount: invalidEndpoints.length
    });

  } catch (err) {
    console.error('Send Push Error:', err);
    return NextResponse.json({ error: 'Erro ao enviar notificações' }, { status: 500 });
  }
}
