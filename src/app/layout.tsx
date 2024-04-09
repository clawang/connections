import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CSPostHogProvider } from './providers'
import Head from 'next/head';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Custom Connections',
  description: 'Create your own custom version of the NYT Connections game.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>Custom Connections</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <CSPostHogProvider>
        <body className={inter.className}>
          {children}
        </body>
      </CSPostHogProvider>
    </html>
  )
}
