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

async function getConfig() {
  try {
    if (process.env.REDIS_URL) {
      const redis = await getRedisClient();
      const data = await redis.get('pwa_config_v2');
      if (data) return JSON.parse(data);
    }
  } catch (e) {
    console.error('Redis Config Error:', e);
  }

  // Configuração Padrão
  return {
    affiliateLink: 'https://ganhou.bet/',
    gtmId: '',
    appName: 'GanhouBet App',
    pushMessages: [],
    funnel: [
      { id: 1, title: '🎁 Seu Bônus de Boas-vindas!', body: 'O Touro liberou 300 giros agora. Entre no app!', delay: 5 },
      { id: 2, title: '🎰 Alerta de Jackpot', body: 'Alguém acabou de ganhar R$ 5.400 no Mascot. Sua vez?', delay: 30 },
      { id: 3, title: '📢 Saldo Expirando', body: 'Não deixe sua sorte esfriar. Entre e jogue agora!', delay: 60 }
    ],
    twrParams: '',
    twrSlug: '',
    pixelId: ''
  };
}

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config);
}

export async function POST(req) {
  try {
    if (!process.env.REDIS_URL) {
        return NextResponse.json({ error: 'REDIS_NOT_CONFIGURED' }, { status: 500 });
    }

    const newConfig = await req.json();
    const redis = await getRedisClient();
    await redis.set('pwa_config_v2', JSON.stringify(newConfig));

    return NextResponse.json({ success: true, config: newConfig });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao salvar configuração no Redis' }, { status: 500 });
  }
}
