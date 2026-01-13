import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SamplePrompts } from '@/components/landing/SamplePrompts';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <SamplePrompts />
      
      <footer className="py-8 px-6 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto text-center text-[var(--text-secondary)] text-sm">
          <p>IronCoach IA - À titre informatif uniquement. Consulte toujours un professionnel pour les conseils médicaux.</p>
        </div>
      </footer>
    </main>
  );
}
