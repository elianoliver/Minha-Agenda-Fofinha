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
    apple: '/icon-192x192.png',
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
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}