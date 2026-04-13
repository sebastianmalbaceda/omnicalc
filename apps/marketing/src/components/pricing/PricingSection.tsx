'use client';

import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for everyday calculations',
    features: [
      'Basic arithmetic (+, −, ×, ÷)',
      'Percentage & sign toggle',
      'Memory functions (M+, M−, MR, MC)',
      'Light & Dark themes',
      'Anonymous usage — no account needed',
    ],
    cta: 'Start Free',
    href: '/sign-up',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'For professionals and power users',
    features: [
      'Everything in Free',
      'Scientific functions (sin, cos, tan, log, ln)',
      'Powers, roots, factorials, constants',
      'Cloud Tape — history sync across devices',
      'Parentheses for complex expressions',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    href: '/sign-up',
    highlighted: true,
  },
  {
    name: 'Pro Annual',
    price: '$39.99',
    period: '/year',
    description: 'Save 33% with annual billing',
    features: [
      'Everything in Pro Monthly',
      '33% savings vs monthly',
      'One payment per year',
      'Cancel anytime',
    ],
    cta: 'Go Annual',
    href: '/sign-up',
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] dark:text-[#e8e8f0]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start free. Upgrade when you need more power.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border ${
                plan.highlighted
                  ? 'border-[#392cc1] dark:border-[#c3c0ff] bg-[#f0eeff] dark:bg-[#141420] shadow-xl shadow-[#392cc1]/10'
                  : 'border-gray-200 dark:border-[#1a1a2e] bg-white dark:bg-[#0a0a0f]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#392cc1] text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-lg font-bold text-[#191c1e] dark:text-[#e8e8f0]">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#191c1e] dark:text-[#e8e8f0]">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-[#392cc1] dark:text-[#c3c0ff] mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 block w-full py-3 text-center font-semibold rounded-full transition-colors ${
                  plan.highlighted
                    ? 'bg-[#392cc1] hover:bg-[#534ad9] text-white'
                    : 'bg-[#f7f9fb] dark:bg-[#1a1a2e] hover:bg-gray-100 dark:hover:bg-[#1e1e32] text-[#191c1e] dark:text-[#e8e8f0] border border-gray-200 dark:border-[#252540]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
