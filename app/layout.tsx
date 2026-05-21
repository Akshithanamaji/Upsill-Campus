import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'CityPulse - Smart City Traffic Management',
  description: 'Real-time traffic analysis and prediction system for smart cities',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico',
  },
}

import { AuthProvider } from '@/context/AuthContext';

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${geistMono.className} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
