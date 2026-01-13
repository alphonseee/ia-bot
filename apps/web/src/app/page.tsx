import Link from 'next/link';

const questions = [
  "Programme full body 3j/semaine",
  "Corriger ma posture au squat",
  "Combien de protéines par jour ?",
  "Exercices sans matériel",
  "Comment progresser au développé couché",
  "Récupération après une blessure",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold">IronCoach</span>
          <Link 
            href="/chat"
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            Ouvrir le chat →
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Ton coach musculation IA,<br />
            <span className="text-text-muted">disponible 24/7.</span>
          </h1>
          
          <p className="text-lg text-text-muted mb-10 max-w-xl">
            Pose tes questions sur l&apos;entraînement, la technique, les programmes. 
            Obtiens des réponses claires basées sur des sources fiables.
          </p>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            Commencer maintenant
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-8">
            Essaie de demander
          </h2>
          
          <div className="grid gap-3">
            {questions.map((q) => (
              <Link
                key={q}
                href={`/chat?q=${encodeURIComponent(q)}`}
                className="group flex items-center justify-between p-4 bg-bg-alt rounded-lg border border-border hover:border-accent/50 transition-colors"
              >
                <span className="text-text">{q}</span>
                <span className="text-text-muted group-hover:text-accent transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-8">
            Comment ça marche
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-accent mb-3">01</div>
              <h3 className="font-medium mb-2">Tu poses ta question</h3>
              <p className="text-sm text-text-muted">
                En français, comme tu parlerais à un coach.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-3">02</div>
              <h3 className="font-medium mb-2">L&apos;IA cherche</h3>
              <p className="text-sm text-text-muted">
                Dans une base d&apos;articles et guides de musculation.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-3">03</div>
              <h3 className="font-medium mb-2">Tu reçois ta réponse</h3>
              <p className="text-sm text-text-muted">
                Avec les sources pour vérifier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-8">
            Ce que je peux t&apos;aider à faire
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Programmes", desc: "Full body, PPL, split... adaptés à ton niveau" },
              { title: "Technique", desc: "Corriger ta forme sur les mouvements" },
              { title: "Nutrition", desc: "Protéines, calories, timing des repas" },
              { title: "Récupération", desc: "Sommeil, deload, gestion des douleurs" },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-bg-alt rounded-lg border border-border">
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm text-text-muted">
          <span>IronCoach © 2026</span>
          <span>Pas un avis médical.</span>
        </div>
      </footer>
    </main>
  );
}
