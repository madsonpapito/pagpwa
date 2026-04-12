'use client';

import { useState, useEffect } from 'react';
import { subscribeUser } from '../../utils/push';

export default function AndroidStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [affiliateLink, setAffiliateLink] = useState('https://ganhou.bet');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.affiliateLink) setAffiliateLink(data.affiliateLink);
      })
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const handleInstall = (e) => {
    if (e) e.preventDefault();
    if (isInstalling) return;

    try {
      setIsInstalling(true);
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ 
          event: 'pwa_install_click',
          platform: 'android'
        });
      }

      let p = 0;
      const interval = setInterval(() => {
        p += 10; // Faster for testing
        if (p > 100) p = 100;
        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          finishInstallation();
        }
      }, 80);
    } catch (err) {
      console.error('Error on Android Install:', err);
      window.location.href = affiliateLink;
    }
  };

  const finishInstallation = async () => {
    // 1. Request Push Permission
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Permission granted! Subscribing device...');
            await subscribeUser(); // ACTION: Real time sync
        }
      } catch (e) {
        console.warn('Notification permission failed');
      }
    }

    // 2. Clear instructions and redirect
    setTimeout(() => {
      window.location.href = affiliateLink;
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#202124',
      fontFamily: '"Roboto", "Segoe UI", Tahoma, sans-serif',
      paddingBottom: '40px',
      margin: 0,
      display: 'block'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 100,
        borderBottom: '1px solid #f1f3f4'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <span style={{ fontSize: '18px', fontWeight: '500', color: '#5f6368' }}>Google Play</span>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        {/* App Info Container */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          <div style={{ 
            width: '84px', 
            height: '84px', 
            minWidth: '84px',
            borderRadius: '18px', 
            overflow: 'hidden', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #f1f3f4',
            backgroundColor: '#fff'
          }}>
            <img src="/images/android-icon.png" alt="GanhouBet Icon" style={{ width: '84px', height: '84px', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: '500', lineHeight: 1.2, margin: 0, color: '#202124' }}>GanhouBet: Mascot Casino</h1>
            <p style={{ color: '#01875f', fontSize: '16px', fontWeight: '500', margin: '4px 0 0' }}>GanhouBet Studio</p>
            <p style={{ color: '#5f6368', fontSize: '14px', margin: '4px 0' }}>Contém anúncios · Compras no app</p>
          </div>
        </div>

        {/* Install Button */}
        <button 
          onClick={handleInstall}
          disabled={isInstalling && progress === 100}
          style={{
            width: '100%',
            backgroundColor: '#01875f',
            color: 'white',
            padding: '12px 0',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isInstalling ? (progress === 100 ? 'CONCLUÍDO...' : `${progress}% Instalando...`) : 'Instalar'}
        </button>

        {/* Info Items */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f3f4', paddingBottom: '24px', marginBottom: '24px', gap: '24px', overflowX: 'auto' }}>
            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>4.8 ★</div>
                <div style={{ fontSize: '12px', color: '#5f6368' }}>Reviews</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>100K+</div>
                <div style={{ fontSize: '12px', color: '#5f6368' }}>Downloads</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>18+</div>
                <div style={{ fontSize: '12px', color: '#5f6368' }}>Classificação</div>
            </div>
        </div>

        {/* Screenshots */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '16px' }}>Imagens do app</h2>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={{ minWidth: '190px', height: '340px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f1f3f4' }}>
              <img src="/images/android-screen-1.png" alt="Preview" style={{ width: '190px', height: '340px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
