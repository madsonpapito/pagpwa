import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req) {
  try {
    const subscription = await req.json();
    
    // Armazenar a assinatura no Vercel KV
    // Usamos um Set ou uma lista para evitar duplicatas baseadas no endpoint
    const subscriptions = await kv.get('push_subscriptions') || [];
    
    // Verificar se já existe
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    
    if (!exists) {
      subscriptions.push(subscription);
      await kv.set('push_subscriptions', subscriptions);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription Error:', err);
    return NextResponse.json({ error: 'Erro ao assinar' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { endpoint } = await req.json();
    let subscriptions = await kv.get('push_subscriptions') || [];
    
    subscriptions = subscriptions.filter(s => s.endpoint !== endpoint);
    await kv.set('push_subscriptions', subscriptions);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao desinscrever' }, { status: 500 });
  }
}
