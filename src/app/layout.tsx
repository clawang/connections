import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CSPostHogProvider } from './providers'
import Head from 'next/head';
import dynamic from 'next/dynamic'
import Script from 'next/script'
import './globals.css'

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7330339350575374"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </Head>
      <CSPostHogProvider>
        <body className={inter.className}>
          <PostHogPageView />
          {children}
        </body>
      </CSPostHogProvider>
    </html>
  )
}
