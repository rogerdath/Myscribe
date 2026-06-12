import { TranscriptResult, TranscriptError } from './types'
import { downloadAudio } from './ytdlp'
import { transcribeAudio } from './whisper'
import { unlink } from 'fs/promises'

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^(www\.|m\.)/, '')

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split(/[/?#]/)[0] || null
    }

    if (host === 'youtube.com') {
      const v = parsed.searchParams.get('v')
      if (v) return v

      const pathMatch = parsed.pathname.match(/\/(shorts|embed|live|v)\/([^/?&#]+)/)
      if (pathMatch) return pathMatch[2]
    }

    return null
  } catch {
    return null
  }
}

export async function transcribeYouTube(url: string): Promise<TranscriptResult> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new TranscriptError('UNSUPPORTED_URL', 'Could not extract a video ID from this YouTube URL.')
  }

  // Try captions first (no API key required)
  try {
    const { YoutubeTranscript } = await import('youtube-transcript')
    const items = await YoutubeTranscript.fetchTranscript(videoId)

    if (items && items.length > 0) {
      const segments = items.map((item: any) => ({
        start: (item.offset ?? item.start ?? 0) / 1000,
        end: ((item.offset ?? item.start ?? 0) + (item.duration ?? 0)) / 1000,
        text: String(item.text).replace(/\n/g, ' ').trim(),
      }))

      const transcript = segments
        .map((s) => s.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      const durationSeconds = segments.length > 0 ? segments[segments.length - 1].end : 0

      return {
        platform: 'youtube',
        title: '',
        durationSeconds,
        transcript,
        segments,
        source: 'captions',
      }
    }
  } catch {
    // Captions unavailable — fall through to audio transcription
  }

  // Fall back to audio transcription via Whisper
  if (!process.env.OPENAI_API_KEY) {
    throw new TranscriptError(
      'EXTRACTION_FAILED',
      'No captions are available for this video and audio transcription is not configured.'
    )
  }

  let audioPath: string | null = null
  try {
    audioPath = await downloadAudio(url)
    const result = await transcribeAudio(audioPath)
    return {
      platform: 'youtube',
      title: '',
      durationSeconds: result.segments.length > 0 ? result.segments[result.segments.length - 1].end : 0,
      transcript: result.text,
      segments: result.segments,
      source: 'audio_transcription',
    }
  } finally {
    if (audioPath) {
      unlink(audioPath).catch(() => undefined)
    }
  }
}
