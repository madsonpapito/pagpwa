'use client';

import { useState, useEffect } from 'react';
import { subscribeUser } from '../../utils/push';

export default function AndroidStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pendingEventId, setPendingEventId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [affiliateLink, setAffiliateLink] = useState('https://ganhou.bet');
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
        platform: 'android',
        content_name: 'Store Android'
      });
    }
  }, []);

  const handleInstall = async (e) => {
    if (e) e.preventDefault();
    if (isInstalling) return;

    try {
      setIsInstalling(true);
      
      // 1. Gerar Event ID único para toda a sessão de instalação (Deduplicação)
      const sessionEventId = 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

      // 2. Evento: InitiateCheckout (GTM + CAPI)
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ 
          event: 'InitiateCheckout',
          platform: 'android',
          event_id: sessionEventId
        });
      }

      // Disparo CAPI (Servidor) - Redundância Crítica
      fetch('/api/event', {
        method: 'POST',
        body: JSON.stringify({
          eventName: 'InitiateCheckout',
          eventId: sessionEventId,
          customData: { platform: 'android' }
        })
      }).catch(err => console.error('CAPI IC Error:', err));

      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        if (p > 100) p = 100;
        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          finishInstallation(sessionEventId); // Passa o ID para os próximos eventos
        }
      }, 80);
    } catch (err) {
      console.error('Error on Android Install:', err);
      window.location.href = affiliateLink;
    }
  };

  const finishInstallation = (sessionEventId) => {
    const eventId = sessionEventId || ('lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
    setPendingEventId(eventId);

    // Soft Ask: mostrar modal customizado antes do prompt nativo
    if ('Notification' in window && Notification.permission === 'default') {
      setShowPermissionModal(true);
    } else {
      // Permissão já concedida, negada ou não suportada
      completeInstallation(eventId);
    }
  };

  const handleAcceptPush = async () => {
    setShowPermissionModal(false);
    const eventId = pendingEventId;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if (window.dataLayer) {
          window.dataLayer.push({ 
            event: 'Lead', 
            platform: 'android',
            event_id: 'ld_' + eventId
          });
        }
        fetch('/api/event', {
          method: 'POST',
          body: JSON.stringify({
            eventName: 'Lead',
            eventId: 'ld_' + eventId,
            customData: { platform: 'android', status: 'granted' }
          })
        }).catch(err => console.error('CAPI Lead Error:', err));

        console.log('Permission granted! Subscribing device...');
        await subscribeUser({ 
          eventId,
          metadata: queryParams
        });
      } else {
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'PushDenied', platform: 'android' });
        }
      }
    } catch (e) {
      console.warn('Notification permission failed');
    }

    completeInstallation(eventId);
  };

  const handleDeclinePush = () => {
    setShowPermissionModal(false);
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'PushSkipped', platform: 'android' });
    }
    completeInstallation(pendingEventId);
  };

  const completeInstallation = (eventId) => {
    // Evento: AddPaymentInfo (Início do redirecionamento para o cadastro) - GTM + CAPI
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'AddPaymentInfo',
        platform: 'android',
        event_id: 'pay_' + eventId
      });
    }

    fetch('/api/event', {
      method: 'POST',
      body: JSON.stringify({
        eventName: 'AddPaymentInfo',
        eventId: 'pay_' + eventId,
        customData: { platform: 'android' }
      })
    }).catch(err => console.error('CAPI Payment Error:', err));

    setIsFinished(true);
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
        <div style={{ display: 'flex', gap: '20px' }}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
           <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        {/* App Info Container */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ 
            width: '96px', 
            height: '96px', 
            minWidth: '96px',
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f1f3f4',
            backgroundColor: '#fff'
          }}>
            <img src="/images/app-icon.png" alt="GanhouBet Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '500', lineHeight: 1.2, margin: 0, color: '#202124' }}>Ganhou Bet: Mascot & Slots</h1>
            <p style={{ color: '#01875f', fontSize: '16px', fontWeight: '500', margin: '4px 0 0' }}>GanhouBet Official Ltd.</p>
            <p style={{ color: '#5f6368', fontSize: '14px', margin: '4px 0' }}>Contém anúncios · Compras no app</p>
          </div>
        </div>

        {/* Info Items Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid #f1f3f4', overflowX: 'auto' }}>
            <div style={{ textAlign: 'center', minWidth: '70px', borderRight: '1px solid #f1f3f4', flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>4.9 ★</div>
                <div style={{ fontSize: '11px', color: '#5f6368' }}>48 mil avaliações</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '70px', borderRight: '1px solid #f1f3f4', flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>10 MB</div>
                <div style={{ fontSize: '11px', color: '#5f6368' }}>Tamanho do app</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '70px', borderRight: '1px solid #f1f3f4', flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>1 Mi+</div>
                <div style={{ fontSize: '11px', color: '#5f6368' }}>Downloads</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '70px', flex: 1 }}>
                <div style={{ fontSize: '10px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ border: '1.5px solid #202124', borderRadius: '2px', padding: '0 2px', fontWeight: 'bold' }}>18+</span></div>
                <div style={{ fontSize: '11px', color: '#5f6368' }}>Classificação</div>
            </div>
        </div>

        {/* Install Button */}
        <button 
          onClick={(e) => isFinished ? (window.location.href = affiliateLink) : handleInstall(e)}
          disabled={isInstalling && !isFinished && progress === 100}
          style={{
            width: '100%',
            backgroundColor: '#01875f',
            color: 'white',
            padding: '10px 0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: isInstalling && !isFinished ? 'default' : 'pointer',
            marginBottom: '32px',
            transition: 'background-color 0.2s',
          }}
        >
          {isFinished ? 'Abrir' : (isInstalling ? (progress === 100 ? 'CONCLUÍDO...' : `${progress}% Instalando...`) : 'Instalar')}
        </button>

        {/* Pre-Permission Modal - Soft Ask (Double Opt-in) */}
        {showPermissionModal && (
          <>
            <style>{`
              @keyframes gb_fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes gb_slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes gb_pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            `}</style>
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              animation: 'gb_fadeIn 0.3s ease'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px 28px',
                maxWidth: '360px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
                animation: 'gb_slideUp 0.4s ease'
              }}>
                <div style={{ fontSize: '56px', marginBottom: '12px', lineHeight: 1 }}>🎰</div>
                <h2 style={{ 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  color: '#1a1a1a',
                  marginBottom: '8px',
                  lineHeight: 1.3
                }}>Ative seus Bônus Exclusivos!</h2>
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  Receba notificações de bônus diários e giros grátis direto no seu celular
                </p>
                
                <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                  {[
                    { emoji: '🎁', text: 'Bônus diários na hora certa' },
                    { emoji: '💰', text: 'Alertas de promoções relâmpago' },
                    { emoji: '🔥', text: 'Seja o primeiro a saber das novidades' }
                  ].map((item, i) => (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '8px 0',
                      fontSize: '15px', color: '#333'
                    }}>
                      <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAcceptPush}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    background: 'linear-gradient(135deg, #01875f 0%, #00c853 100%)',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    boxShadow: '0 4px 16px rgba(1, 135, 95, 0.4)',
                    animation: 'gb_pulse 2s ease-in-out infinite'
                  }}
                >
                  🎁 Ativar Bônus Exclusivos
                </button>
                
                <button
                  onClick={handleDeclinePush}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#aaa',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  Agora não
                </button>
              </div>
            </div>
          </>
        )}

        {/* Screenshots Container */}
        <div style={{ margin: '0 -24px 32px -24px', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory' }}>
            {[
              { src: '/images/android-screen-1.png', alt: 'Login' },
              { src: '/images/screen-1.png', alt: 'Super Win' },
              { src: '/images/screen-2.png', alt: 'Daily Bonus' }
            ].map((img, idx) => (
              <div key={idx} style={{ 
                minWidth: '220px', 
                height: '400px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '1px solid #f1f3f4',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                scrollSnapAlign: 'start'
              }}>
                <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* About this app */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#202124' }}>Sobre este app</h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
            O app oficial da Ganhou Bet chegou! Tenha acesso ao Mascote da Sorte na palma da sua mão. 
            Depósitos instantâneos via PIX, saques rápidos e os slots mais populares do momento com bônus exclusivos.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
             {['Cassino', 'Apostas', 'Casual'].map(tag => (
               <span key={tag} style={{ padding: '6px 12px', border: '1px solid #dadce0', borderRadius: '16px', fontSize: '12px', color: '#5f6368' }}>{tag}</span>
             ))}
          </div>
        </div>

        {/* Ratings and Reviews */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#202124' }}>Notas e avaliações</h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '400', color: '#202124' }}>4.9</div>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                   {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#01875f', fontSize: '10px' }}>★</span>)}
                </div>
                <div style={{ fontSize: '11px', color: '#5f6368' }}>48.742</div>
             </div>
             <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', width: '8px' }}>{n}</span>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: n === 5 ? '92%' : (n === 4 ? '5%' : '1%'), height: '100%', backgroundColor: '#01875f', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Testimonials */}
          {[
            { name: 'Ricardo Silva', comment: 'Finalmente o app oficial! O saque via PIX é instantâneo mesmo, já forrei R$ 300 hoje.', date: '12 de abr. de 2024' },
            { name: 'Bia Oliveira', comment: 'Mascote ta pagando muito! Interface muito limpa e não trava igual o site.', date: '10 de abr. de 2024' },
            { name: 'Marcos Panda', comment: 'Melhor casino do Brasil, suporte nota 10 e o app ficou show.', date: '08 de abr. de 2024' }
          ].map((rev, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#5f6368' }}>{rev.name[0]}</div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{rev.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                   {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#01875f', fontSize: '8px' }}>★</span>)}
                </div>
                <span style={{ fontSize: '11px', color: '#5f6368' }}>{rev.date}</span>
              </div>
              <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: '1.4' }}>{rev.comment}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
