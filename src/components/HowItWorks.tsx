const STEPS = [
  {
    n: '1',
    title: 'Paste a video link or message',
    body: 'Drop in a URL, a social media share, or any copied text that contains a video link. You don\'t need to clean it up first.',
  },
  {
    n: '2',
    title: 'We find the video and extract content',
    body: 'We detect the platform, pull available captions, or extract and transcribe the audio.',
  },
  {
    n: '3',
    title: 'You get a clean transcript',
    body: 'Read, copy, search, or download the transcript as a plain text file.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How it works</h2>
        <div className="space-y-7">
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.n}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
