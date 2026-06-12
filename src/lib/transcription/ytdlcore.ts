import { Readable } from 'stream'
import { TranscriptError } from './types'

export async function streamYouTubeAudio(url: string): Promise<Readable> {
  const { default: ytdl } = await import('@distube/ytdl-core')

  let info: Awaited<ReturnType<typeof ytdl.getInfo>>
  try {
    info = await ytdl.getInfo(url)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/private|login required|members.only|unavailable|removed/i.test(msg)) {
      throw new TranscriptError('PRIVATE_VIDEO', 'This video is private or unavailable.')
    }
    throw new TranscriptError('EXTRACTION_FAILED', 'Could not fetch this YouTube video.')
  }

  const format = ytdl.chooseFormat(info.formats, {
    filter: 'audioonly',
    quality: 'lowestaudio',
  })

  return ytdl.downloadFromInfo(info, { format })
}
