import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-[#1a1a2e] bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#392cc1] dark:hover:text-[#c3c0ff]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/downloads"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#392cc1] dark:hover:text-[#c3c0ff]"
                >
                  Downloads
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Platforms</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Web App</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">iOS & Android</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Windows, macOS, Linux
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">About</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Blog</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#1a1a2e] text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} OmniCalc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
