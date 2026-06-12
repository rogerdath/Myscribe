export default function Footer() {
  return (
    <footer className="px-4 py-8 border-t border-gray-100">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold text-gray-900">Myscribe</span>
        <div className="flex gap-6">
          <a
            href="/privacy"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
