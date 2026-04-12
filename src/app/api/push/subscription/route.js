import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req) {
  try {
    // DIAGNÓSTICO
    if (!process.env.KV_REST_API_URL) {
        return NextResponse.json({ error: 'DB_NOT_CONFIGURED' }, { status: 500 });
    }

    const subscription = await req.json();
    const subscriptions = await kv.get('push_subscriptions') || [];
    
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    
    if (!exists) {
      subscriptions.push(subscription);
      await kv.set('push_subscriptions', subscriptions);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
