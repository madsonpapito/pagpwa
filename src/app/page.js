'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [device, setDevice] = useState(null);

  useEffect(() => {
    // Redirecionamento seguro com verificação de montagem
    const detectAndRedirect = () => {
        try {
            const ua = navigator.userAgent || "";
            if (/android/i.test(ua)) {
                router.push('/store/android');
            } else if (/iPad|iPhone|iPod/.test(ua)) {
                router.push('/store/ios');
            } else {
                setDevice('desktop');
            }
        } catch (e) {
            setDevice('desktop'); // Fallback para Desktop se a detecção falhar
        }
    };

    detectAndRedirect();
  }, [router]);

  if (device === 'desktop') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px', backgroundColor: '#0a0e12' }}>
        <div className="premium-card animate-fade-in" style={{ maxWidth: '400px' }}>
          <img src="/touro.png" style={{ width: '80px', marginBottom: '20px', borderRadius: '20px' }} />
          <h1 style={{ marginBottom: '10px', color: 'var(--primary)' }}>GanhouBet Mobile</h1>
          <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>Para a melhor experiência, acesse pelo seu celular ou escaneie o código abaixo:</p>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', display: 'inline-block', marginBottom: '30px' }}>
            <div style={{ width: '200px', height: '200px', backgroundColor: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              GANHOUBET PWA
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => router.push('/store/ios')} className="btn-outline">iOS</button>
            <button onClick={() => router.push('/store/android')} className="btn-outline">Android</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', backgroundColor: '#0a0e12' }}>
      <img src="/touro.png" style={{ width: '60px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }} />
      <span style={{ fontSize: '14px', letterSpacing: '2px' }}>CARREGANDO GANHOUBET...</span>
      
      <style jsx>{`
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
