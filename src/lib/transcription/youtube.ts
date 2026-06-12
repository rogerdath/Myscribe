import { TranscriptResult, TranscriptError } from './types'
import { streamYouTubeAudio } from './ytdlcore'
import { transcribeAudioStream } from './whisper'

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

  // Try captions first — no API key needed, fast
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

      return {
        platform: 'youtube',
        title: '',
        durationSeconds: segments.length > 0 ? segments[segments.length - 1].end : 0,
        transcript,
        segments,
        source: 'captions',
      }
    }
  } catch {
    // No captions available — fall through to audio transcription
  }

  // Audio transcription via @distube/ytdl-core (pure Node.js, no binary needed)
  if (!process.env.OPENAI_API_KEY) {
    throw new TranscriptError(
      'EXTRACTION_FAILED',
      'No captions available for this video and audio transcription is not configured.'
    )
  }

  const audioStream = await streamYouTubeAudio(url)
  const result = await transcribeAudioStream(audioStream, 'audio.webm')

  return {
    platform: 'youtube',
    title: '',
    durationSeconds: result.segments.length > 0 ? result.segments[result.segments.length - 1].end : 0,
    transcript: result.text,
    segments: result.segments,
    source: 'audio_transcription',
  }
}
