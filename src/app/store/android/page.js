'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AndroidStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInstall = () => {
    setIsInstalling(true);
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'pwa_install_click',
        platform: 'android'
      });
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        window.location.href = '/'; 
      }
    }, 50);
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
        <div style={{ display: 'flex', gap: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
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

        {/* Stats Summary Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '32px', 
          overflowX: 'auto', 
          gap: '24px',
          padding: '8px 0'
        }} className="no-scrollbar">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: '1px solid #e8eaed' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>4.8 ★</span>
            <span style={{ fontSize: '12px', color: '#5f6368' }}>64K reviews</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: '1px solid #e8eaed' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>92 MB</span>
            <span style={{ fontSize: '12px', color: '#5f6368' }}>Tamanho</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>18+</span>
            <span style={{ fontSize: '12px', color: '#5f6368' }}>Classificação</span>
          </div>
        </div>

        {/* Install Button */}
        <button 
          onClick={handleInstall}
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
          {isInstalling ? `${progress}% Concluído...` : 'Instalar'}
        </button>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto' }} className="no-scrollbar">
          {['Cassino', 'Casual', 'Simulação'].map(tag => (
            <span key={tag} style={{ px: '12px', py: '6px', border: '1px solid #dadce0', borderRadius: '16px', fontSize: '14px', color: '#5f6368', padding: '6px 16px', whiteSpace: 'nowrap' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Screenshots Carrossel */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '16px', color: '#202124' }}>Sobre este jogo</h2>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
            <div style={{ 
              minWidth: '190px', 
              height: '340px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              border: '1px solid #f1f3f4' 
            }}>
              <img src="/images/android-screen-1.png" alt="Preview" style={{ width: '190px', height: '340px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div style={{ padding: '24px 0', borderTop: '1px solid #e8eaed' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '16px', color: '#202124' }}>Segurança de dados</h2>
          <div style={{ padding: '16px', border: '1px solid #dadce0', borderRadius: '8px', display: 'flex', gap: '16px' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             <p style={{ fontSize: '14px', color: '#5f6368', margin: 0 }}>Este PWA não compartilha dados com terceiros e utiliza proteção SSL de ponta.</p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        body { background-color: white !important; color: #202124 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
