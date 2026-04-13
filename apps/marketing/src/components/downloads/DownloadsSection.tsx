const downloads = [
  {
    platform: 'Web',
    icon: '🌐',
    description: 'Use instantly in your browser — no installation needed',
    button: 'Open Web App',
    url: 'https://app.omnicalc.app',
    primary: true,
  },
  {
    platform: 'Windows',
    icon: '🪟',
    description: 'Native desktop app for Windows 10/11',
    button: 'Download .exe',
    url: '#',
    primary: false,
  },
  {
    platform: 'macOS',
    icon: '💻',
    description: 'Universal binary for Intel & Apple Silicon',
    button: 'Download .dmg',
    url: '#',
    primary: false,
  },
  {
    platform: 'Linux',
    icon: '🐧',
    description: 'AppImage for most distributions',
    button: 'Download .AppImage',
    url: '#',
    primary: false,
  },
  {
    platform: 'iOS',
    icon: '🍎',
    description: 'iPhone & iPad — optimized for touch',
    button: 'App Store',
    url: '#',
    primary: false,
  },
  {
    platform: 'Android',
    icon: '🤖',
    description: 'Phones & tablets — Material Design',
    button: 'Google Play',
    url: '#',
    primary: false,
  },
];

export function DownloadsSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] dark:text-[#e8e8f0]">
            Download OmniCalc
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Available on every platform. One account, all your devices.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((item) => (
            <div
              key={item.platform}
              className="p-6 rounded-2xl bg-[#f7f9fb] dark:bg-[#141420] border border-gray-100 dark:border-[#1a1a2e]"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#191c1e] dark:text-[#e8e8f0] mb-2">
                {item.platform}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
              <a
                href={item.url}
                className={`inline-block px-6 py-2 font-semibold rounded-full transition-colors ${
                  item.primary
                    ? 'bg-[#392cc1] hover:bg-[#534ad9] text-white'
                    : 'bg-white dark:bg-[#1a1a2e] hover:bg-gray-50 dark:hover:bg-[#1e1e32] text-[#191c1e] dark:text-[#e8e8f0] border border-gray-200 dark:border-[#252540]'
                }`}
              >
                {item.button}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
