import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import webpush from 'web-push';

let redisClient = null;

async function getRedisClient() {
  if (redisClient) return redisClient;
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  client.on('error', (err) => console.error('Redis Client Error', err));
  await client.connect();
  redisClient = client;
  return redisClient;
}

// Configurar VAPID
webpush.setVapidDetails(
  'mailto:contato@ganhoubet.xyz',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BCQ7_QJfE6cBwcIpyABHGu0yqw6OCTQlQcEefDVAMcAnPvzCblWTebMoK37s7yuYnlyK7jE65qndMn21TVBCQJk',
  process.env.VAPID_PRIVATE_KEY || 'j_yYHfM1MmtdfB3QoFl7ZXJXGcWCasWacX_E1EFh-jA'
);

export async function GET() {
  try {
    if (!process.env.REDIS_URL) {
        return NextResponse.json({ error: 'DB_NOT_CONFIGURED', details: 'Falta conectar o Redis no Storage da Vercel' }, { status: 500 });
    }

    const redis = await getRedisClient();
    const data = await redis.get('push_subscriptions');
    const subscriptions = data ? JSON.parse(data) : [];
    
    return NextResponse.json({ count: subscriptions.length });
  } catch (err) {
    console.error('Redis GET Error:', err);
    return NextResponse.json({ count: 0, error: err.message });
  }
}

export async function POST(req) {
  try {
    if (!process.env.REDIS_URL) {
        return NextResponse.json({ error: 'DB_NOT_CONFIGURED' }, { status: 500 });
    }

    const { title, body, url } = await req.json();
    const redis = await getRedisClient();
    const data = await redis.get('push_subscriptions');
    const subscriptions = data ? JSON.parse(data) : [];

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'Nenhum assinante encontrado.', sentCount: 0 });
    }

    const payload = JSON.stringify({
      title: title || 'GanhouBet',
      body: body || '🎰 O Touro está solto! Recupere sua sorte agora.',
      url: url || 'https://play.ganhoubet.xyz/'
    });

    const results = await Promise.allSettled(
        subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );

    // Limpar inválidos
    const invalidEndpoints = results
        .filter(r => r.status === 'rejected' && (r.reason.statusCode === 410 || r.reason.statusCode === 404))
        .map((_, i) => subscriptions[i].endpoint);

    if (invalidEndpoints.length > 0) {
        const updatedSubs = subscriptions.filter(s => !invalidEndpoints.includes(s.endpoint));
        await redis.set('push_subscriptions', JSON.stringify(updatedSubs));
    }

    return NextResponse.json({ 
        success: true, 
        sentCount: results.filter(r => r.status === 'fulfilled').length,
        removedCount: invalidEndpoints.length
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
