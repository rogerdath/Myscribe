const ITEMS = [
  'Private videos cannot be transcribed.',
  'Some platforms may block access depending on region or content restrictions.',
  'Very long videos take more time to process.',
  'Transcript quality depends on audio clarity, language, and background noise.',
  'If you paste multiple links, only the first supported video link is used.',
  'TikTok and Facebook access may be limited by platform protections.',
]

export default function Limitations() {
  return (
    <section className="px-4 py-16 border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitations</h2>
        <ul className="space-y-3">
          {ITEMS.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-gray-500 leading-relaxed">
              <span className="text-gray-300 flex-shrink-0 mt-0.5">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
