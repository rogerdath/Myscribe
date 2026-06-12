import { createReadStream } from 'fs'
import { TranscriptError } from './types'

interface WhisperResult {
  text: string
  segments: { start: number; end: number; text: string }[]
}

export async function transcribeAudio(audioPath: string): Promise<WhisperResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new TranscriptError(
      'TRANSCRIPTION_FAILED',
      'Audio transcription is not configured. Set OPENAI_API_KEY to enable it.'
    )
  }

  const { default: OpenAI } = await import('openai')
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  let transcription: any
  try {
    transcription = await openai.audio.transcriptions.create({
      file: createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json',
    } as any)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('rate limit') || msg.includes('429')) {
      throw new TranscriptError('RATE_LIMITED', 'Transcription service is rate limited. Please try again shortly.')
    }
    throw new TranscriptError('TRANSCRIPTION_FAILED', 'Audio transcription failed. Please try again.')
  }

  const rawSegments: any[] = transcription.segments ?? []
  const segments = rawSegments.map((seg: any) => ({
    start: seg.start as number,
    end: seg.end as number,
    text: String(seg.text).trim(),
  }))

  return {
    text: String(transcription.text ?? '').trim(),
    segments,
  }
}
