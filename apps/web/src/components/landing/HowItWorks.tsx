const steps = [
  {
    number: '01',
    title: 'Ask Anything',
    description: 'Type your training question - program design, technique, nutrition, or recovery.',
  },
  {
    number: '02',
    title: 'AI Searches Knowledge Base',
    description: 'Your question is matched against our curated database of training articles and research.',
  },
  {
    number: '03',
    title: 'Get Cited Answers',
    description: 'Receive evidence-based responses with sources you can verify and explore further.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Powered by RAG (Retrieval-Augmented Generation) for accurate, sourced information.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
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
