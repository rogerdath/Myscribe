import { join } from 'path'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'
import { TranscriptError } from './types'

export async function downloadAudio(url: string): Promise<string> {
  const { default: ytDlp } = await import('yt-dlp-exec')
  const tempId = randomUUID()
  const outputPath = join(tmpdir(), `myscribe-${tempId}.mp3`)

  try {
    await (ytDlp as Function)(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: '5',
      output: outputPath,
      noPlaylist: true,
      quiet: true,
      noWarnings: true,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('Private video') || msg.includes('members-only') || msg.includes('Login')) {
      throw new TranscriptError('PRIVATE_VIDEO', 'This video is private or requires a login.')
    }
    if (msg.includes('not available') || msg.includes('has been removed')) {
      throw new TranscriptError('EXTRACTION_FAILED', 'This video is unavailable.')
    }
    throw new TranscriptError('EXTRACTION_FAILED', 'Could not download audio from this video.')
  }

  return outputPath
}
