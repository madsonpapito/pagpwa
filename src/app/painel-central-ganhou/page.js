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
    funnel: [],
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
  const [origin, setOrigin] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLogged(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  useEffect(() => {
    setOrigin(window.location.origin);
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

  const addFunnelStep = () => {
    const newStep = { id: Date.now(), title: '', body: '', delay: 2 };
    setConfig({ ...config, funnel: [...config.funnel, newStep] });
  };

  const removeFunnelStep = (id) => {
    setConfig({ ...config, funnel: config.funnel.filter(s => s.id !== id) });
  };

  const updateFunnelStep = (id, field, value) => {
    setConfig({
      ...config,
      funnel: config.funnel.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const finalUrl = `${origin}/${config.twrSlug}${config.twrParams ? (config.twrParams.startsWith('?') ? '' : '?') + config.twrParams : ''}`;

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
                <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: 0 }}>Central de Comando <span style={{ color: '#00ff88' }}>GanhouBet Pro</span></h1>
                <p style={{ color: '#71717a', marginTop: '5px' }}>Otimização de tráfego e funis de retenção automática.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '20px' }}>{subCount}</div>
                <div style={{ color: '#71717a', fontSize: '12px', textTransform: 'uppercase' }}>Assinantes no Banco</div>
            </div>
        </header>

        {dbError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px 20px', borderRadius: '16px', color: '#f87171', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🚫</span> {dbError}
            </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
            
            {/* Coluna 1: Marketing & TWR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ background: '#18181b', padding: '25px', borderRadius: '24px', border: '1px solid #27272a' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>📈 Tracking & CPA</h3>
                    <InputGroup label="Link de Afiliado" value={config.affiliateLink} onChange={v => setConfig({...config, affiliateLink: v})} placeholder="Sua URL de cadastro" />
                    <InputGroup label="Facebook Pixel" value={config.pixelId} onChange={v => setConfig({...config, pixelId: v})} placeholder="ID do Pixel" />
                    <InputGroup label="GTM Container" value={config.gtmId} onChange={v => setConfig({...config, gtmId: v})} placeholder="GTM-XXXX" />
                </div>
                <div style={{ background: '#18181b', padding: '25px', borderRadius: '24px', border: '1px solid #27272a' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>🐇 Cloaking (The White Rabbit)</h3>
                    <InputGroup label="Slug Principal" value={config.twrSlug} onChange={v => setConfig({...config, twrSlug: v})} placeholder="Ex: pwa-home" />
                    <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>UTM PARAMS</label>
                    <textarea 
                        value={config.twrParams}
                        onChange={e => setConfig({...config, twrParams: e.target.value})}
                        style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', minHeight: '80px' }}
                    />
                </div>
            </div>

            {/* Coluna 2: Funil Automático */}
            <div style={{ background: '#18181b', padding: '25px', borderRadius: '24px', border: '1px solid #27272a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>🚀 Funil de Notificações</h3>
                    <button onClick={addFunnelStep} style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Etapa</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                    {config.funnel.map((step, index) => (
                        <div key={step.id} style={{ background: '#09090b', padding: '15px', borderRadius: '16px', border: '1px solid #27272a' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>#{index + 1} - Gatilho: {step.delay}h</span>
                                <button onClick={() => removeFunnelStep(step.id)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Remover</button>
                            </div>
                            <input 
                                style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', borderBottom: '1px solid #27272a', color: '#fff', marginBottom: '8px', outline: 'none' }} 
                                placeholder="Título" 
                                value={step.title} 
                                onChange={e => updateFunnelStep(step.id, 'title', e.target.value)}
                            />
                            <textarea 
                                style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', color: '#71717a', fontSize: '13px', outline: 'none', minHeight: '60px' }} 
                                placeholder="Corpo da mensagem" 
                                value={step.body} 
                                onChange={e => updateFunnelStep(step.id, 'body', e.target.value)}
                            />
                            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#71717a' }}>Enviar após (horas):</span>
                                <input 
                                    type="number" 
                                    style={{ width: '60px', padding: '4px', background: '#1c1c1e', border: '1px solid #333', color: '#00ff88', borderRadius: '5px', textAlign: 'center' }} 
                                    value={step.delay} 
                                    onChange={e => updateFunnelStep(step.id, 'delay', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coluna 3: Disparo Manual */}
            <div style={{ background: '#18181b', padding: '25px', borderRadius: '24px', border: '1px solid #27272a' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>🔔 Broadcast Instantâneo</h3>
                <InputGroup label="Título do Push" value={pushForm.title} onChange={v => setPushForm({...pushForm, title: v})} placeholder="Ex: 🎁 Bônus Exclusivo!" />
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>MENSAGEM REAL-TIME</label>
                <textarea 
                    value={pushForm.body}
                    onChange={e => setPushForm({...pushForm, body: e.target.value})}
                    placeholder="Sua oferta matadora aqui..."
                    style={{ width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', minHeight: '100px', marginBottom: '15px' }}
                />
                <button 
                    onClick={handleBroadcast}
                    disabled={loading || subCount === 0 || dbError}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', background: (subCount > 0 && !dbError) ? '#00ff88' : '#27272a', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                    {loading ? 'Disparando...' : '🚀 Enviar Manual Agora'}
                </button>
                <div style={{ fontSize: '13px', color: '#00ff88', marginTop: '10px', minHeight: '20px' }}>{pushStatus}</div>
            </div>

        </div>

        <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0, 255, 136, 0.05)', padding: '30px', borderRadius: '24px', border: '1px dashed #00ff88' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#00ff88', textTransform: 'uppercase', marginBottom: '15px' }}>🔗 Link de Campanha Gerado</h2>
            <div style={{ width: '100%', background: '#09090b', padding: '15px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ color: '#00ff88', fontSize: '14px', wordBreak: 'break-all' }}>{finalUrl}</code>
                <button 
                    onClick={() => { navigator.clipboard.writeText(finalUrl); setStatus('📋 Link Copiado!'); setTimeout(() => setStatus(''), 2000); }}
                    style={{ background: '#00ff88', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '15px' }}
                >
                    Copiar Link
                </button>
            </div>
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#71717a' }}>Use esta URL nas suas campanhas de Facebook/Google Ads com o Cloaking ativo.</p>
        </div>

        <footer style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#00ff88', fontSize: '14px' }}>{status}</span>
            <button 
                onClick={handleSave} 
                style={{ padding: '15px 40px', borderRadius: '14px', background: '#fff', color: '#000', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 20px -5px rgba(255,255,255,0.2)' }}
            >
                Salvar Toda Configuração
            </button>
        </footer>

      </div>
    </div>
  );
}
