const features = [
  {
    icon: '🏋️',
    title: 'Programmes Sur Mesure',
    description: 'Obtiens des programmes personnalisés selon tes objectifs, ton expérience et ton équipement disponible.',
  },
  {
    icon: '📚',
    title: 'Basé sur la Science',
    description: 'Conseils fondés sur la recherche scientifique et les meilleures sources comme Stronger By Science.',
  },
  {
    icon: '🎯',
    title: 'Conseils Techniques',
    description: 'Apprends la bonne forme et les bons repères pour les mouvements composés et d\'isolation.',
  },
  {
    icon: '🔄',
    title: 'Surcharge Progressive',
    description: 'Comprends la périodisation, les deloads et comment continuer à progresser sur le long terme.',
  },
  {
    icon: '😴',
    title: 'Conseils Récupération',
    description: 'Optimise ton sommeil, ton timing nutritionnel et tes jours de repos pour maximiser tes gains.',
  },
  {
    icon: '🛡️',
    title: 'Prévention Blessures',
    description: 'Apprends les bonnes pratiques d\'entraînement et comment t\'adapter à tes limitations.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment <span className="text-gradient">IronCoach</span> Peut T&apos;Aider ?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Du débutant complet au pratiquant avancé, obtiens des conseils adaptés à ton niveau.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-gradient p-6 rounded-2xl border border-[var(--border-color)] 
                         hover:border-red-900/50 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--text-secondary)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
