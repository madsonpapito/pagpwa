'use client';

import { useEffect } from 'react';

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

    // 2. Request Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000); // Ask after 5 seconds
    }

    // 3. Remarketing Scheduler (Local Simulation)
    // Para produção real, usar um servidor Push (FCM/OneSignal)
    const scheduleRemarketing = async () => {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        
        if (Notification.permission === 'granted' && config.pushMessages) {
          config.pushMessages.forEach(msg => {
            const hours = parseInt(msg.time);
            if (!isNaN(hours)) {
              const delay = hours * 3600000; // Convert to ms
              setTimeout(() => {
                new Notification(config.appName, {
                  body: msg.text,
                  icon: '/touro.png',
                  data: { url: config.affiliateLink }
                });
              }, delay);
            }
          });
        }
      } catch (e) {
        console.error('Failed to schedule push', e);
      }
    };

    scheduleRemarketing();
  }, []);

  return null;
}
