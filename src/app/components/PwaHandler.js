'use client';

import { useEffect } from 'react';

// Utility to convert VAPID public key
function urlBase64ToUint8Array(base64String) {
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
}

// Subscription & Push Handshake (Real Server-to-Client)
const subscribeUser = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Wait for registration to be ready (Crucial for mobile)
      const registration = await navigator.serviceWorker.ready;
      
      // Force a small delay to ensure SW is active on slow devices
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for existing subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) return; // Already subscribed

      // Subscribe using VAPID Public Key
      const publicKey = 'BCQ7_QJfE6cBwcIpyABHGu0yqw6OCTQlQcEefDVAMcAnPvzCblWTebMoK37s7yuYnlyK7jE65qndMn21TVBCQJk';
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send to backend
      await fetch('/api/push/subscription', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Web Push Subscription Successful');
    } catch (err) {
      console.error('❌ Failed to subscribe user: ', err);
    }
  }
};

export default function PwaHandler() {
  useEffect(() => {
    // 1. Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('SW registered: ', registration.scope);
          },
          function(err) {
            console.log('SW registration failed: ', err);
          }
        );
      });
    }

    // 2. Request Notification Permission & Subscribe Immediately
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('🔔 Permission granted! Subscribing...');
            subscribeUser();
          }
        });
      }, 5000); // Ask after 5 seconds
    }

    if (Notification.permission === 'granted') {
      subscribeUser();
    }

    // 4. Detect Push Click and fire GTM Event
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('utm_medium') === 'push_click') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'push_notification_click',
        campaign: urlParams.get('utm_campaign') || 'remarketing_pwa'
      });
      console.log('Push Click Detected - GTM Event Fired');
    }
  }, []);

  return null;
}
