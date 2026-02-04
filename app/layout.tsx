import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Wasted Years Brewing',
  description: 'Homebrewing recipes and brew log',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans leading-relaxed">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
