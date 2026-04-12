'use client';

import { useState, useEffect } from 'react';

export default function AndroidStore() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data));
  }, []);

  if (!config) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#000', padding: '16px', fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Android Top Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '24px' }}>←</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>🔍</span>
          <span>⋮</span>
        </div>
      </nav>

      {/* App Header */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }} className="animate-fade-in">
        <div style={{ position: 'relative' }}>
          <img 
            src="/assets/touro.png" 
            alt="App Icon" 
            style={{ width: '72px', height: '72px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
          />
          <div style={{ position: 'absolute', top: '-5px', left: '-5px', background: '#01875f', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
            25% OFF
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '4px', color: '#202124' }}>{config.appName}</h1>
          <p style={{ color: '#01875f', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Mascot Squad Official</p>
          <p style={{ color: '#5f6368', fontSize: '12px' }}>Contains ads · 25% Cashback</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '30px', marginBottom: '24px', paddingBottom: '8px' }}>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <p style={{ fontWeight: '500' }}>5.0 ★</p>
          <p style={{ fontSize: '12px', color: '#5f6368' }}>25K reviews</p>
        </div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #e8eaed', paddingLeft: '20px' }}>
          <p style={{ fontWeight: '500' }}>1M+</p>
          <p style={{ fontSize: '12px', color: '#5f6368' }}>Downloads</p>
        </div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #e8eaed', paddingLeft: '20px' }}>
          <p style={{ fontWeight: '500', color: '#01875f' }}>25%</p>
          <p style={{ fontSize: '12px', color: '#5f6368' }}>Cashback</p>
        </div>
      </div>

      {/* Install Button */}
      <button 
        style={{ width: '100%', backgroundColor: '#01875f', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginBottom: '32px', cursor: 'pointer' }}
        onClick={() => {
           window.dataLayer = window.dataLayer || [];
           window.dataLayer.push({ event: 'pwa_install_click' });
           window.alert('Clique nos 3 pontos do navegador e selecione "Instalar Aplicativo"');
        }}
      >
        Install
      </button>

      {/* Screenshot Section / Mascot Squad */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '32px' }}>
        {[
          { name: 'Boss Bull', img: '/assets/touro.png' },
          { name: 'Cowboy Pig', img: '/assets/pig.png' },
          { name: 'Strong Tiger', img: '/assets/tiger.png' }
        ].map((m, i) => (
          <div key={i} style={{ minWidth: '150px', height: '270px', backgroundColor: '#f1f3f4', borderRadius: '8px', border: '1px solid #e8eaed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center' }}>
            <img src={m.img} style={{ width: '80px', marginBottom: '10px' }} />
            <p style={{ fontSize: '12px', fontWeight: 'bold' }}>{m.name}</p>
          </div>
        ))}
      </div>


      {/* About Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500' }}>About this app</h2>
        <span style={{ color: '#01875f' }}>→</span>
      </div>
      <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.4', marginBottom: '32px' }}>
        O melhor app de iGaming chegou! Jogue slots, roleta e cassino ao vivo com a melhor experiência mobile do mercado. 
        Aproveite promoções diárias e saques rápidos via PIX.
      </p>

      {/* Ratings & Reviews */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500' }}>Ratings and reviews</h2>
        <span style={{ color: '#01875f' }}>→</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', fontWeight: '400' }}>4.8</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '12px' }}>
            <span style={{ fontSize: '10px' }}>5</span>
            <div style={{ flex: 1, backgroundColor: '#e8eaed', height: '8px', borderRadius: '4px' }}><div style={{ width: '85%', backgroundColor: '#01875f', height: '100%', borderRadius: '4px' }}></div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '12px' }}>
            <span style={{ fontSize: '10px' }}>4</span>
            <div style={{ flex: 1, backgroundColor: '#e8eaed', height: '8px', borderRadius: '4px' }}><div style={{ width: '10%', backgroundColor: '#01875f', height: '100%', borderRadius: '4px' }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
