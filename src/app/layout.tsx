import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { cx } from 'class-variance-authority'
import { ThemeProvider } from '@/components/providers'
import { Footer } from '@/components/footer'
import { VercelToolbar } from '@vercel/toolbar/next'

const bodyFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {

  metadataBase: new URL('https://prestonbourne.dev'),
  title: {
    default: 'Preston Bourne | Software Engineer',
    template: '%s | Preston Bourne',
  },
  description: 'Chasing beautiful, performant software.',
  openGraph: {
    siteName: 'Preston Bourne, Engineer & Designer',
    url: 'https://prestonbourne.dev',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cx(
          bodyFont.className,
          'selection:bg-secondary selection:text-purple-600 selection:bg-purple-200 dark:bg-black dark:selection:text-lime-100 dark:selection:bg-lime-800 px-4',
          'max-w-screen-md mx-auto pt-16',
          'min-h-screen flex flex-col', // pins the footer to the bottom
          'relative' // for flexbar v0
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex-grow">{children}</div>
          <Footer />
        </ThemeProvider>
        {shouldInjectToolbar && <VercelToolbar />}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
