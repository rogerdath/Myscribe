'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import UrlInput from '@/components/UrlInput'
import LoadingState from '@/components/LoadingState'
import TranscriptResult, { type TranscriptData } from '@/components/TranscriptResult'
import HowItWorks from '@/components/HowItWorks'
import SupportedPlatforms from '@/components/SupportedPlatforms'
import Limitations from '@/components/Limitations'
import Footer from '@/components/Footer'
import { extractSupportedVideoUrl } from '@/lib/urlParser'

type AppState = 'idle' | 'loading' | 'success' | 'error'

const ERROR_MESSAGES: Record<string, string> = {
  PRIVATE_VIDEO: 'This video is private or unavailable.',
  UNSUPPORTED_URL: 'Paste a TikTok, YouTube, or Facebook video link.',
  EXTRACTION_FAILED: 'We could not access this link. Try another public video link.',
  TRANSCRIPTION_FAILED: 'No audio or captions could be extracted.',
  TOO_LONG: 'This video is too long to process right now.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  NO_SUPPORTED_URL: 'Paste a TikTok, YouTube, or Facebook video link.',
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [transcript, setTranscript] = useState<TranscriptData | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)

  async function handleTranscribe(rawInput: string) {
    const parsed = extractSupportedVideoUrl(rawInput)

    if (!parsed.isSupported || !parsed.extractedUrl || !parsed.platform) {
      setErrorMsg(parsed.error ?? 'Paste a TikTok, YouTube, or Facebook video link.')
      setAppState('error')
      return
    }

    setAppState('loading')
    setErrorMsg(null)
    setTranscript(null)

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: parsed.extractedUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        const code = data?.error?.code as string | undefined
        setErrorMsg(
          (code && ERROR_MESSAGES[code]) ??
            data?.error?.message ??
            'Something went wrong. Please try again.'
        )
        setAppState('error')
        return
      }

      setTranscript({ ...data, detectedUrl: parsed.extractedUrl })
      setAppState('success')
    } catch {
      setErrorMsg('Could not connect to the server. Please check your connection and try again.')
      setAppState('error')
    }
  }

  function handleReset() {
    setAppState('idle')
    setTranscript(null)
    setErrorMsg(null)
    setResetKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero / tool section */}
        <section className="px-4 pt-14 pb-10 md:pt-20 md:pb-14">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
              Transcribe social videos<br className="hidden sm:block" /> in seconds.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
              Paste a TikTok, YouTube, or Facebook link and get a clean transcript you can copy,
              search, summarize, or save.
            </p>

            <UrlInput
              key={resetKey}
              onTranscribe={handleTranscribe}
              disabled={appState === 'loading'}
            />

            {appState === 'loading' && <LoadingState />}

            {appState === 'error' && errorMsg && (
              <div className="mt-6 px-4 py-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{errorMsg}</p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 underline transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {appState === 'success' && transcript && (
              <TranscriptResult data={transcript} onReset={handleReset} />
            )}
          </div>
        </section>

        <HowItWorks />
        <SupportedPlatforms />
        <Limitations />
      </main>

      <Footer />
    </div>
  )
}
