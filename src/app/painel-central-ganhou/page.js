'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState({
    affiliateLink: '',
    gtmId: '',
    appName: 'GanhouBet',
    pushMessages: [],
    twrParams: '',
    twrSlug: '',
    pixelId: ''
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
        .then(data => setConfig(prev => ({ ...prev, ...data })));
        
      const fetchSubs = async () => {
        try {
            const res = await fetch('/api/push/send', { method: 'GET' });
            const data = await res.json();
            if (data.error === 'DB_NOT_CONFIGURED') {
                setDbError('⚠️ Redis não conectado.');
            } else {
                setDbError(null);
                setSubCount(data.count || 0);
            }
        } catch (e) {
            setDbError('❌ Falha na API.');
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
        setStatus('✅ Configurações Salvas!');
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
        setPushStatus('⚠️ Sem assinantes.');
        return;
    }
    setLoading(true);
    setPushStatus('Disparando...');
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
        setPushStatus(`✅ Sucesso! Enviado para ${data.sentCount} dispositivos.`);
        setTimeout(() => setPushStatus(''), 5000);
      }
    } catch (err) {
      setPushStatus('❌ Erro no envio.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#09090b', fontFamily: 'Inter, sans-serif' }}>
          <form style={{ width: '380px', background: '#18181b', padding: '40px', borderRadius: '24px', border: '1px solid #27272a', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onSubmit={handleLogin}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '800' }}>Admin GanhouBet</h2>
                <p style={{ color: '#71717a', fontSize: '14px' }}>Acesso restrito ao operador</p>
            </div>
            <input 
              type="password" 
              placeholder="Senha de Acesso" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', background: '#09090b', border: '1px solid #3f3f46', color: '#fff', outline: 'none' }}
            />
            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Entrar no Painel</button>
          </form>
        </div>
      );
  }

  const InputGroup = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
        <input 
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'border 0.2s' }}
        />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
                <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: 0 }}>Central de Comando <span style={{ color: '#00ff88' }}>GanhouBet</span></h1>
                <p style={{ color: '#71717a', marginTop: '5px' }}>Gerencie tráfego, cloaking e notificações inteligentes.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '20px' }}>{subCount}</div>
                <div style={{ color: '#71717a', fontSize: '12px', textTransform: 'uppercase' }}>Assinantes Ativos</div>
            </div>
        </header>

        {dbError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px 20px', borderRadius: '16px', color: '#f87171', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🚫</span> {dbError}
            </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {/* Coluna 1: Marketing & Tracking */}
            <div style={{ background: '#18181b', padding: '30px', borderRadius: '24px', border: '1px solid #27272a' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>📈 Marketing & Tracking</h3>
                <InputGroup label="Link de Afiliado (CPA)" value={config.affiliateLink} onChange={v => setConfig({...config, affiliateLink: v})} placeholder="https://ganhou.bet/..." />
                <InputGroup label="Google Tag Manager (GTM)" value={config.gtmId} onChange={v => setConfig({...config, gtmId: v})} placeholder="GTM-XXXXXXX" />
                <InputGroup label="Facebook Pixel ID" value={config.pixelId} onChange={v => setConfig({...config, pixelId: v})} placeholder="Somente os números" />
                <InputGroup label="Identificador do App" value={config.appName} onChange={v => setConfig({...config, appName: v})} placeholder="Ex: GanhouBet App" />
            </div>

            {/* Coluna 2: Cloaking (The White Rabbit) */}
            <div style={{ background: '#18181b', padding: '30px', borderRadius: '24px', border: '1px solid #27272a' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>🐇 Cloaking (TWR)</h3>
                <InputGroup label="Slug do TWR" value={config.twrSlug} onChange={v => setConfig({...config, twrSlug: v})} placeholder="Ex: ganhou-home" />
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>PARÂMETROS UTM (OPCIONAL)</label>
                <textarea 
                    value={config.twrParams}
                    onChange={e => setConfig({...config, twrParams: e.target.value})}
                    placeholder="utm_source=google&utm_campaign=..."
                    style={{ width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', minHeight: '120px' }}
                />
            </div>

            {/* Coluna 3: Push Real-Time */}
            <div style={{ background: '#18181b', padding: '30px', borderRadius: '24px', border: '1px solid #27272a', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#00ff88' }}></div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>🔔 Push Broadcast</h3>
                <InputGroup label="Título da Mensagem" value={pushForm.title} onChange={v => setPushForm({...pushForm, title: v})} placeholder="Ex: 🎰 Bônus Exclusivo!" />
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>MENSAGEM</label>
                <textarea 
                    value={pushForm.body}
                    onChange={e => setPushForm({...pushForm, body: e.target.value})}
                    placeholder="Sua oferta matadora aqui..."
                    style={{ width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', minHeight: '100px', marginBottom: '15px' }}
                />
                
                <div style={{ fontSize: '13px', color: '#00ff88', minHeight: '20px', marginBottom: '10px' }}>{pushStatus}</div>

                <button 
                    onClick={handleBroadcast}
                    disabled={loading || subCount === 0 || dbError}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', background: (subCount > 0 && !dbError) ? '#00ff88' : '#27272a', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Processando...' : (subCount === 0 ? 'Aguardando Assinantes' : '🚀 Disparar para Todos Agora')}
                </button>
            </div>

        </div>

        <footer style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#00ff88', fontSize: '14px', fontWeight: 'bold' }}>{status}</span>
            <button 
                onClick={handleSave} 
                className="btn-primary" 
                style={{ padding: '15px 40px', borderRadius: '14px', background: '#fff', color: '#000', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 20px -5px rgba(255,255,255,0.2)' }}
            >
                Salvar Configurações
            </button>
        </footer>

      </div>
    </div>
  );
}
