'use client';

import { useState, useEffect } from 'react';
import { subscribeUser } from '../../utils/push';

export default function IosStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
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

  const handleInstall = async (e) => {
    if (e) e.preventDefault();
    if (isInstalling) return;

    try {
      setIsInstalling(true);

      // 1. Gerar Event ID único para toda a sessão (Deduplicação)
      const sessionEventId = 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

      // 2. Evento: InitiateCheckout (GTM + CAPI)
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ 
          event: 'InitiateCheckout',
          platform: 'ios',
          event_id: sessionEventId
        });
      }

      // Disparo CAPI (Servidor) - Redundância Crítica
      fetch('/api/event', {
        method: 'POST',
        body: JSON.stringify({
          eventName: 'InitiateCheckout',
          eventId: sessionEventId,
          customData: { platform: 'ios' }
        })
      }).catch(err => console.error('CAPI IC Error:', err));

      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        if (p > 100) p = 100;
        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          finishInstallation(sessionEventId);
        }
      }, 100);
    } catch (err) {
      console.error('Error during install:', err);
      window.location.href = affiliateLink;
    }
  };

  const finishInstallation = async (sessionEventId) => {
    // Se não recebeu o ID, cria um novo (fallback)
    const eventId = sessionEventId || ('lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));

    // 2. Request Push Permission
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
              window.dataLayer.push({ 
                event: 'Lead', 
                platform: 'ios',
                event_id: 'ld_' + eventId // FB CAPI Deduplication
              });
            // Disparo CAPI (Servidor) - Redundância Crítica
            fetch('/api/event', {
              method: 'POST',
              body: JSON.stringify({
                eventName: 'Lead',
                eventId: 'ld_' + eventId,
                customData: { platform: 'ios', status: 'granted' }
              })
            }).catch(err => console.error('CAPI Lead Error:', err));

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

    // 3. Evento: AddPaymentInfo - GTM + CAPI
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'AddPaymentInfo',
        platform: 'ios',
        event_id: 'pay_' + eventId
      });
    }

    fetch('/api/event', {
      method: 'POST',
      body: JSON.stringify({
        eventName: 'AddPaymentInfo',
        eventId: 'pay_' + eventId,
        customData: { platform: 'ios' }
      })
    }).catch(err => console.error('CAPI Payment Error:', err));

    // 4. Show iOS specific instructions
    setShowIosTutorial(true);
    setIsFinished(true);
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
          onClick={(e) => isFinished ? (window.location.href = affiliateLink) : handleInstall(e)}
          style={{
            backgroundColor: '#007aff',
            color: '#ffffff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            opacity: isInstalling && !isFinished ? 0.7 : 1
          }}
        >
          {isFinished ? 'ABRIR' : (isInstalling ? `${progress}%` : 'OBTER')}
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
               <button 
                onClick={(e) => isFinished ? (window.location.href = affiliateLink) : handleInstall(e)} 
                style={{ backgroundColor: '#007aff', color: '#ffffff', padding: '6px 24px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: isInstalling && !isFinished ? 0.7 : 1 }}>
                {isFinished ? 'ABRIR' : (isInstalling ? (progress === 100 ? 'CONCLUÍDO' : 'BAIXANDO...') : 'OBTER')}
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
              {[
                { src: '/images/screen-1.png', alt: 'Big Win' },
                { src: '/images/screen-2.png', alt: 'Slots' },
                { src: '/images/android-screen-1.png', alt: 'Login' }
              ].map((img, idx) => (
                <div key={idx} style={{ minWidth: '240px', height: '480px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f2f2f7' }}>
                  <img src={img.src} alt={img.alt} style={{ width: '240px', height: '480px', objectFit: 'cover' }} />
                </div>
              ))}
           </div>
        </div>

        {/* Ratings Section (from Android) */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1c1c1e' }}>Notas e avaliações</h2>
            <span style={{ color: '#007aff', fontSize: '16px' }}>Ver tudo</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1c1c1e' }}>4.9</div>
                <div style={{ fontSize: '13px', color: '#8e8e93', fontWeight: 'bold' }}>de 5</div>
             </div>
             <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <div style={{ flex: 1, height: '4px', backgroundColor: '#e5e5ea', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: n === 5 ? '92%' : (n === 4 ? '5%' : '1%'), height: '100%', backgroundColor: '#8e8e93', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {[
            { name: 'Ricardo Silva', comment: 'Finalmente o app oficial! O saque via PIX é instantâneo mesmo, já forrei R$ 300 hoje.', date: 'há 2 dias' },
            { name: 'Bia Oliveira', comment: 'Mascote ta pagando muito! Interface muito limpa e não trava igual o site.', date: 'há 4 dias' },
            { name: 'Marcos Panda', comment: 'Melhor casino do Brasil, suporte nota 10 e o app ficou show.', date: 'há 1 semana' }
          ].map((rev, i) => (
            <div key={i} style={{ backgroundColor: '#f2f2f7', borderRadius: '15px', padding: '16px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{rev.name}</span>
                <span style={{ color: '#8e8e93', fontSize: '14px' }}>{rev.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                 {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#ff9500', fontSize: '12px' }}>★</span>)}
              </div>
              <p style={{ fontSize: '15px', color: '#1c1c1e', lineHeight: '1.4', margin: 0 }}>{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
