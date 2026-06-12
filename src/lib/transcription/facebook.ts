import { TranscriptResult, TranscriptError } from './types'
import { downloadAudio } from './ytdlp'
import { transcribeAudio } from './whisper'
import { unlink } from 'fs/promises'

export async function transcribeFacebook(url: string): Promise<TranscriptResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new TranscriptError(
      'TRANSCRIPTION_FAILED',
      'Audio transcription is not configured. Set OPENAI_API_KEY to enable Facebook transcription.'
    )
  }

  let audioPath: string | null = null
  try {
    audioPath = await downloadAudio(url)
    const result = await transcribeAudio(audioPath)
    return {
      platform: 'facebook',
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
