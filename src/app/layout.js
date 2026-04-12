import './globals.css';
import Script from 'next/script';
import PwaHandler from './components/PwaHandler';

export const metadata = {
  title: 'GanhouBet App',
  description: 'O melhor app de iGaming com cassino ao vivo e slots exclusivos.',
  manifest: '/manifest.json',
  themeColor: '#00ff88',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Tag Manager Component */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PNLMZZ8V');`}
        </Script>
      </head>
      <body>
        <PwaHandler />
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PNLMZZ8V"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}

