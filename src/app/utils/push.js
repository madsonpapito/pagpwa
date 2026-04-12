'use client';

// Helper functions for VAPID key conversion
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
    console.error('Base64 conversion error:', e);
    return null;
  }
}

export const subscribeUser = async () => {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push not supported in this browser');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check for existing subscription to avoid duplicates
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
        console.log('User already subscribed, refreshing on server...');
        // We sync again just in case the server lost the record
        await fetch('/api/push/subscription', {
            method: 'POST',
            body: JSON.stringify(existingSubscription),
            headers: { 'Content-Type': 'application/json' }
        });
        return;
    }

    const publicKey = 'BCQ7_QJfE6cBwcIpyABHGu0yqw6OCTQlQcEefDVAMcAnPvzCblWTebMoK37s7yuYnlyK7jE65qndMn21TVBCQJk';
    const convertedKey = urlBase64ToUint8Array(publicKey);
    if (!convertedKey) return;

    console.log('Creating new push subscription...');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });

    const res = await fetch('/api/push/subscription', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        console.log('✅ Subscribe Successful & Synced with Server');
    }
  } catch (err) {
    console.error('❌ Push registration failed:', err);
  }
};
