'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState({
    affiliateLink: '',
    gtmId: '',
    appName: '',
    pushMessages: [],
    twrParams: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Handle Login (Simple demo password)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Senha padrão solicitada: admin123 (mudar conforme necessário)
      setIsLogged(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  useEffect(() => {
    if (isLogged) {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => setConfig(data));
    }
  }, [isLogged]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Salvando...');
    
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (res.ok) {
        setStatus('✅ Salvo com sucesso!');
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (err) {
      setStatus('❌ Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const addPush = () => {
    setConfig({
      ...config,
      pushMessages: [...config.pushMessages, { id: Date.now(), time: '', text: '' }]
    });
  };

  const removePush = (id) => {
    setConfig({
      ...config,
      pushMessages: config.pushMessages.filter(p => p.id !== id)
    });
  };

  if (!isLogged) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form className="premium-card animate-fade-in" style={{ width: '350px' }} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>🔒 Acesso Restrito</h2>
          <input 
            type="password" 
            className="input-field" 
            placeholder="Digite a senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Entrar no Painel</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem' }}>GanhouBet Creator</h1>
          <p style={{ color: 'var(--gray)' }}>Configuração de Campanha e PWA</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/safe" target="_blank" className="btn-outline">Ver Safe Page</a>
          <a href="/store/ios" target="_blank" className="btn-outline">Link iOS</a>
          <a href="/store/android" target="_blank" className="btn-outline">Link Android</a>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Core Config */}
        <div className="premium-card">
          <h3 style={{ marginBottom: '20px' }}>Configurações Gerais</h3>
          <label>Nome do App (PWA)</label>
          <input 
            className="input-field" 
            value={config.appName}
            onChange={e => setConfig({...config, appName: e.target.value})}
          />
          
          <label>Link de Afiliado Principal</label>
          <input 
            className="input-field" 
            value={config.affiliateLink}
            onChange={e => setConfig({...config, affiliateLink: e.target.value})}
          />

          <label>Google Tag Manager ID</label>
          <input 
            className="input-field" 
            value={config.gtmId}
            onChange={e => setConfig({...config, gtmId: e.target.value})}
          />
        </div>

        {/* Cloaking TWR Section */}
        <div className="premium-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>🐰 Configuração de Cloaking (TWR)</h3>
          <p style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '15px' }}>
            Domínio: <strong>play.ganhoubet.xyz</strong> <br/>
            Apontar CNAME para: <code>connect.domains-twr.com</code>
          </p>
          
          <label>Parâmetros do Anúncio (Copy/Paste do TWR)</label>
          <textarea 
            className="input-field" 
            placeholder="Ex: cwr=123&cname=campanha1"
            style={{ minHeight: '80px' }}
            value={config.twrParams || ''}
            onChange={e => setConfig({...config, twrParams: e.target.value})}
          />
          <div style={{ fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', color: 'var(--primary)' }}>
            <strong>Dica:</strong> A Safe Page está em <code>/safe</code> e a Oferta está na Raiz <code>/</code>. Configure isso no painel do TWR.
          </div>
        </div>

        {/* Push Notification Config */}

        <div className="premium-card">
          <h3 style={{ marginBottom: '20px' }}>Remarketing (Push Notifications)</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
            {config.pushMessages.map((push, idx) => (
              <div key={push.id} style={{ position: 'relative', background: '#1c252e', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                   <input 
                    placeholder="Tempo (ex: 2h)" 
                    style={{ width: '80px', background: '#0a0e12', border: 'none', color: 'white', padding: '5px' }}
                    value={push.time}
                    onChange={e => {
                      const newPush = [...config.pushMessages];
                      newPush[idx].time = e.target.value;
                      setConfig({...config, pushMessages: newPush});
                    }}
                   />
                   <button onClick={() => removePush(push.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>Remover</button>
                </div>
                <textarea 
                  placeholder="Texto da notificação..." 
                  style={{ width: '100%', background: '#0a0e12', border: 'none', color: 'white', padding: '8px', minHeight: '60px' }}
                  value={push.text}
                  onChange={e => {
                    const newPush = [...config.pushMessages];
                    newPush[idx].text = e.target.value;
                    setConfig({...config, pushMessages: newPush});
                  }}
                />
              </div>
            ))}
          </div>
          <button onClick={addPush} className="btn-outline" style={{ width: '100%', marginBottom: '10px' }}>+ Adicionar Notificação</button>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        {config.twrParams && (
          <div style={{ fontSize: '11px', color: 'var(--primary)', background: 'rgba(0,255,136,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid var(--primary)' }}>
            <strong>URL do Anúncio:</strong> https://play.ganhoubet.xyz/?{config.twrParams}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: config.gtmId ? 'var(--primary)' : 'var(--gray)' }}>{status}</span>
          <button onClick={handleSave} className="btn-primary" style={{ minWidth: '200px' }} disabled={loading}>
            {loading ? 'Processando...' : 'Salvar Campanha'}
          </button>
        </div>
      </div>
    </div>
  );
}
