'use client';

import { useEffect } from 'react';

// Help functions outside to keep component clean
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

const subscribeUser = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) return;

    const publicKey = 'BCQ7_QJfE6cBwcIpyABHGu0yqw6OCTQlQcEefDVAMcAnPvzCblWTebMoK37s7yuYnlyK7jE65qndMn21TVBCQJk';
    const convertedKey = urlBase64ToUint8Array(publicKey);
    if (!convertedKey) return;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });

    await fetch('/api/push/subscription', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Subscribe Successful');
  } catch (err) {
    console.error('❌ Push registration failed:', err);
  }
};

export default function PwaHandler() {
  useEffect(() => {
    // 1. Service Worker Registration (Safe Boot)
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js?v=2');
          console.log('SW scope:', reg.scope);
        } catch (e) {
          console.error('SW Error:', e);
        }
      }
    };

    // Delay registration for mobile stability
    const timer = setTimeout(() => {
        registerSW();
        
        // 2. Permission logic
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') subscribeUser();
                });
            } else if (Notification.permission === 'granted') {
                subscribeUser();
            }
        }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
