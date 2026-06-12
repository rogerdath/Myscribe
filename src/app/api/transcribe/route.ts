import { NextRequest, NextResponse } from 'next/server'
import { transcribe, TranscriptError } from '@/lib/transcription'
import { extractSupportedVideoUrl } from '@/lib/urlParser'

// Allow up to 5 minutes for audio download + transcription
export const maxDuration = 300

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'UNSUPPORTED_URL', message: 'Invalid request body.' } },
      { status: 400 }
    )
  }

  if (!body || typeof body !== 'object' || !('url' in body) || typeof (body as any).url !== 'string') {
    return NextResponse.json(
      { error: { code: 'NO_SUPPORTED_URL', message: 'A video URL is required.' } },
      { status: 400 }
    )
  }

  const rawUrl = (body as { url: string }).url

  // Validate and detect platform server-side (defence in depth)
  const parsed = extractSupportedVideoUrl(rawUrl)
  if (!parsed.isSupported || !parsed.extractedUrl || !parsed.platform) {
    return NextResponse.json(
      { error: { code: 'UNSUPPORTED_URL', message: 'Paste a TikTok, YouTube, or Facebook video link.' } },
      { status: 400 }
    )
  }

  try {
    const result = await transcribe(parsed.extractedUrl, parsed.platform)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof TranscriptError) {
      const status =
        err.code === 'RATE_LIMITED' ? 429
        : err.code === 'PRIVATE_VIDEO' ? 403
        : 422
      return NextResponse.json({ error: { code: err.code, message: err.message } }, { status })
    }

    console.error('[/api/transcribe] Unexpected error:', err)
    return NextResponse.json(
      { error: { code: 'EXTRACTION_FAILED', message: 'An unexpected error occurred. Please try again.' } },
      { status: 500 }
    )
  }
}
