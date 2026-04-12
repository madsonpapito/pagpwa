'use client';

import { useState, useEffect } from 'react';

export default function IosStore() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data));
  }, []);

  if (!config) return <div style={{ color: 'white', padding: '20px' }}>Carregando...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* iOS Top Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: '14px', color: '#007aff', fontWeight: '500' }}>
        <span>Search</span>
        <span style={{ color: '#fff' }}>12:00</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </nav>

      {/* Main App Info */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }} className="animate-fade-in">
        <div style={{ position: 'relative' }}>
          <img 
            src="/assets/touro.png" 
            alt="App Icon" 
            style={{ width: '120px', height: '120px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)' }} 
          />
          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--gold)', color: '#000', padding: '4px 8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '10px' }}>
            25% CASHBACK
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>{config.appName}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '15px' }}>Official Mascot Squad</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '6px 24px', borderRadius: '20px', backgroundColor: '#007aff', color: '#fff', fontSize: '15px', fontWeight: 'bold' }}
              onClick={() => {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: 'pwa_install_click' });
                window.alert('Para instalar: Clique no ícone de compartilhar (setinha) e selecione "Adicionar à Tela de Início"');
              }}
            >
              GET
            </button>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>R$1.000.000 em Prêmios</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '15px 0', margin: '30px 0' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>RATING</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>5.0 ★</p>
        </div>
        <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>CASHBACK</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>25%</p>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>CHART</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>#1</p>
        </div>
      </div>

      {/* Screenshots / Mascot Squad */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Conheça o Esquadrão</h2>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {[
            { name: 'Cowboy Pig', img: '/assets/pig.png', color: '#ffcc00' },
            { name: 'Strong Tiger', img: '/assets/tiger.png', color: '#ff4444' },
            { name: 'Boss Bull', img: '/assets/touro.png', color: '#00ff88' }
          ].map((m, i) => (
            <div key={i} style={{ minWidth: '220px', height: '400px', background: `linear-gradient(180deg, #1c1c1e 0%, ${m.color}22 100%)`, borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', textAlign: 'center' }}>
               <img src={m.img} style={{ width: '150px', marginBottom: '20px' }} />
               <h3 style={{ fontSize: '18px' }}>{m.name}</h3>
               <p style={{ fontSize: '12px', opacity: 0.6 }}>O seu guia para a vitória.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>O que há de novo</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#e5e5e5' }}>
          Versão 2.0: Lançamento do **Mascot Squad**! <br/>
          - 25% de Cashback Diário ativado. <br/>
          - Novo sistema de suporte via Typebot. <br/>
          - Mais de R$1.000.000 em prêmios mensais.
        </p>
      </section>


      {/* Footer Disclaimer */}
      <footer style={{ marginTop: '50px', paddingBottom: '100px', opacity: 0.5, fontSize: '12px' }}>
        <p>© 2026 {config.appName} International.</p>
        <p>Desenvolvido para máxima performance mobile.</p>
      </footer>
    </div>
  );
}
