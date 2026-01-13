import Link from 'next/link';

const prompts = [
  "Crée-moi un programme push/pull/legs sur 4 jours",
  "Comment corriger le buttwink au squat ?",
  "Quelle quantité de protéines pour prendre du muscle ?",
  "À quelle fréquence faire un deload ?",
  "Meilleurs exercices pour les épaules",
  "Comment m'entraîner avec une douleur au bas du dos",
];

export function SamplePrompts() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Essaie Ces <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Commence avec des questions populaires de la communauté.
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
            Commencer la Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
