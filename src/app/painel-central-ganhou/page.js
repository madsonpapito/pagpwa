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
  const [dbError, setDbError] = useState(null);

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
                if (data.error === 'DB_NOT_CONFIGURED') {
                    setDbError('⚠️ Banco de Dados (Redis) não conectado. Clique em "Connect Project" na Vercel.');
                } else {
                    setDbError(null);
                    setSubCount(data.count || 0);
                }
            } catch (e) {
                setDbError('❌ Falha na conexão com API.');
            }
        };
        fetchSubs();
        const interval = setInterval(fetchSubs, 10000);
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
        setPushStatus('⚠️ Nenhum assinante.');
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
        setPushStatus(`✅ Enviado para ${data.sentCount} dispositivos!`);
        setTimeout(() => setPushStatus(''), 5000);
      } else {
        setPushStatus(`❌ Erro: ${data.error || 'Falha no envio'}`);
      }
    } catch (err) {
      setPushStatus('❌ Erro crítico.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0a0e12' }}>
        <form className="premium-card animate-fade-in" style={{ width: '350px', background: '#1c252e', padding: '30px', borderRadius: '20px' }} onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#fff' }}>🔒 Operações GanhouBet</h2>
          <input 
            type="password" 
            className="input-field" 
            placeholder="Digite a senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', background: '#0a0e12', border: '1px solid #333', color: '#fff' }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Acessar Painel</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#00ff88' }}>Configuração PWA & Marketing</h1>
        {dbError && <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid #ff4444', padding: '10px', borderRadius: '10px', color: '#ff4444', marginTop: '10px', fontSize: '14px' }}>{dbError}</div>}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="premium-card" style={{ background: '#1c252e', padding: '24px', borderRadius: '20px' }}>
              <h3 style={{ marginBottom: '20px' }}>Geral</h3>
              <label style={{ display: 'block', marginBottom: '8px' }}>Nome do App</label>
              <input style={{ width: '100%', padding: '10px', background: '#0a0e12', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} value={config.appName} onChange={e => setConfig({...config, appName: e.target.value})} />
              <label style={{ display: 'block', marginBottom: '8px' }}>Link de Afiliado</label>
              <input style={{ width: '100%', padding: '10px', background: '#0a0e12', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} value={config.affiliateLink} onChange={e => setConfig({...config, affiliateLink: e.target.value})} />
          </div>

          <div className="premium-card" style={{ background: '#1c252e', padding: '24px', borderRadius: '20px', border: dbError ? '1px solid #ff4444' : '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>Push Broadcast</h3>
                  <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{subCount} Ativos</span>
              </div>
              <input style={{ width: '100%', padding: '10px', background: '#0a0e12', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '15px' }} placeholder="Título" value={pushForm.title} onChange={e => setPushForm({...pushForm, title: e.target.value})} />
              <textarea style={{ width: '100%', padding: '10px', background: '#0a0e12', border: '1px solid #333', color: '#fff', borderRadius: '8px', minHeight: '80px' }} placeholder="Sua mensagem..." value={pushForm.body} onChange={e => setPushForm({...pushForm, body: e.target.value})} />
              
              <div style={{ margin: '10px 0', fontSize: '13px', color: '#00ff88' }}>{pushStatus}</div>
              
              <button 
                onClick={handleBroadcast} 
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: (loading || subCount === 0) ? '#333' : '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                disabled={loading || subCount === 0 || dbError}
              >
                {loading ? 'Disparando...' : (subCount === 0 ? 'Sem Assinantes' : '🚀 Enviar Agora')}
              </button>
          </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <span style={{ marginRight: '15px', color: '#00ff88' }}>{status}</span>
          <button onClick={handleSave} style={{ padding: '10px 30px', borderRadius: '10px', background: '#00ff88', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Configuração</button>
      </div>
    </div>
  );
}
