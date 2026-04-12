'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IosStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInstall = () => {
    setIsInstalling(true);
    // Track event
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'pwa_install_click',
        platform: 'ios'
      });
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        window.location.href = '/'; // Go to offer page after "install"
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white text-[#1c1c1e] font-sans pb-20 select-none">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
             <img src="/images/app-icon.png" alt="Icon" className="w-full h-full object-cover" />
           </div>
           <span className="font-semibold text-sm opacity-0 transition-opacity duration-300">GanhouBet</span>
        </div>
        <button 
          onClick={handleInstall}
          className="bg-[#007aff] text-white px-4 py-1.5 rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          {isInstalling ? `${progress}%` : 'OBTER'}
        </button>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6">
        {/* Main Header */}
        <div className="flex gap-4 mb-6">
          <div className="w-[110px] h-[110px] rounded-[22%] overflow-hidden shadow-xl border border-[#f2f2f7]">
            <img src="/images/app-icon.png" alt="GanhouBet Icon" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center flex-1">
            <h1 className="text-[22px] font-bold leading-tight tracking-tight">GanhouBet: Mascot Slots Casino</h1>
            <p className="text-[#8e8e93] text-[15px] font-medium mt-1">Win Real Cash & Jackpots</p>
            <div className="mt-auto flex items-center justify-between">
               <button 
                onClick={handleInstall}
                className="bg-[#007aff] text-white px-6 py-1.5 rounded-full text-base font-bold active:scale-95 transition-all"
               >
                {isInstalling ? 'BAIXANDO...' : 'OBTER'}
               </button>
               <span className="text-[10px] text-[#8e8e93] font-semibold text-center leading-none mr-2">Compras <br/> no App</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between py-4 border-y border-[#f2f2f7] mb-6 overflow-x-auto gap-8 no-scrollbar">
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] text-[#8e8e93] font-bold uppercase">64 mil avaliações</span>
            <span className="text-[18px] font-bold text-[#48484a] mt-1">4.9</span>
            <div className="flex text-[#ffcc00] text-[8px] mt-0.5">★★★★★</div>
          </div>
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] text-[#8e8e93] font-bold uppercase">Ranking</span>
            <span className="text-[18px] font-bold text-[#48484a] mt-1">#1</span>
            <span className="text-[10px] text-[#8e8e93] font-bold">em Cassino</span>
          </div>
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] text-[#8e8e93] font-bold uppercase">Classificação</span>
            <span className="text-[18px] font-bold text-[#48484a] mt-1">18+</span>
            <span className="text-[10px] text-[#8e8e93] font-bold">Anos</span>
          </div>
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] text-[#8e8e93] font-bold uppercase">Tamanho</span>
            <span className="text-[18px] font-bold text-[#48484a] mt-1">92.4</span>
            <span className="text-[10px] text-[#8e8e93] font-bold">MB</span>
          </div>
        </div>

        {/* Screenshots Carrossel */}
        <div className="mb-8">
           <h2 className="text-[20px] font-bold mb-4">Pré-visualização</h2>
           <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
              <div className="min-w-[240px] aspect-[9/19.5] rounded-3xl overflow-hidden shadow-lg border border-[#f2f2f7]">
                <img src="/images/screen-1.png" alt="Preview 1" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-[240px] aspect-[9/19.5] rounded-3xl overflow-hidden shadow-lg border border-[#f2f2f7]">
                <img src="/images/screen-2.png" alt="Preview 2" className="w-full h-full object-cover" />
              </div>
           </div>
           <p className="text-[12px] text-[#8e8e93] mt-3 flex items-center gap-1">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>
             iPhone
           </p>
        </div>

        {/* What's New */}
        <div className="py-5 border-t border-[#f2f2f7] mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <h2 className="text-[20px] font-bold">Novidades</h2>
            <Link href="#" className="text-[#007aff] text-[15px]">Histórico de versões</Link>
          </div>
          <div className="flex justify-between text-[#8e8e93] text-[14px] mb-3">
             <span>Versão 1.0.18</span>
             <span>há 5 dias</span>
          </div>
          <p className="text-[15px] leading-snug">
            Nesta atualização, otimizamos o desempenho do "Fortune Tiger" e do "Mascot Hub" para carregamentos super rápidos. Agora com suporte a pagamentos instantâneos via PIX direto no app.
          </p>
        </div>

        {/* Preview Description */}
        <div className="py-5 border-t border-[#f2f2f7] mb-8">
          <p className="text-[15px] leading-snug">
            Bem-vindo ao GanhouBet, o cassino social nº 1 onde os mascotes ganham vida! Jogue slots incríveis com Touro, Tigre e Porco Cowboy.
          </p>
          <Link href="#" className="text-[#007aff] text-[15px] mt-2 block">mais</Link>
        </div>

        {/* Detail Table */}
        <div className="py-5 border-t border-[#f2f2f7]">
           <h2 className="text-[20px] font-bold mb-4">Informações</h2>
           <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#f2f2f7]/50 text-[14px]">
                <span className="text-[#8a8a8e]">Vendedor</span>
                <span className="font-medium">GanhouBet Studio Ltd.</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f2f2f7]/50 text-[14px]">
                <span className="text-[#8a8a8e]">Tamanho</span>
                <span className="font-medium">92.4 MB</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f2f2f7]/50 text-[14px]">
                <span className="text-[#8a8a8e]">Categoria</span>
                <span className="font-medium">Jogos: Cassino</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f2f2f7]/50 text-[14px]">
                <span className="text-[#8a8a8e]">Compatibilidade</span>
                <span className="font-medium">Funciona neste iPhone</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f2f2f7]/50 text-[14px]">
                <span className="text-[#8a8a8e]">Idiomas</span>
                <span className="font-medium">Português, Inglês</span>
              </div>
           </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 mb-20 text-center space-y-2">
           <p className="text-[12px] text-[#8e8e93]">Copyright © 2026 GanhouBet Studio</p>
           <div className="flex justify-center gap-4 text-[12px] text-[#007aff]">
             <Link href="#">Política de Privacidade</Link>
             <Link href="#">Termos e Condições</Link>
           </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          -webkit-tap-highlight-color: transparent;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
