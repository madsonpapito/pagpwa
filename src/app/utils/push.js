'use client';

function urlBase64ToUint8Array(base64String) {
  try {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (e) {
    return null;
  }
}

// Helper for timeout
const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

export const subscribeUser = async (metadata = {}) => {
  if (typeof window === 'undefined') return;
  
  console.log('--- Push Registration Start ---');
  
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error('Push Not Supported');
    return;
  }
  
  try {
    // 1. Race against timeout (10s) to avoid hanging
    const registration = await Promise.race([
        navigator.serviceWorker.ready,
        timeout(10000)
    ]);

    console.log('Service Worker Ready');

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
        console.log('Refreshing sync with server...');
        // CRITICAL FIX: PushSubscription não serializa com spread operator.
        // Usar .toJSON() para extrair endpoint, expirationTime e keys corretamente.
        const subData = existingSubscription.toJSON();
        console.log('📦 Existing sub data:', JSON.stringify(subData));
        await fetch('/api/push/subscription', {
            method: 'POST',
            body: JSON.stringify({ ...subData, ...metadata }),
            headers: { 'Content-Type': 'application/json' }
        });
        return;
    }

    const publicKey = 'BCQ7_QJfE6cBwcIpyABHGu0yqw6OCTQlQcEefDVAMcAnPvzCblWTebMoK37s7yuYnlyK7jE65qndMn21TVBCQJk';
    const convertedKey = urlBase64ToUint8Array(publicKey);
    if (!convertedKey) throw new Error('Invalid VAPID Key conversion');

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });

    // CRITICAL FIX: Usar .toJSON() para serializar corretamente o PushSubscription
    const subData = subscription.toJSON();
    console.log('📦 New sub data:', JSON.stringify(subData));

    if (!subData.endpoint) {
      console.error('❌ Subscription sem endpoint! Dados:', subData);
      return;
    }

    console.log('Sending subscription to server...');
    const res = await fetch('/api/push/subscription', {
      method: 'POST',
      body: JSON.stringify({ ...subData, ...metadata }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        console.log('✅ Subscribe Successful - endpoint:', subData.endpoint.substring(0, 50) + '...');
    } else {
        const errorData = await res.json();
        console.error('Server error during subscription:', errorData);
        alert('Erro ao salvar no banco. Verifique se o Vercel KV está configurado.');
    }
  } catch (err) {
    console.error('❌ Push registration error:', err.message);
    if (err.message === 'Timeout') {
        console.warn('Is the Service Worker registered with the correct scope?');
    }
  }
};
