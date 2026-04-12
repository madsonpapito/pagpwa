'use client';

import { useEffect } from 'react';
import { subscribeUser } from '../utils/push';

export default function PwaHandler() {
  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Version bust for service worker
          const reg = await navigator.serviceWorker.register('/sw.js?v=2');
          console.log('SW Registered:', reg.scope);
        } catch (e) {
          console.error('SW Error:', e);
        }
      }
    };

    // Safe delay to ensure page rendering is not blocked on mobile
    const timer = setTimeout(() => {
        registerSW();
        
        // Auto-attempt subscription if permission is already granted
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                subscribeUser();
            }
        }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
