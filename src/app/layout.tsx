import './globals.css'
import ServiceWorkerRegister from './sw-register'

interface Metadata {
  title?: string;
  description?: string;
  manifest?: string;
  icons?: {
    apple?: string;
  };
}

interface Viewport {
  themeColor?: string;
  width?: string;
  initialScale?: number;
}

export const metadata: Metadata = {
  title: 'Agenda Gatinhos',
  description: 'Minha agenda de gatinhos criada com Next.js',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
  }
}

export const viewport: Viewport = {
  themeColor: '#f6f1f8',
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Agenda Gatinhos" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}