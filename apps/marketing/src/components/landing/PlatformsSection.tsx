const platforms = [
  {
    name: 'Web',
    icon: '🌐',
    description: 'Use directly in your browser',
    url: 'https://app.omnicalc.app',
  },
  { name: 'iOS', icon: '🍎', description: 'App Store', url: '#' },
  { name: 'Android', icon: '🤖', description: 'Google Play', url: '#' },
  { name: 'Windows', icon: '🪟', description: '.exe installer', url: '#' },
  { name: 'macOS', icon: '💻', description: '.dmg installer', url: '#' },
  { name: 'Linux', icon: '🐧', description: '.AppImage', url: '#' },
];

export function PlatformsSection() {
  return (
    <section className="py-24 bg-[#f7f9fb] dark:bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] dark:text-[#e8e8f0]">
            Available Everywhere
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            One account, all your devices. Seamless sync across platforms.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-[#141420] border border-gray-100 dark:border-[#1a1a2e] hover:border-[#392cc1]/30 dark:hover:border-[#c3c0ff]/30 transition-colors group"
            >
              <div className="text-4xl mb-3">{platform.icon}</div>
              <h3 className="text-sm font-bold text-[#191c1e] dark:text-[#e8e8f0] group-hover:text-[#392cc1] dark:group-hover:text-[#c3c0ff] transition-colors">
                {platform.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {platform.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
