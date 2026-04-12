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

  // Fetch Subscriber Count
  useEffect(() => {
    if (isLogged) {
        const fetchSubs = async () => {
            try {
                const res = await fetch('/api/push/send', { method: 'GET' }); // I need to add GET handler to push/send
                const data = await res.json();
                setSubCount(data.count || 0);
            } catch (e) {}
        };
        fetchSubs();
    }
  }, [isLogged, pushStatus]);

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

  const handleBroadcast = async () => {
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
      }
    } catch (err) {
      setPushStatus('❌ Erro no disparo.');
    } finally {
      setLoading(false);
    }
  };

  const removePush = (id) => {
    setConfig({
      ...config,
      pushMessages: config.pushMessages.filter(p => p.id !== id)
    });
  };

  const getTestUrl = () => {
    if (!config.twrParams) return '';
    const slug = config.twrSlug ? `${config.twrSlug.replace(/^\/|\/$/g, '')}/` : '';
    // Substitui macros {{...}} por 'test_value' para evitar bloqueio do Cloaker durante testes manuais
    const cleanParams = config.twrParams.replace(/\{\{.*?\}\}/g, 'test_val');
    return `https://play.ganhoubet.xyz/${slug}?${cleanParams}`;
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
            style={{ minHeight: '80px', marginBottom: '15px' }}
            value={config.twrParams || ''}
            onChange={e => setConfig({...config, twrParams: e.target.value})}
          />

          <label>Slug/Path da Campanha (Obrigatório se houver barra na TWR)</label>
          <input 
            className="input-field" 
            placeholder="Ex: okdvfxefj8"
            value={config.twrSlug || ''}
            onChange={e => setConfig({...config, twrSlug: e.target.value})}
          />
          <div style={{ fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', color: 'var(--primary)' }}>
            <strong>Dica:</strong> A Safe Page está em <code>/safe</code> e a Oferta está na Raiz <code>/</code>. Configure isso no painel do TWR.
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '10px' }}>
            <h4 style={{ color: '#ff4444', marginBottom: '8px', fontSize: '14px' }}>🆘 Erro "Access Denied"?</h4>
            <ul style={{ fontSize: '12px', color: 'var(--gray)', paddingLeft: '15px', margin: 0 }}>
              <li>Verifique se a campanha está <strong>Ativa/Running</strong> no TWR.</li>
              <li>Não use os colchetes <code>{"{{ }}"}</code> em testes manuais.</li>
              <li>No Cloudflare, o domínio <strong>play</strong> deve estar com a nuvem cinza (Apenas DNS).</li>
            </ul>
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

        {/* Real Push Broadcast Section */}
        <div className="premium-card" style={{ gridColumn: 'span 2', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ color: 'var(--primary)' }}>🚀 Disparar Notificação Real (Broadcast)</h3>
            <div style={{ background: 'rgba(0,255,136,0.1)', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                <strong>{subCount}</strong> Dispositivos Assinados
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '20px' }}>
            Esta mensagem será enviada **instantaneamente** para todos os usuários que aceitaram notificações, mesmo com o navegador fechado.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label>Título do Push</label>
              <input 
                className="input-field" 
                placeholder="Ex: 🎰 Bônus Liberado!"
                value={pushForm.title}
                onChange={e => setPushForm({...pushForm, title: e.target.value})}
              />
            </div>
            <div>
              <label>Mensagem</label>
              <input 
                className="input-field" 
                placeholder="Ex: O Touro está solto! Recupere sua sorte agora."
                value={pushForm.body}
                onChange={e => setPushForm({...pushForm, body: e.target.value})}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--primary)' }}>{pushStatus}</span>
            <button 
              onClick={handleBroadcast} 
              className="btn-primary" 
              style={{ width: '300px', background: 'linear-gradient(45deg, #00ff88, #00ccff)' }}
              disabled={loading || !pushForm.body}
            >
              {loading ? 'Enviando...' : '🚀 Enviar para Todos Agora'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        {config.twrParams && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--primary)', background: 'rgba(0,255,136,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid var(--primary)', textAlign: 'left', flex: 1 }}>
              <strong>URL do Anúncio (Final):</strong> https://play.ganhoubet.xyz/{config.twrSlug ? config.twrSlug.replace(/^\/|\/$/g, '') + '/' : ''}?{config.twrParams}
            </div>
            <button 
              onClick={() => window.open(getTestUrl(), '_blank')}
              className="btn-outline" 
              style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
            >
              🚀 Gerar Link de Teste
            </button>
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
