import "./globals.css";
import { Montserrat } from 'next/font/google';
import AuthProvider from "@/src/services/auth/auth.Provider.js";
import Header from '@/src/components/navbar/Header.js';

const monse = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Clara Cerámicas",
  description: "Aplicación para la Administración de trabajos realizados por Clara Cerámicas",
};

export default function RootLayout({ children }) {
  
  return (
    <>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/touch-icon-iphone.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/32x32.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/img/128x128.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/img/192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/img/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/img/android-chrome-256x256.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/img/android-chrome-512x512.png" />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <link rel="icon" href="/img/icon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/icon16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/icon32.png" />
        <link rel="icon" type="image/png" sizes="36x36" href="/img/icon36.png" />
        <link rel="icon" type="image/png" sizes="40x40" href="/img/icon-40.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/img/icon48.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/img/icon-57.png" />
        <link rel="apple-touch-icon" sizes="58x58" href="/img/icon-58.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/img/icon-60.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/img/icon64.png" />
        <link rel="icon" type="image/png" sizes="72x72" href="/img/icon72.png" />
        <link rel="icon" type="image/png" sizes="72x72" href="/img/icon-72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/img/icon-76.png" />
        <link rel="icon" type="image/png" sizes="80x80" href="/img/icon-80.png" />
        <link rel="apple-touch-icon" sizes="87x87" href="/img/icon-87.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/img/icon96.png" />
        <link rel="icon" type="image/png" sizes="114x114" href="/img/icon114.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/img/icon-114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/img/icon-120.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/img/icon128.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/img/icon-128.png" />
        <link rel="icon" type="image/png" sizes="136x136" href="/img/icon-136.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/img/icon144.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/img/icon-144.png" />
        <link rel="icon" type="image/png" sizes="150x150" href="/img/icon150.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/img/icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/img/icon-167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/icon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/img/icon192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/img/icon-192.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/img/icon256.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/img/icon512.png" />
        <link rel="icon" type="image/png" sizes="1024x1024" href="/img/icon-1024.png" />
      </head>
      <body className={monse.className}>
        <AuthProvider>         
          <Header />
          {children}         
        </AuthProvider>
      </body>
    </html>
    </>
  );
}
