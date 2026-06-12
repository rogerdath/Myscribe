export interface ExtractedUrlResult {
  rawInput: string
  extractedUrl: string | null
  platform: 'youtube' | 'tiktok' | 'facebook' | null
  isSupported: boolean
  error?: string
}

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^\[\]`]+/gi

const TRAILING_PUNCT_RE = /[.,;:!?)\]}"']+$/

function trimTrailingPunct(url: string): string {
  return url.replace(TRAILING_PUNCT_RE, '')
}

function detectPlatform(url: string): 'youtube' | 'tiktok' | 'facebook' | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname
    .replace(/^www\./, '')
    .replace(/^m\./, '')

  if (host === 'youtube.com' || host === 'youtu.be') return 'youtube'
  if (host === 'tiktok.com' || host === 'vm.tiktok.com') return 'tiktok'
  if (host === 'facebook.com' || host === 'fb.watch') return 'facebook'

  return null
}

export function extractSupportedVideoUrl(input: string): ExtractedUrlResult {
  const base: ExtractedUrlResult = {
    rawInput: input,
    extractedUrl: null,
    platform: null,
    isSupported: false,
  }

  const matches = input.match(URL_REGEX)
  if (!matches) {
    return { ...base, error: 'Paste a TikTok, YouTube, or Facebook video link.' }
  }

  for (const match of matches) {
    const cleaned = trimTrailingPunct(match)
    const platform = detectPlatform(cleaned)
    if (platform) {
      return {
        rawInput: input,
        extractedUrl: cleaned,
        platform,
        isSupported: true,
      }
    }
  }

  return { ...base, error: 'Paste a TikTok, YouTube, or Facebook video link.' }
}
