'use client'

import { useState } from 'react'
import { extractSupportedVideoUrl } from '@/lib/urlParser'

interface UrlInputProps {
  onTranscribe: (input: string) => void
  disabled: boolean
}

const EXAMPLE_URL = 'Check this out https://www.youtube.com/watch?v=dQw4w9WgXcQ — great listen!'

export default function UrlInput({ onTranscribe, disabled }: UrlInputProps) {
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState<ReturnType<typeof extractSupportedVideoUrl> | null>(null)

  function handleChange(value: string) {
    setInput(value)
    if (value.trim()) {
      setPreview(extractSupportedVideoUrl(value))
    } else {
      setPreview(null)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onTranscribe(input)
    }
  }

  function loadExample() {
    handleChange(EXAMPLE_URL)
  }

  const canSubmit = !disabled && input.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste a TikTok, YouTube, or Facebook video link — or any text containing one"
          rows={3}
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-900 placeholder-gray-400 text-base leading-relaxed transition-colors"
          disabled={disabled}
        />

        {/* Live detection preview */}
        {preview && input.trim() && (
          <div
            className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
              preview.isSupported
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            {preview.isSupported ? (
              <>
                <span className="font-semibold uppercase tracking-wide">{preview.platform}</span>
                <span className="text-green-600 truncate flex-1">{preview.extractedUrl}</span>
                <span className="flex-shrink-0 font-medium">Detected</span>
              </>
            ) : (
              <span>No supported video link found. Paste a TikTok, YouTube, or Facebook link.</span>
            )}
          </div>
        )}
      </div>

      {/* Platform chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400">Supports:</span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
          YouTube
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">
          TikTok
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          Facebook
        </span>
      </div>

      <p className="text-xs text-gray-400">
        You can paste a full message. We&apos;ll find the video link automatically.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 active:bg-gray-950 transition-colors text-sm"
        >
          {disabled ? 'Transcribing…' : 'Transcribe video'}
        </button>

        {input ? (
          <button
            type="button"
            onClick={() => handleChange('')}
            className="px-4 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={loadExample}
            className="px-4 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            See example
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        We only use the detected video link to generate your transcript. Private or restricted videos are not supported.
      </p>
    </form>
  )
}
