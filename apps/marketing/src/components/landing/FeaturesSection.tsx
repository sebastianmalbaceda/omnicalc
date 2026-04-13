const features = [
  {
    icon: '🧮',
    title: 'Precision Math',
    description: 'Powered by decimal.js — no floating-point errors. 0.1 + 0.2 = 0.3, always.',
  },
  {
    icon: '☁️',
    title: 'Cloud Tape',
    description:
      'Your calculation history syncs across all devices. Never lose a calculation again.',
  },
  {
    icon: '🔬',
    title: 'Scientific Functions',
    description: 'Trigonometry, logarithms, powers, factorials, and mathematical constants.',
  },
  {
    icon: '🌓',
    title: 'Dark & Light Themes',
    description: 'Beautiful themes that adapt to your system preference or manual selection.',
  },
  {
    icon: '🔒',
    title: 'Secure Auth',
    description: 'Email/password or sign in with Google/GitHub. Your data stays protected.',
  },
  {
    icon: '📱',
    title: 'Cross-Platform',
    description: 'Web, iOS, Android, Windows, macOS, Linux — one account, everywhere.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] dark:text-[#e8e8f0]">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Built for professionals, designed for everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-[#f7f9fb] dark:bg-[#141420] border border-gray-100 dark:border-[#1a1a2e] hover:border-[#392cc1]/30 dark:hover:border-[#c3c0ff]/30 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[#191c1e] dark:text-[#e8e8f0] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
