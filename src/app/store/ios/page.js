'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IosStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInstall = () => {
    setIsInstalling(true);
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'pwa_install_click',
        platform: 'ios'
      });
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        window.location.href = '/'; 
      }
    }, 100);
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
            cursor: 'pointer'
          }}
        >
          {isInstalling ? `${progress}%` : 'OBTER'}
        </button>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 0' }}>
        {/* Main Header */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            width: '110px', 
            height: '110px', 
            minWidth: '110px',
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid #f2f2f7',
            backgroundColor: '#fff'
          }}>
            <img src="/images/app-icon.png" alt="GanhouBet Icon" style={{ width: '110px', height: '110px', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: 1.2, margin: 0, color: '#1c1c1e' }}>GanhouBet: Mascot Slots Casino</h1>
            <p style={{ color: '#8e8e93', fontSize: '15px', fontWeight: '500', margin: '4px 0 0' }}>Win Real Cash & Jackpots</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <button 
                onClick={handleInstall}
                style={{
                  backgroundColor: '#007aff',
                  color: '#ffffff',
                  padding: '6px 24px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer'
                }}
               >
                {isInstalling ? 'BAIXANDO...' : 'OBTER'}
               </button>
               <span style={{ fontSize: '10px', color: '#8e8e93', fontWeight: '600', textAlign: 'center', marginRight: '8px' }}>Compras <br/> no App</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '16px 0', 
          borderTop: '1px solid #f2f2f7', 
          borderBottom: '1px solid #f2f2f7', 
          marginBottom: '24px',
          overflowX: 'auto',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{ fontSize: '9px', color: '#8e8e93', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>64K AVALIAÇÕES</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#48484a', marginTop: '4px' }}>4.9</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderLeft: '1px solid #f2f2f7', borderRight: '1px solid #f2f2f7' }}>
            <span style={{ fontSize: '9px', color: '#8e8e93', fontWeight: 'bold', textTransform: 'uppercase' }}>RANKING</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#48484a', marginTop: '4px' }}>#1</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{ fontSize: '9px', color: '#8e8e93', fontWeight: 'bold', textTransform: 'uppercase' }}>IDADE</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#48484a', marginTop: '4px' }}>18+</span>
          </div>
        </div>

        {/* Screenshots Carrossel */}
        <div style={{ marginBottom: '32px' }}>
           <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1c1c1e' }}>Pré-visualização</h2>
           <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
              <div style={{ 
                minWidth: '240px', 
                height: '480px', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #f2f2f7' 
              }}>
                <img src="/images/screen-1.png" alt="Preview 1" style={{ width: '240px', height: '480px', objectFit: 'cover' }} />
              </div>
              <div style={{ 
                minWidth: '240px', 
                height: '480px', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #f2f2f7' 
              }}>
                <img src="/images/screen-2.png" alt="Preview 2" style={{ width: '240px', height: '480px', objectFit: 'cover' }} />
              </div>
           </div>
        </div>

        {/* Text Sections */}
        <div style={{ padding: '20px 0', borderTop: '1px solid #f2f2f7' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px', color: '#1c1c1e' }}>Novidades</h2>
          <p style={{ fontSize: '14px', color: '#8e8e93', margin: '0 0 12px' }}>Versão 1.0.18 • há 5 dias</p>
          <p style={{ fontSize: '15px', lineHeight: 1.5, color: '#1c1c1e' }}>
            Otimizações no Fortune Tiger e suporte a pagamentos PIX instantâneos.
          </p>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.5, fontSize: '12px', color: '#8e8e93' }}>
           <p>Copyright © 2026 GanhouBet Studio</p>
        </div>
      </div>

      <style jsx global>{`
        body { background-color: white !important; color: #1c1c1e !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
