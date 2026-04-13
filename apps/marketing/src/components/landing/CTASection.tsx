import Link from 'next/link';

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3002';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#f7f9fb] to-[#f0eeff] dark:from-[#0a0a0f] dark:to-[#141420]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] dark:text-[#e8e8f0]">
          Ready to Calculate Smarter?
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Jump right in — no account needed. Sign up later to unlock cloud sync and scientific mode.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={WEB_APP_URL}
            className="px-8 py-3 bg-[#392cc1] hover:bg-[#534ad9] text-white font-semibold rounded-full text-lg transition-colors shadow-lg shadow-[#392cc1]/30 text-center"
          >
            Try Free
          </a>
          <Link
            href="/pricing"
            className="px-8 py-3 bg-white dark:bg-[#1a1a2e] hover:bg-gray-50 dark:hover:bg-[#1e1e32] text-[#191c1e] dark:text-[#e8e8f0] font-semibold rounded-full text-lg transition-colors border border-gray-200 dark:border-[#252540] text-center"
          >
            View Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
