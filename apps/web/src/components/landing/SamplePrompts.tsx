import Link from 'next/link';

const prompts = [
  "Create a 4-day upper/lower split for intermediate lifters",
  "How do I fix buttwink in my squat?",
  "What's the optimal protein intake for muscle growth?",
  "How often should I deload?",
  "Best exercises for building bigger shoulders",
  "How to train around lower back pain",
];

export function SamplePrompts() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try Asking <span className="text-gradient">These</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Get started with some popular questions from the community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {prompts.map((prompt) => (
            <Link
              key={prompt}
              href={`/chat?q=${encodeURIComponent(prompt)}`}
              className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]
                         hover:border-red-900/50 hover:bg-[var(--bg-secondary)] transition-all
                         text-left text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <span className="text-red-500 mr-2">→</span>
              {prompt}
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/chat"
            className="inline-flex px-8 py-4 bg-red-600 hover:bg-red-700 text-white 
                       font-semibold rounded-xl transition-all duration-200 glow-effect"
          >
            Start Your Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
