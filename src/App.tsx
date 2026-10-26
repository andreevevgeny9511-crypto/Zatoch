import { useState, useEffect, useRef } from 'react'

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showInstallHint, setShowInstallHint] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function getTimeLeft() {
    const now = new Date()
    const target = new Date(now.getFullYear(), 11, 20, 19, 0, 0)
    if (target < now) {
      target.setFullYear(target.getFullYear() + 1)
    }
    const diff = target.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Check if running as standalone (installed PWA)
    const isStandaloneApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    setIsStandalone(isStandaloneApp)

    // Show install hint for iOS users who haven't installed yet
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (isIOS && !isStandaloneApp) {
      const timer = setTimeout(() => setShowInstallHint(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setFileName(file.name)
      } else {
        alert('Пожалуйста, загрузите PDF файл')
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setFileName(file.name)
    } else if (file) {
      alert('Пожалуйста, загрузите PDF файл')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex flex-col items-center justify-center p-4 pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Stars/sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              top: `${(i * 37 + 13) % 100}%`,
              left: `${(i * 53 + 7) % 100}%`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i % 5) * 0.4}s`,
              opacity: 0.3 + (i % 4) * 0.1,
            }}
          />
        ))}
      </div>

      {/* iOS Install Hint */}
      {showInstallHint && !isStandalone && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="bg-gray-900/95 backdrop-blur-xl border-t border-purple-500/30 px-4 py-4 pb-8 safe-area-bottom">
            <div className="max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">📲</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm mb-1">
                    Добавь на рабочий стол!
                  </p>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Нажми <span className="inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-white">
                      <ShareIcon /> Поделиться
                    </span> → <span className="text-purple-300 font-medium">«На экран Домой»</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowInstallHint(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Guitar icon */}
        <div className="mb-6">
          <span className="text-6xl md:text-8xl">🎸</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 mb-4 tracking-tight">
          ЗАТОЧКА
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light">
          Концерт в Кемерово
        </p>
        <p className="text-lg md:text-xl text-purple-300 mb-10 font-medium">
          📅 20 декабря • 🕖 19:00
        </p>

        {/* Countdown */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-6">
            До концерта осталось
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <CountdownBox value={timeLeft.days} label="Дней" />
            <CountdownBox value={timeLeft.hours} label="Часов" />
            <CountdownBox value={timeLeft.minutes} label="Минут" />
            <CountdownBox value={timeLeft.seconds} label="Секунд" />
          </div>
        </div>

        {/* PDF Upload Section */}
        <div className="max-w-md mx-auto">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
              isDragging
                ? 'border-yellow-400 bg-yellow-400/10 scale-105'
                : fileName
                ? 'border-green-400 bg-green-400/10'
                : 'border-purple-400/50 bg-white/5 hover:border-purple-400 hover:bg-white/10'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {fileName ? (
              <div className="text-center">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-green-300 font-semibold text-lg mb-1">Билет загружен!</p>
                <p className="text-gray-400 text-sm truncate">{fileName}</p>
                <p className="text-purple-300 text-xs mt-3">Нажмите, чтобы заменить файл</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-3">🎫</div>
                <p className="text-purple-200 font-semibold text-lg mb-1">
                  Билет для Жени
                </p>
                <p className="text-gray-400 text-sm">
                  Перетащите PDF сюда или нажмите для выбора
                </p>
                <div className="mt-4 inline-block px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-200 text-sm">
                  📄 Загрузить PDF
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Install button for non-iOS or always visible fallback */}
        {!isStandalone && (
          <div className="mt-8 max-w-sm mx-auto">
            <InstallButton />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>🔥 Готовимся к самому зажигательному концерту! 🔥</p>
        </div>
      </div>
    </div>
  )
}

function InstallButton() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/.test(navigator.userAgent)

  return (
    <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📱</span>
        <div className="text-left flex-1">
          <p className="text-purple-200 text-sm font-medium">
            {isIOS
              ? 'Добавь на экран iPhone!'
              : isAndroid
              ? 'Установи как приложение!'
              : 'Добавь на рабочий стол!'
            }
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {isIOS
              ? 'Safari → Поделиться → На экран «Домой»'
              : isAndroid
              ? 'Меню Chrome → «Добавить на главный экран»'
              : 'Открой на телефоне для установки'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 md:p-6">
        <div className="text-3xl md:text-5xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm text-purple-300 mt-2 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  )
}

export default App
