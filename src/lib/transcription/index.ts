import { TranscriptResult, TranscriptError } from './types'
import { transcribeYouTube } from './youtube'
import { transcribeTikTok } from './tiktok'
import { transcribeFacebook } from './facebook'

export { TranscriptError } from './types'
export type { TranscriptResult } from './types'

export async function transcribe(
  url: string,
  platform: 'youtube' | 'tiktok' | 'facebook'
): Promise<TranscriptResult> {
  // --- MOCK MODE ---
  // Set MOCK_TRANSCRIPTION=true in .env.local to skip real API calls during development.
  if (process.env.MOCK_TRANSCRIPTION === 'true') {
    return buildMockTranscript(platform)
  }

  switch (platform) {
    case 'youtube':
      return transcribeYouTube(url)
    case 'tiktok':
      return transcribeTikTok(url)
    case 'facebook':
      return transcribeFacebook(url)
    default:
      throw new TranscriptError('UNSUPPORTED_URL', 'This platform is not supported.')
  }
}

// Clearly labelled mock — easy to find and remove for production
function buildMockTranscript(platform: 'youtube' | 'tiktok' | 'facebook'): TranscriptResult {
  return {
    platform,
    title: '[Mock] Sample Video Title',
    durationSeconds: 95,
    transcript:
      'This is a mock transcript returned in development mode. ' +
      'When MOCK_TRANSCRIPTION is false and real credentials are set, ' +
      'this will be replaced by the actual speech-to-text output from the video. ' +
      'The transcript will include everything said in the video, ' +
      'formatted as clean readable text ready to copy or download.',
    segments: [
      { start: 0, end: 6, text: 'This is a mock transcript returned in development mode.' },
      { start: 6, end: 14, text: 'When MOCK_TRANSCRIPTION is false and real credentials are set,' },
      { start: 14, end: 22, text: 'this will be replaced by the actual speech-to-text output from the video.' },
    ],
    source: 'captions',
  }
}
