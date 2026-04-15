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

export async function GET(req) {
  // Opcional: Proteger a rota com um token se necessário
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) ...

  try {
    if (!process.env.REDIS_URL) {
      return NextResponse.json({ error: 'REDIS_NOT_CONFIGURED' }, { status: 500 });
    }

    const redis = await getRedisClient();
    
    // 1. Carregar Configurações do Funil
    const configData = await redis.get('pwa_config_v2');
    if (!configData) return NextResponse.json({ message: 'Sem configuração de funil.' });
    const config = JSON.parse(configData);
    const funnel = config.funnel || [];

    if (funnel.length === 0) return NextResponse.json({ message: 'Funil vazio.' });

    // 2. Carregar Assinantes
    const subsData = await redis.get('push_subscriptions');
    if (!subsData) return NextResponse.json({ message: 'Sem assinantes.' });
    let subscriptions = JSON.parse(subsData);

    let sentCount = 0;
    let updatedAny = false;

    // 3. Processar cada assinante
    for (let sub of subscriptions) {
      if (!sub.createdAt) continue;

      const timePassedMinutes = (Date.now() - sub.createdAt) / (1000 * 60);
      sub.sentAutomations = sub.sentAutomations || [];

      for (let step of funnel) {
        // Se já passou o tempo (em minutos) E ainda não enviou essa etapa específica
        if (timePassedMinutes >= step.delay && !sub.sentAutomations.includes(step.id)) {
          try {
            const payload = JSON.stringify({
              title: step.title || config.appName,
              body: step.body,
              url: config.affiliateLink
            });

            await webpush.sendNotification(sub, payload);
            sub.sentAutomations.push(step.id);
            sentCount++;
            updatedAny = true;
            
            console.log(`🚀 Automação enviada para ${sub.endpoint} (Etapa: ${step.title})`);
          } catch (err) {
            console.error('Falha ao enviar automação:', err.endpoint);
            // Se o endpoint estiver morto, poderíamos remover aqui
          }
        }
      }
    }

    // 4. Salvar estado atualizado se houver mudanças
    if (updatedAny) {
      await redis.set('push_subscriptions', JSON.stringify(subscriptions));
      
      // [NEW] Atualizar Estatísticas Globais
      const totalKey = 'push_stats:total_sent';
      const currentTotal = await redis.get(totalKey) || 0;
      await redis.set(totalKey, parseInt(currentTotal) + sentCount);
      await redis.set('push_stats:last_run', Date.now().toString());
    }

    return NextResponse.json({ 
        success: true, 
        message: `Processamento concluído. ${sentCount} mensagens enviadas.`,
        totalProcessed: subscriptions.length
    });

  } catch (err) {
    console.error('Cron Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
