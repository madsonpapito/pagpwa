'use client';

import { useState, useEffect } from 'react';
import { subscribeUser } from '../../utils/push';

export default function IosStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [affiliateLink, setAffiliateLink] = useState('https://ganhou.bet');
  const [showIosTutorial, setShowIosTutorial] = useState(false);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    // 0. Capturar parâmetros da URL (TWR)
    if (typeof window !== 'undefined') {
        const params = Object.fromEntries(new URLSearchParams(window.location.search));
        setQueryParams(params);
    }
    // 1. Carregar Config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.affiliateLink) setAffiliateLink(data.affiliateLink);
      })
      .catch(err => console.error('Failed to load config:', err));

    // 2. Evento: ViewContent
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'ViewContent',
        platform: 'ios',
        content_name: 'Store iOS'
      });
    }
  }, []);

  const handleInstall = (e) => {
    if (e) e.preventDefault();
    if (isInstalling) return;

    try {
      setIsInstalling(true);
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ 
          event: 'InitiateCheckout',
          platform: 'ios'
        });
      }

      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        if (p > 100) p = 100;
        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          finishInstallation();
        }
      }, 100);
    } catch (err) {
      console.error('Error during install:', err);
      window.location.href = affiliateLink;
    }
  };

  const finishInstallation = async () => {
    // 1. Generate Event ID for Deduplication
    const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    // 2. Request Push Permission
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            if (window.dataLayer) {
              window.dataLayer.push({ 
                event: 'Lead', 
                platform: 'ios',
                event_id: eventId // FB CAPI Deduplication
              });
            console.log('Permission granted! Subscribing device...');
            await subscribeUser({ 
                eventId,
                metadata: queryParams // Salva dados do TWR no Redis
            }); 
        } else {
            if (window.dataLayer) {
              window.dataLayer.push({ event: 'PushDenied', platform: 'ios' });
            }
        }
      } catch (e) {
        console.warn('Notification permission failed');
      }
    }

    // 3. Evento: AddPaymentInfo
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'AddPaymentInfo',
        platform: 'ios',
        event_id: 'payment_' + eventId
      });
    }

    // 4. Show iOS specific instructions
    setShowIosTutorial(true);

    // 4. Final Redirect (500ms delay to ensure GTM fires)
    setTimeout(() => {
      window.location.href = affiliateLink;
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#1c1c1e',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '80px',
      margin: 0,
      display: 'block'
    }}>
      {/* Top Navbar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e5ea',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden' }}>
             <img src="/images/app-icon.png" alt="Icon" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
           </div>
        </div>
        <button 
          onClick={handleInstall}
          style={{
            backgroundColor: '#007aff',
            color: '#ffffff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            opacity: isInstalling ? 0.7 : 1
          }}
        >
          {isInstalling ? `${progress}%` : 'OBTER'}
        </button>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '110px', height: '110px', minWidth: '110px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', border: '1px solid #f2f2f7', backgroundColor: '#fff' }}>
            <img src="/images/app-icon.png" alt="GanhouBet Icon" style={{ width: '110px', height: '110px', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: 1.2, margin: 0, color: '#1c1c1e' }}>GanhouBet: Mascot Slots Casino</h1>
            <p style={{ color: '#8e8e93', fontSize: '15px', fontWeight: '500', margin: '4px 0 0' }}>Win Real Cash & Jackpots</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <button onClick={handleInstall} style={{ backgroundColor: '#007aff', color: '#ffffff', padding: '6px 24px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: isInstalling ? 0.7 : 1 }}>
                {isInstalling ? (progress === 100 ? 'CONCLUÍDO' : 'BAIXANDO...') : 'OBTER'}
               </button>
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showIosTutorial && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '30px', padding: '30px', maxWidth: '350px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>📲</div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Ative seu Bônus!</h2>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.4, marginBottom: '20px' }}>
                Clique no botão de <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong>.
              </p>
              <div style={{ color: '#007aff', fontWeight: 'bold' }}>Redirecionando...</div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
           <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Pré-visualização</h2>
           <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
              <div style={{ minWidth: '240px', height: '480px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f2f2f7' }}>
                <img src="/images/screen-1.png" alt="Preview 1" style={{ width: '240px', height: '480px', objectFit: 'cover' }} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
