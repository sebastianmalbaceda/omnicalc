import Link from 'next/link';

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3002';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0eeff] to-[#f7f9fb] dark:from-[#0a0a0f] dark:to-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#191c1e] dark:text-[#e8e8f0]">
            Precision Calculator
            <br />
            <span className="text-[#392cc1] dark:text-[#c3c0ff]">for Every Platform</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional-grade calculations with cloud sync, scientific functions, and seamless
            cross-platform experience. Free to start, powerful when you need it.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WEB_APP_URL}
              className="px-8 py-3 bg-[#392cc1] hover:bg-[#534ad9] text-white font-semibold rounded-full text-lg transition-colors shadow-lg shadow-[#392cc1]/30 text-center"
            >
              Try Free
            </a>
            <Link
              href="/downloads"
              className="px-8 py-3 bg-white dark:bg-[#1a1a2e] hover:bg-gray-50 dark:hover:bg-[#1e1e32] text-[#191c1e] dark:text-[#e8e8f0] font-semibold rounded-full text-lg transition-colors border border-gray-200 dark:border-[#252540] text-center"
            >
              Download App
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
            <span>✓ No account required</span>
            <span>✓ Free forever</span>
            <span>✓ All platforms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
