import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Myscribe — Transcribe social videos in seconds',
  description:
    'Paste a TikTok, YouTube, or Facebook link and get a clean transcript you can copy, search, summarize, or save.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
