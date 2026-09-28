import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE_URL, openGraph } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Wasted Years Brewing',
  description: 'Homebrewing recipes and brew log',
  openGraph: openGraph(
    'Wasted Years Brewing',
    'Craft beer. Heavy metal. Homebrewing recipes and brew log.'
  ),
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans leading-relaxed antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
