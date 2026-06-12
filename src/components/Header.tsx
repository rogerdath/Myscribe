export default function Header() {
  return (
    <header className="px-4 py-4 border-b border-gray-100">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <a href="/" className="text-lg font-bold text-gray-900 tracking-tight">
          Myscribe
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            How it works
          </a>
          <a
            href="#supported"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Supported sites
          </a>
        </nav>
      </div>
    </header>
  )
}
