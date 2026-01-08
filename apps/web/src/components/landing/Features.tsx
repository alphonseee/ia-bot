const features = [
  {
    icon: '🏋️',
    title: 'Custom Programs',
    description: 'Get personalized training programs based on your goals, experience, and available equipment.',
  },
  {
    icon: '📚',
    title: 'Evidence-Based',
    description: 'Advice grounded in sports science from trusted sources like Stronger By Science and peer-reviewed research.',
  },
  {
    icon: '🎯',
    title: 'Technique Guidance',
    description: 'Learn proper form and technique cues for compound lifts and isolation exercises.',
  },
  {
    icon: '🔄',
    title: 'Progressive Overload',
    description: 'Understand periodization, deloads, and how to keep making gains long-term.',
  },
  {
    icon: '😴',
    title: 'Recovery Advice',
    description: 'Optimize sleep, nutrition timing, and rest days to maximize muscle growth.',
  },
  {
    icon: '🛡️',
    title: 'Injury Prevention',
    description: 'Learn safe training practices and how to work around limitations.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Can <span className="text-gradient">IronCoach</span> Help With?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            From complete beginners to advanced lifters, get guidance tailored to your level.
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
