import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.1)_0%,transparent_40%)]" />
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
                           linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-[var(--text-secondary)]">Propulsé par IA + Entraînement Basé sur la Science</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Ton Coach
          <br />
          <span className="text-gradient">Musculation Personnel</span>
        </h1>

        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
          Obtiens des programmes personnalisés, des conseils techniques et des réponses 
          basées sur les meilleures ressources de musculation et force.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/chat"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl 
                       transition-all duration-200 glow-effect hover:scale-105"
          >
            Commencer le Chat
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] 
                       border border-[var(--border-color)] rounded-xl transition-all duration-200"
          >
            En Savoir Plus
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '24/7', label: 'Disponible' },
            { value: 'RAG', label: 'Augmenté' },
            { value: 'Gratuit', label: 'À Utiliser' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
