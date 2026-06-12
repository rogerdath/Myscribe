import { extractSupportedVideoUrl } from '../src/lib/urlParser'

describe('extractSupportedVideoUrl', () => {
  describe('YouTube', () => {
    it('extracts a plain youtube.com/watch URL', () => {
      const r = extractSupportedVideoUrl('https://www.youtube.com/watch?v=abc123')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('youtube')
      expect(r.extractedUrl).toBe('https://www.youtube.com/watch?v=abc123')
    })

    it('extracts a youtu.be short link', () => {
      const r = extractSupportedVideoUrl('https://youtu.be/abc123')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('youtube')
    })

    it('extracts a YouTube Shorts URL', () => {
      const r = extractSupportedVideoUrl('https://www.youtube.com/shorts/abc123')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('youtube')
    })

    it('extracts URL from surrounding share text', () => {
      const r = extractSupportedVideoUrl(
        'Here is the video: https://youtu.be/abc123?si=test Thanks'
      )
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('youtube')
      expect(r.extractedUrl).toContain('youtu.be/abc123')
    })

    it('handles mobile youtube URL', () => {
      const r = extractSupportedVideoUrl('https://m.youtube.com/watch?v=abc123')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('youtube')
    })
  })

  describe('TikTok', () => {
    it('extracts a standard TikTok video URL', () => {
      const r = extractSupportedVideoUrl(
        'https://www.tiktok.com/@user/video/123456789'
      )
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('tiktok')
    })

    it('extracts a vm.tiktok.com short link', () => {
      const r = extractSupportedVideoUrl('https://vm.tiktok.com/ABC123/')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('tiktok')
    })

    it('extracts TikTok URL from emoji-filled message', () => {
      const r = extractSupportedVideoUrl(
        '🎣 Check this out https://www.tiktok.com/@fishing/video/123456789?is_from_webapp=1'
      )
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('tiktok')
    })
  })

  describe('Facebook', () => {
    it('extracts a facebook.com/watch URL', () => {
      const r = extractSupportedVideoUrl('https://www.facebook.com/watch/?v=123456789')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('facebook')
    })

    it('extracts an fb.watch short URL', () => {
      const r = extractSupportedVideoUrl('https://fb.watch/xyz123/')
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('facebook')
    })
  })

  describe('Trailing punctuation trimming', () => {
    it('trims a trailing period', () => {
      const r = extractSupportedVideoUrl('Watch this https://youtu.be/abc123.')
      expect(r.extractedUrl).toBe('https://youtu.be/abc123')
    })

    it('trims trailing comma', () => {
      const r = extractSupportedVideoUrl('https://youtu.be/abc123,')
      expect(r.extractedUrl).toBe('https://youtu.be/abc123')
    })

    it('trims trailing closing paren', () => {
      const r = extractSupportedVideoUrl('(see https://youtu.be/abc123)')
      expect(r.extractedUrl).toBe('https://youtu.be/abc123')
    })
  })

  describe('Unsupported / empty input', () => {
    it('returns isSupported=false for empty string', () => {
      const r = extractSupportedVideoUrl('')
      expect(r.isSupported).toBe(false)
      expect(r.extractedUrl).toBeNull()
      expect(r.error).toBeTruthy()
    })

    it('returns isSupported=false for plain text with no URL', () => {
      const r = extractSupportedVideoUrl('hey check this out!')
      expect(r.isSupported).toBe(false)
    })

    it('returns isSupported=false for an unsupported URL', () => {
      const r = extractSupportedVideoUrl('https://vimeo.com/12345678')
      expect(r.isSupported).toBe(false)
      expect(r.error).toBe('Paste a TikTok, YouTube, or Facebook video link.')
    })

    it('uses first supported URL when multiple URLs are present', () => {
      const r = extractSupportedVideoUrl(
        'https://vimeo.com/99 and https://youtu.be/abc123'
      )
      expect(r.isSupported).toBe(true)
      expect(r.platform).toBe('youtube')
    })
  })
})
