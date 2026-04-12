'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AndroidStorePage() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInstall = () => {
    setIsInstalling(true);
    // Track event
    if (window.dataLayer) {
      window.dataLayer.push({ 
        event: 'pwa_install_click',
        platform: 'android'
      });
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        window.location.href = '/'; // Redireciona para a oferta após "instalar"
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-white text-[#202124] font-sans pb-10 select-none">
      {/* Google Play Styled Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-40">
        <div className="flex items-center gap-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24dp.svg" alt="Google Play" className="h-5 opacity-70" />
        </div>
        <div className="flex gap-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
      </header>

      <main className="px-6 py-4">
        {/* App Info Section */}
        <div className="flex gap-6 mb-8">
          <div className="w-[84px] h-[84px] min-w-[84px] rounded-[18px] overflow-hidden shadow-md border border-gray-100">
            <img src="/images/android-icon.png" alt="GanhouBet Icon" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col flex-1">
            <h1 className="text-[24px] font-medium leading-tight text-[#202124]">GanhouBet: Mascot Casino</h1>
            <p className="text-[#01875f] text-[16px] font-medium mt-1">GanhouBet Studio</p>
            <p className="text-[#5f6368] text-[14px]">Contém anúncios · Compras no app</p>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="flex justify-between mb-8 overflow-x-auto gap-12 no-scrollbar py-2">
          <div className="flex flex-col items-center min-w-[50px] border-r border-gray-200 pr-8">
            <div className="flex items-center gap-1 font-medium">
              <span className="text-[14px]">4.8</span>
              <span className="text-[10px]">★</span>
            </div>
            <span className="text-[12px] text-[#5f6368]">64 mil avaliações</span>
          </div>
          <div className="flex flex-col items-center min-w-[50px] border-r border-gray-200 pr-8">
            <div className="flex items-center gap-1 font-medium">
              <span className="text-[14px]">92.4 MB</span>
            </div>
            <span className="text-[12px] text-[#5f6368]">Tamanho</span>
          </div>
          <div className="flex flex-col items-center min-w-[50px]">
            <div className="flex items-center gap-1 font-medium">
              <span className="text-[14px]">18+</span>
            </div>
            <span className="text-[12px] text-[#5f6368]">Classificação</span>
          </div>
        </div>

        {/* Install Button */}
        <button 
          onClick={handleInstall}
          className="w-full bg-[#01875f] text-white py-3 rounded-[8px] text-[16px] font-medium mb-8 active:brightness-90 transition-all overflow-hidden relative"
        >
          {isInstalling ? (
            <div className="flex flex-col items-center">
              <span>{progress}% Concluído...</span>
              <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          ) : 'Instalar'}
        </button>

        {/* Categories / Tags */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {['Cassino', 'Casual', 'Simulação'].map(tag => (
            <span key={tag} className="px-4 py-1.5 border border-[#dadce0] rounded-full text-[14px] text-[#5f6368] whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>

        {/* Screenshots Carousel */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[20px] font-medium">Sobre este jogo</h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 mb-6">
            <div className="min-w-[190px] aspect-[9/16] rounded-[8px] overflow-hidden border border-gray-100">
              <img src="/images/android-screen-1.png" alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-[190px] aspect-[9/16] rounded-[8px] overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50 uppercase text-[10px] text-gray-400 font-bold">
               Bônus Diários Ativos
            </div>
          </div>
          <p className="text-[#5f6368] text-[14px] leading-relaxed line-clamp-3">
            Jungle Marble Blast 2 não é páreo para o GanhouBet! O cassino social que está dominando o Brasil agora no seu Android. Jogue slots em 3D com bônus acumulados de mascotes.
          </p>
        </div>

        {/* Data Safety Section */}
        <div className="py-6 border-t border-gray-100 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[20px] font-medium">Segurança de dados</h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div className="p-4 border border-gray-200 rounded-[8px] space-y-4">
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <div>
                <p className="text-[14px] font-medium">O PWA não compartilha dados</p>
                <p className="text-[12px] text-[#5f6368]">Nenhum dado do usuário é compartilhado com terceiros.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div>
                <p className="text-[14px] font-medium">Dados criptografados</p>
                <p className="text-[12px] text-[#5f6368]">As conexões de dados são protegidas por SSL 256 bits.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
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
