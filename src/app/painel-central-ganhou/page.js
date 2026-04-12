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
    twrParams: '',
    twrSlug: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [pushForm, setPushForm] = useState({ title: '', body: '' });
  const [pushStatus, setPushStatus] = useState('');
  const [subCount, setSubCount] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
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

  useEffect(() => {
    if (isLogged) {
        const fetchSubs = async () => {
            try {
                const res = await fetch('/api/push/send', { method: 'GET' });
                const data = await res.json();
                setSubCount(data.count || 0);
            } catch (e) {
                console.error('Fetch count failed');
            }
        };
        fetchSubs();
        const interval = setInterval(fetchSubs, 10000); // Poll every 10s
        return () => clearInterval(interval);
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

  const handleBroadcast = async () => {
    if (subCount === 0) {
        setPushStatus('⚠️ Nenhum assinante para enviar.');
        return;
    }

    setLoading(true);
    setPushStatus('Enviando...');
    
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pushForm.title || config.appName,
          body: pushForm.body,
          url: config.affiliateLink
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (data.sentCount > 0) {
            setPushStatus(`✅ Enviado para ${data.sentCount} dispositivos!`);
        } else {
            setPushStatus(`ℹ️ ${data.message || 'Sem disparos realizados.'}`);
        }
        setTimeout(() => setPushStatus(''), 5000);
      } else {
        setPushStatus(`❌ Erro: ${data.error || 'Falha no envio'}`);
      }
    } catch (err) {
      setPushStatus('❌ Erro crítico no disparo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form className="premium-card animate-fade-in" style={{ width: '350px' }} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>🔒 Painel GanhouBet</h2>
          <input 
            type="password" 
            className="input-field" 
            placeholder="Digite a senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Acessar Configurações</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* ... (Previous Styles Apply - skipping redundant visual code components for brevity in this block but keeping structure) */}
      <h1 style={{ color: 'var(--primary)', marginBottom: '30px' }}>Dashboard de Operações</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="premium-card">
              <h3>Configuração Geral</h3>
              <label>Nome do App</label>
              <input className="input-field" value={config.appName} onChange={e => setConfig({...config, appName: e.target.value})} />
              <label>Link Afiliado</label>
              <input className="input-field" value={config.affiliateLink} onChange={e => setConfig({...config, affiliateLink: e.target.value})} />
          </div>

          <div className="premium-card">
              <h3>Broadcast Instantâneo</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ background: 'rgba(0,255,136,0.1)', padding: '5px 15px', borderRadius: '20px', color: 'var(--primary)' }}>
                      <strong>{subCount}</strong> Assinantes Reais
                  </div>
              </div>
              <input className="input-field" placeholder="Título" value={pushForm.title} onChange={e => setPushForm({...pushForm, title: e.target.value})} />
              <textarea className="input-field" placeholder="Mensagem do Push" value={pushForm.body} onChange={e => setPushForm({...pushForm, body: e.target.value})} style={{ minHeight: '80px' }} />
              
              <div style={{ marginTop: '10px', minHeight: '20px', fontSize: '13px' }}>{pushStatus}</div>
              
              <button 
                onClick={handleBroadcast} 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '10px' }} 
                disabled={loading || subCount === 0}
              >
                {loading ? 'Enviando...' : (subCount === 0 ? 'Aguardando Assinantes' : '🚀 Disparar para Todos')}
              </button>
          </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <span>{status}</span>
          <button onClick={handleSave} className="btn-primary" style={{ marginLeft: '10px' }}>Salvar Tudo</button>
      </div>
    </div>
  );
}
