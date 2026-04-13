import { redirect } from 'next/navigation';

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3002';

export const metadata = {
  title: 'Sign In — OmniCalc',
  description: 'Sign in to your OmniCalc account.',
};

export default function SignInPage() {
  redirect(`${WEB_APP_URL}/#/login`);
}
