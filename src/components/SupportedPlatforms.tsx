const PLATFORMS = [
  {
    name: 'YouTube',
    description:
      'Captions are used when available (no API key needed). If no captions exist, audio is extracted and transcribed via Whisper.',
    examples: ['youtube.com/watch?v=…', 'youtu.be/…', 'youtube.com/shorts/…'],
    chip: 'bg-red-50 text-red-700 border-red-100',
  },
  {
    name: 'TikTok',
    description:
      'Audio is extracted from public TikTok videos and sent to Whisper for transcription.',
    examples: ['tiktok.com/@user/video/…', 'vm.tiktok.com/…'],
    chip: 'bg-gray-900 text-white border-gray-900',
  },
  {
    name: 'Facebook',
    description:
      'Public Facebook video audio is extracted and transcribed when the video is accessible.',
    examples: ['facebook.com/watch/?v=…', 'fb.watch/…'],
    chip: 'bg-blue-50 text-blue-700 border-blue-100',
  },
]

export default function SupportedPlatforms() {
  return (
    <section id="supported" className="px-4 py-16 border-t border-gray-100 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Supported platforms</h2>
        <div className="space-y-4">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.chip}`}
                >
                  {p.name}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.examples.map((ex) => (
                  <code
                    key={ex}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono"
                  >
                    {ex}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
