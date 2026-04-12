'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      router.push('/store/android');
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      router.push('/store/ios');
    } else {
      setDevice('desktop');
    }
  }, [router]);

  if (device === 'desktop') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
        <div className="premium-card animate-fade-in" style={{ maxWidth: '400px' }}>
          <img src="/touro.png" style={{ width: '80px', marginBottom: '20px', borderRadius: '20px' }} />
          <h1 style={{ marginBottom: '10px', color: 'var(--primary)' }}>GanhouBet Mobile</h1>
          <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>Para a melhor experiência, acesse pelo seu celular ou escaneie o código abaixo:</p>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', display: 'inline-block', marginBottom: '30px' }}>
            {/* Simulação de QR Code */}
            <div style={{ width: '200px', height: '200px', backgroundColor: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              QR CODE
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      Detectando dispositivo...
    </div>
  );
}
