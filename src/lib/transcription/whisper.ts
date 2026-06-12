import { createReadStream } from 'fs'
import { Readable } from 'stream'
import { TranscriptError } from './types'

interface WhisperResult {
  text: string
  segments: { start: number; end: number; text: string }[]
}

async function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new TranscriptError(
      'TRANSCRIPTION_FAILED',
      'Audio transcription is not configured. Set OPENAI_API_KEY to enable it.'
    )
  }
  const { default: OpenAI } = await import('openai')
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

function parseResponse(raw: unknown): WhisperResult {
  const t = raw as any
  const segments: any[] = t.segments ?? []
  return {
    text: String(t.text ?? '').trim(),
    segments: segments.map((s: any) => ({
      start: s.start as number,
      end: s.end as number,
      text: String(s.text).trim(),
    })),
  }
}

function mapError(err: unknown): never {
  if (err instanceof TranscriptError) throw err
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('rate limit') || msg.includes('429')) {
    throw new TranscriptError('RATE_LIMITED', 'Transcription rate limited. Please try again shortly.')
  }
  throw new TranscriptError('TRANSCRIPTION_FAILED', 'Audio transcription failed. Please try again.')
}

// Used by TikTok / Facebook (yt-dlp writes a temp file)
export async function transcribeAudio(audioPath: string): Promise<WhisperResult> {
  const openai = await getOpenAI()
  try {
    const result = await openai.audio.transcriptions.create({
      file: createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json',
    } as any)
    return parseResponse(result)
  } catch (err) {
    mapError(err)
  }
}

// Used by YouTube (streams audio directly, no temp file)
export async function transcribeAudioStream(
  stream: Readable,
  filename = 'audio.webm'
): Promise<WhisperResult> {
  const openai = await getOpenAI()
  const { toFile } = await import('openai')
  try {
    const file = await toFile(stream, filename)
    const result = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'verbose_json',
    } as any)
    return parseResponse(result)
  } catch (err) {
    mapError(err)
  }
}
