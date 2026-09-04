import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AURORA PULSE 2026 - World Tour & Concert Ticketing System',
  description: 'Sistem tiket konser dan festival musik resmi AURORA PULSE 2026. Panggung 360 spatial sound, 40+ artis dunia, dan verifikasi tiket instan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#08090d] text-zinc-100 font-sans antialiased selection:bg-[#00f0ff] selection:text-black overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
