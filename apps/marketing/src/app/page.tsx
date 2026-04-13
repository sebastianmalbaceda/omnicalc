import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PlatformsSection } from '@/components/landing/PlatformsSection';
import { CTASection } from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PlatformsSection />
      <CTASection />
    </>
  );
}
