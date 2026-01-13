const steps = [
  {
    number: '01',
    title: 'Pose Ta Question',
    description: 'Écris ta question sur l\'entraînement - programmes, technique, nutrition ou récupération.',
  },
  {
    number: '02',
    title: 'L\'IA Cherche',
    description: 'Ta question est comparée à notre base de données d\'articles et recherches sur l\'entraînement.',
  },
  {
    number: '03',
    title: 'Réponse Sourcée',
    description: 'Reçois des réponses basées sur la science avec les sources que tu peux vérifier.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment Ça <span className="text-gradient">Marche</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Propulsé par RAG (Retrieval-Augmented Generation) pour des informations précises et sourcées.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="card-gradient p-8 rounded-2xl border border-[var(--border-color)] text-center relative z-10">
                  <div className="text-5xl font-bold text-gradient mb-4 opacity-50">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
