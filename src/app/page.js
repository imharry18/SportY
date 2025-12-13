/**
 * Professional Starter Page for Next.js Projects
 * * This is the main homepage component.
 * It's structured with a Header, Main (Hero), and Footer.
 * Designed to be a reusable, impressive boilerplate.
 * * @author Harry
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-black/30 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo / Name */}
          <a
            href="#"
            className="text-2xl font-bold tracking-tight text-slate-100 transition-colors hover:text-blue-400"
          >
            Harry<span className="text-blue-400">.</span>
          </a>


        </nav>
      </header>

      {/* Main Content (Hero) */}
      <main className="relative flex flex-grow flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
        {/* Background Glow Effect */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 grid place-items-center"
        >
          <div className="absolute top-1/2 left-1/2 h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/20 opacity-70 blur-[120px]" />
        </div>

        {/* Animated Content Wrapper */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-100 md:text-7xl">
            I’m{' '}
            {/* Gradient "techy" text */}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Harry
            </span>
          </h1>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400 md:text-2xl">
            Turning ideas into reality, one line of code at a time.
          </p>
        </div>
        
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800/50">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Harry. Built with Next.js & Tailwind CSS.
        </div>
      </footer>
    </div>
  );
}