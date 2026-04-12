'use client';

import { useEffect } from 'react';

export default function SafePage() {
  useEffect(() => {
    // Typebot Embed Implementation
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3/dist/web.js';
    script.onload = () => {
      window.Typebot.initBubble({
        typebot: "ganhoubet",
        apiHost: "https://bot.dkwsystem.com",
        previewMessage: {
          text: "Como podemos ajudar hoje?",
          autoShowDelay: 3000,
        },
        theme: {
          button: { backgroundColor: "#007aff", customIconSrc: "/assets/touro.png" },
        },
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', color: '#111', fontFamily: 'Inter, sans-serif' }}>
      {/* Premium Header */}
      <header style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/touro.png" style={{ width: '40px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Mascot Legends Premium</span>
        </div>
        <nav style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '500' }}>
          <span>Galeria</span>
          <span>Personalização</span>
          <span>Sobre</span>
          <span style={{ color: '#007aff' }}>Contato</span>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 5%', textAlign: 'center', background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px', color: '#0a0e12' }}>Personagens que Ganham Vida</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto 40px' }}>
          Baixe wallpapers exclusivos em 4K do nosso esquadrão de elite. Arte digital de alta performance para o seu dispositivo móvel.
        </p>
        <button style={{ backgroundColor: '#007aff', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer' }}>
          Explorar Galeria
        </button>
      </section>

      {/* Mascot Gallery */}
      <section style={{ padding: '60px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { name: 'O Touro', img: '/assets/touro.png', desc: 'Símbolo de força e liderança.' },
            { name: 'O Tigre', img: '/assets/tiger.png', desc: 'Agilidade e precisão em cada detalhe.' },
            { name: 'O Porco Cowboy', img: '/assets/pig.png', desc: 'Aventura e estratégia no Velho Oeste Digital.' }
          ].map((m, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ height: '250px', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={m.img} style={{ height: '150px', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>{m.name}</h3>
                <p style={{ color: '#777', fontSize: '14px' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 5%', backgroundColor: '#0a0e12', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <h3>Mascot Legends</h3>
            <p style={{ opacity: 0.6, marginTop: '10px' }}>Arte digital para personalização de dispositivos móveis. Premium Assets 2026.</p>
          </div>
          <div>
            <h4>Links Úteis</h4>
            <ul style={{ listStyle: 'none', marginTop: '10px', opacity: 0.6 }}>
              <li>Termos de Uso</li>
              <li>Política de Privacidade</li>
              <li>Licenciamento</li>
            </ul>
          </div>
          <div>
            <h4>Suporte</h4>
            <p style={{ opacity: 0.6, marginTop: '10px' }}>Use o chat flutuante para falar com nossa equipe de design.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
