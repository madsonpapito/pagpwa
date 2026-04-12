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
    if (!process.env.REDIS_URL) {
        return NextResponse.json({ error: 'REDIS_NOT_CONFIGURED' }, { status: 500 });
    }

    const subscription = await req.json();
    const redis = await getRedisClient();
    
    const data = await redis.get('push_subscriptions');
    let subscriptions = data ? JSON.parse(data) : [];
    
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    
    if (!exists) {
      // Adicionar metadados para automação
      const newSubscriber = {
        ...subscription,
        createdAt: Date.now(),
        sentAutomations: [] // Lista de IDs de mensagens do funil já enviadas
      };
      
      subscriptions.push(newSubscriber);
      await redis.set('push_subscriptions', JSON.stringify(subscriptions));
      console.log('✅ Novo lead registrado no Funil Automático!');
    } else {
        // Se já existe, garantir que tenha o campo createdAt
        const index = subscriptions.findIndex(s => s.endpoint === subscription.endpoint);
        if (!subscriptions[index].createdAt) {
            subscriptions[index].createdAt = Date.now();
            subscriptions[index].sentAutomations = subscriptions[index].sentAutomations || [];
            await redis.set('push_subscriptions', JSON.stringify(subscriptions));
        }
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
