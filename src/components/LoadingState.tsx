'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { delay: 0, message: 'Finding video link…' },
  { delay: 1500, message: 'Fetching video…' },
  { delay: 4000, message: 'Extracting audio or captions…' },
  { delay: 8000, message: 'Transcribing…' },
]

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setStepIndex(i), step.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="mt-6 flex items-center gap-3 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl">
      <span
        className="inline-block h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin flex-shrink-0"
        aria-hidden="true"
      />
      <span className="text-sm text-gray-700 transition-all">{STEPS[stepIndex].message}</span>
    </div>
  )
}
