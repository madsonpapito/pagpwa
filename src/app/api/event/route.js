import { NextResponse } from 'next/server';
import { sendCapiEvent } from '../../utils/facebook-capi';

/**
 * Rota para receber eventos do frontend e disparar via Facebook CAPI (Redundância)
 */
export async function POST(req) {
  try {
    const { eventName, eventId, userData = {}, customData = {} } = await req.json();

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'Missing eventName or eventId' }, { status: 400 });
    }

    // Disparar o evento via Servidor (CAPI)
    const result = await sendCapiEvent({
      eventName,
      eventId,
      req,
      userData,
      customData
    });

    return NextResponse.json({ 
      success: true, 
      received: eventName,
      capiResult: result 
    });

  } catch (err) {
    console.error('❌ API Event Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
