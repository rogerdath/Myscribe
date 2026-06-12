'use client'

import { useState } from 'react'

interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface TranscriptData {
  platform: string
  title: string
  durationSeconds: number
  transcript: string
  segments: TranscriptSegment[]
  source: 'captions' | 'audio_transcription'
  detectedUrl: string
}

interface Props {
  data: TranscriptData
  onReset: () => void
}

const PLATFORM_LABEL: Record<string, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  facebook: 'Facebook',
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TranscriptResult({ data, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(data.transcript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — fallback: select the text
    }
  }

  function handleDownload() {
    const blob = new Blob([data.transcript], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
      {/* Meta header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {data.title && (
            <p className="text-sm font-semibold text-gray-900 truncate">{data.title}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
            <span className="text-xs text-gray-500">
              {PLATFORM_LABEL[data.platform] ?? data.platform}
            </span>
            {data.durationSeconds > 0 && (
              <>
                <span className="text-gray-300 text-xs">·</span>
                <span className="text-xs text-gray-500">{formatDuration(data.durationSeconds)}</span>
              </>
            )}
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-xs text-gray-500">
              {data.source === 'captions' ? 'Captions' : 'Audio transcription'}
            </span>
          </div>
          <a
            href={data.detectedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 underline truncate block mt-0.5 max-w-xs"
          >
            {data.detectedUrl}
          </a>
        </div>
        <button
          onClick={onReset}
          className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap"
        >
          New transcript
        </button>
      </div>

      {/* Transcript text */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{data.transcript}</p>
      </div>

      {/* Action bar */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy transcript'}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Download .txt
        </button>
      </div>
    </div>
  )
}
