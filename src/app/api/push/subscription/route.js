import { NextResponse } from 'next/server';
import { createClient } from 'redis';

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

export async function POST(req) {
  try {
    // DIAGNÓSTICO: Se não houver REDIS_URL, retornar erro explícito
    if (!process.env.REDIS_URL) {
        return NextResponse.json({ error: 'REDIS_NOT_CONFIGURED', details: 'Clique em "Connect Project" na Vercel' }, { status: 500 });
    }

    const subscription = await req.json();
    const redis = await getRedisClient();
    
    // Buscar assinantes atuais
    const data = await redis.get('push_subscriptions');
    let subscriptions = data ? JSON.parse(data) : [];
    
    // Verificar duplicatas
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    
    if (!exists) {
      subscriptions.push(subscription);
      await redis.set('push_subscriptions', JSON.stringify(subscriptions));
      console.log('✅ Novo assinante registrado via Redis!');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription Redis Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { endpoint } = await req.json();
    const redis = await getRedisClient();
    
    const data = await redis.get('push_subscriptions');
    let subscriptions = data ? JSON.parse(data) : [];
    
    subscriptions = subscriptions.filter(s => s.endpoint !== endpoint);
    await redis.set('push_subscriptions', JSON.stringify(subscriptions));
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
