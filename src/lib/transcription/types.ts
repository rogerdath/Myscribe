export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface TranscriptResult {
  platform: 'youtube' | 'tiktok' | 'facebook'
  title: string
  durationSeconds: number
  transcript: string
  segments: TranscriptSegment[]
  source: 'captions' | 'audio_transcription'
}

export type ErrorCode =
  | 'NO_SUPPORTED_URL'
  | 'PRIVATE_VIDEO'
  | 'UNSUPPORTED_URL'
  | 'EXTRACTION_FAILED'
  | 'TRANSCRIPTION_FAILED'
  | 'TOO_LONG'
  | 'RATE_LIMITED'

export class TranscriptError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'TranscriptError'
  }
}
