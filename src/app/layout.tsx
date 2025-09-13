import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'M-Well - Your Health, Our Priority',
  description: 'Comprehensive healthcare services with modern technology and compassionate care.',
  keywords: 'healthcare, medical services, wellness, doctor appointments, health management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                  
                  // Add loaded class after a short delay to enable smooth transitions
                  setTimeout(function() {
                    document.documentElement.classList.add('loaded');
                  }, 100);
                } catch (e) {
                  document.documentElement.classList.add('light');
                  setTimeout(function() {
                    document.documentElement.classList.add('loaded');
                  }, 100);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 main-container">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  )
}
