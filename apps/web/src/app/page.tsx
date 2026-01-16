import Link from "next/link";
import Image from "next/image";

const questions = [
  { label: "Programme full body 3j/semaine", category: "Programme" },
  { label: "Corriger ma posture au squat", category: "Technique" },
  { label: "Combien de protéines par jour ?", category: "Nutrition" },
  { label: "Exercices sans matériel", category: "Programme" },
  { label: "Comment progresser au développé couché", category: "Progression" },
  { label: "Récupération après une blessure", category: "Récupération" },
];

const benefits = [
  {
    title: "Programmes adaptés",
    desc: "Séances structurées en fonction de ton niveau, de ton matériel et de ton emploi du temps.",
  },
  {
    title: "Technique & cues",
    desc: "Consignes claires pour mieux sentir les muscles cibles et éviter les compensations.",
  },
  {
    title: "Progression / surcharge",
    desc: "Suivi des charges, conseils de progression et ajustements semaine après semaine.",
  },
  {
    title: "Nutrition simple",
    desc: "Objectifs protéines / calories, idées de repas et rappels des bases sans jargon.",
  },
  {
    title: "Récupération & prévention",
    desc: "Sommeil, deloads, gestion des douleurs légères et prévention des blessures.",
  },
  {
    title: "Gain de temps & clarté",
    desc: "Fini les heures sur YouTube : réponses synthétiques et actionnables en quelques secondes.",
  },
];

const profiles = [
  {
    title: "Débutant complet",
    bullets: [
      "Tu veux démarrer sans te blesser",
      "Tu es un peu perdu entre toutes les infos",
      "Tu veux un plan clair pour 2-3 mois",
    ],
  },
  {
    title: "Intermédiaire",
    bullets: [
      "Tu stagnes sur certains mouvements",
      "Tu veux structurer ta progression",
      "Tu veux optimiser ton volume / intensité",
    ],
  },
  {
    title: "Reprise après pause",
    bullets: [
      "Tu reviens après plusieurs mois/années",
      "Tu veux éviter les courbatures extrêmes",
      "Tu veux reprendre en douceur mais efficacement",
    ],
  },
];

const steps = [
  {
    step: "01",
    title: "Tu expliques ta situation",
    desc: "Objectif, niveau, matériel, contraintes… comme si tu parlais à un coach humain.",
  },
  {
    step: "02",
    title: "Hephaestus analyse & structure",
    desc: "L'IA s'appuie sur des guides fiables de musculation, d'anatomie et de nutrition.",
  },
  {
    step: "03",
    title: "Tu reçois un plan actionnable",
    desc: "Programme, recommandations concrètes, points de vigilance et pistes de progression.",
  },
  {
    step: "04",
    title: "Tu ajustes en continu",
    desc: "Tu peux revenir après chaque séance pour adapter, corriger et affiner.",
  },
];

const testimonials = [
  {
    name: "Julien, 28 ans",
    goal: "Prendre du muscle en restant sec",
    result:
      "« En 6 semaines j'ai repris un rythme régulier et je progresse enfin au développé couché. Le fait de pouvoir poser des questions après chaque séance m'a vraiment aidé. »",
  },
  {
    name: "Sarah, 34 ans",
    goal: "Reprise après grossesse",
    result:
      "« Hephaestus m'a proposé un plan progressif avec beaucoup de pédagogie. Je me sens encadrée sans pression, et je sais quoi faire à chaque séance. »",
  },
  {
    name: "Amine, 22 ans",
    goal: "Structurer son entraînement",
    result:
      "« Je faisais un peu tout au feeling. Maintenant j'ai un programme clair, avec des explications simples sur la technique et la progression. »",
  },
];

const faqs = [
  {
    question: "Est-ce personnalisé ?",
    answer:
      "Oui. Les réponses s'adaptent à ton niveau, à ton matériel, à ton objectif et au temps dont tu disposes. Plus tu donnes de contexte, plus Hephaestus peut te guider précisément.",
  },
  {
    question: "Les sources sont-elles fiables ?",
    answer:
      "Hephaestus s'appuie sur une sélection de ressources sérieuses (guides de musculation, articles de référence, consensus scientifiques) et affiche les sources utilisées pour chaque réponse importante.",
  },
  {
    question: "Quel matériel est requis ?",
    answer:
      "Aucun matériel n'est obligatoire. Tu peux demander un programme sans matériel, avec haltères, élastiques, salle de sport complète… Hephaestus s'adapte à ce que tu as réellement.",
  },
  {
    question: "Et si j'ai une blessure ou une douleur ?",
    answer:
      "Hephaestus peut t'aider à adapter ton entraînement (variantes, réduction de volume, etc.), mais ne remplace jamais un avis médical. En cas de douleur inhabituelle ou persistante, il faut consulter un professionnel de santé.",
  },
  {
    question: "C'est adapté aux débutants ?",
    answer:
      "Oui, c'est même une des priorités. Le ton reste simple, pédagogique et rassurant, avec des explications pas-à-pas pour les mouvements clés.",
  },
  {
    question: "C'est gratuit ou payant ?",
    answer:
      "Une première version est en préparation. Le modèle économique (gratuit / payant) sera annoncé bientôt, mais tu peux déjà tester le chat gratuitement pendant la phase de lancement.",
  },
];

const PlusIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
  </svg>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-text relative">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hero-ironcoach-gym.jpg"
          alt="Coach sportif expliquant un exercice à un robot IA"
          fill
          priority
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/40 backdrop-blur-sm border-b border-border/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Retour à l'accueil Hephaestus"
          >
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-accent/80 to-accent/40 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform">
              H
            </span>
            <span className="text-lg font-semibold tracking-tight">Hephaestus</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="#demo" className="text-text-muted hover:text-text transition-colors">
              Démo
            </Link>
            <Link href="#faq" className="text-text-muted hover:text-text transition-colors">
              FAQ
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-sm font-medium text-white shadow-sm hover:bg-accent/90 transition-colors"
            >
              Ouvrir le chat
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 md:pt-32 pb-16 backdrop-blur-sm px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-bg/40 text-xs font-medium text-accent mb-4 backdrop-blur-sm">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Nouveau • Coach musculation IA 24/7
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 text-white">
                Ton coach musculation IA,
                <span className="block text-slate-200">en français, quand tu veux.</span>
              </h1>

              <p className="text-base md:text-lg text-slate-200/90 mb-8 max-w-xl">
                Pose tes questions sur les programmes, la technique, la nutrition ou la
                récupération. Hephaestus transforme ton contexte en recommandations claires,
                structurées et actionnables.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-sm md:text-base font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-all"
                >
                  Commencer maintenant
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border/70 bg-bg-alt/30 text-sm md:text-base font-medium text-text hover:border-accent/60 hover:text-accent transition-colors backdrop-blur-sm"
                >
                  Voir un exemple
                  <span aria-hidden>⬎</span>
                </Link>
              </div>

              <p className="text-xs text-slate-300">
                Pas un avis médical. Toujours consulter un professionnel de santé en cas de doute.
              </p>
            </div>

            <div className="flex-1 w-full">
              <div className="relative rounded-2xl border border-border/70 bg-bg/40 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.65)] p-4 md:p-5 max-w-md ml-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent">
                      H
                    </span>
                    <div>
                      <p className="text-xs font-medium">Hephaestus</p>
                      <p className="text-[11px] text-text-muted">Toujours disponible</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    En ligne
                  </span>
                </div>

                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-accent text-white px-3 py-2 shadow-sm">
                      <p>
                        Je suis débutant, 3 séances par semaine et accès à une salle. Tu peux me
                        proposer un programme ?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-bg-alt/80 backdrop-blur-sm px-3 py-2 border border-border/80">
                      <p className="font-medium mb-1">Bien sûr !</p>
                      <p className="text-text-muted text-[11px] md:text-xs">
                        On part sur un full body 3x/semaine, avec focus sur les mouvements de base
                        et une progression simple.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="rounded-xl border border-border bg-bg/80 px-2 py-2">
                      <p className="font-semibold mb-1">Jour 1</p>
                      <p className="text-text-muted">
                        Squat, développé couché, tirage horizontal, gainage.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-bg/80 px-2 py-2">
                      <p className="font-semibold mb-1">Jour 2</p>
                      <p className="text-text-muted">
                        Soulevé de terre jambes tendues, développé militaire, tractions assistées.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-bg/80 px-2 py-2">
                      <p className="font-semibold mb-1">Jour 3</p>
                      <p className="text-text-muted">
                        Variantes plus légères + travail technique et core.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl border border-border/80 bg-bg/90 px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                        Sources (exemple)
                      </span>
                      <span className="text-[11px] text-accent">Voir tout</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-text-muted">
                      <li>• Guide pratique de musculation – Delavier &amp; Gundill</li>
                      <li>• Recommandations ACSM pour l'entraînement de force</li>
                      <li>• Articles de revue sur la surcharge progressive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-16 px-6 border-t border-border bg-bg-alt/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.15em] mb-2">
                Démo
              </h2>
              <p className="text-2xl md:text-3xl font-bold">
                À quoi ressemble une réponse d'Hephaestus ?
              </p>
            </div>
            <p className="text-sm text-text-muted max-w-sm">
              Un exemple concret de question qu'un débutant pourrait poser, avec une réponse
              structurée, un mini programme sur 3 jours et des sources affichées.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_minmax(0,1fr)] gap-8 items-start">
            <div className="rounded-2xl border border-border bg-bg/80 backdrop-blur-sm p-5 md:p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
              <div className="text-xs font-medium text-text-muted uppercase tracking-[0.18em] mb-4">
                Exemple de conversation
              </div>
              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-xs font-semibold text-text-muted mb-1">Question</p>
                  <div className="rounded-xl border border-border bg-bg-alt/70 px-3 py-2">
                    Je suis débutant, 3 séances par semaine, 1h max par séance. J'ai accès à une
                    salle classique. Tu peux me faire un programme pour prendre du muscle ?
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-muted mb-1">
                    Réponse d'Hephaestus (extrait)
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border bg-bg-alt px-3 py-3">
                      <p className="font-medium mb-1">1. Structure générale</p>
                      <p className="text-text-muted text-xs">
                        • Fréquence : 3 séances / semaine (ex : lundi, mercredi, vendredi)
                        <br />
                        • Format : full body orienté mouvements de base
                        <br />• Objectif : apprendre la technique, créer une base de force, stimuler
                        tout le corps 3x/semaine.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-bg-alt px-3 py-3">
                      <p className="font-medium mb-1">2. Règles simples de progression</p>
                      <p className="text-text-muted text-xs">
                        • Choisis une plage de répétitions (ex : 8–10 reps)
                        <br />
                        • Quand tu fais 10 reps facilement sur toutes les séries, augmente la charge
                        de 2,5 kg la prochaine séance
                        <br />• Si tu es fatigué ou que la technique se dégrade, reste à la même
                        charge ou diminue légèrement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-bg/80 backdrop-blur-sm p-4 md:p-5">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.2em] mb-3">
                  Mini programme 3 jours (exemple)
                </p>
                <div className="space-y-3 text-xs">
                  <div className="rounded-xl border border-border bg-bg-alt/70 px-3 py-2">
                    <p className="font-semibold mb-1">Jour 1 – Full body A</p>
                    <p className="text-text-muted">
                      Squat, développé couché, tirage horizontal, fentes, gainage.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-bg-alt/70 px-3 py-2">
                    <p className="font-semibold mb-1">Jour 2 – Full body B</p>
                    <p className="text-text-muted">
                      Soulevé de terre jambes tendues, développé militaire, tirage vertical, hip
                      thrust, planche latérale.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-bg-alt/70 px-3 py-2">
                    <p className="font-semibold mb-1">Jour 3 – Technique & volume</p>
                    <p className="text-text-muted">
                      Variantes plus légères des mouvements principaux + travail de gainage et
                      épaules.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-bg/80 backdrop-blur-sm p-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.2em] mb-2">
                  Sources (affichées dans le chat)
                </p>
                <ul className="space-y-1 text-xs text-text-muted">
                  <li>• Recommandations ACSM – résistance et hypertrophie</li>
                  <li>• Méta-analyses sur la fréquence d'entraînement par groupe musculaire</li>
                  <li>• Guides techniques sur squat / développé couché / tirage</li>
                </ul>
              </div>

              <p className="text-[11px] text-text-muted">
                Les exemples ci-dessus sont illustratifs. En situation réelle, Hephaestus adaptera
                le contenu à ton propre contexte.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t backdrop-blur-sm border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-2">
                Idées de questions
              </h2>
              <p className="text-xl font-semibold">Tu peux commencer par…</p>
            </div>
            <p className="hidden md:block text-sm text-text-muted max-w-xs">
              Clique sur une suggestion pour l'envoyer directement dans le chat Hephaestus.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {questions.map((item) => (
              <Link
                key={item.label}
                href={`/chat?q=${encodeURIComponent(item.label)}`}
                className="group flex flex-col items-start gap-2 p-4 rounded-2xl border border-border/70 bg-bg-alt/30 backdrop-blur-sm hover:border-accent/60 hover:bg-bg-alt/40 transition-colors"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 text-[11px] font-medium text-accent border border-accent/30">
                  {item.category}
                </span>
                <p className="text-sm">{item.label}</p>
                <span className="text-xs text-text-muted inline-flex items-center gap-1 group-hover:text-accent mt-1">
                  Poser cette question
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-xs text-text-muted">
            Tu peux aussi simplement décrire ta situation ("je m'entraîne depuis 6 mois, je stagne
            au squat…") et laisser Hephaestus te poser les bonnes questions.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-border bg-bg-alt/15 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-2">
              Pourquoi utiliser Hephaestus ?
            </h2>
            <p className="text-2xl md:text-3xl font-bold">
              Les bénéfices concrets pour ton entraînement
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="relative rounded-2xl border border-border bg-bg/80 backdrop-blur-sm p-4 hover:-translate-y-1 hover:border-accent/70 transition-all duration-200"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <PlusIcon />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-text-muted">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t backdrop-blur-sm border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-2">
              Pour qui ?
            </h2>
            <p className="text-2xl md:text-3xl font-bold">Hephaestus t'aide surtout si…</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {profiles.map((profile) => (
              <div
                key={profile.title}
                className="rounded-2xl border border-border/70 bg-bg-alt/30 backdrop-blur-sm p-4 hover:border-accent/70 transition-colors"
              >
                <p className="text-xs font-semibold text-accent uppercase tracking-[0.18em] mb-2">
                  Profil
                </p>
                <h3 className="font-semibold mb-3">{profile.title}</h3>
                <ul className="space-y-1.5 text-sm text-text-muted">
                  {profile.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-accent/70" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-border bg-bg-alt/15 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-2">
              Comment ça marche
            </h2>
            <p className="text-2xl md:text-3xl font-bold">En quelques étapes simples</p>
          </div>

          <div className="relative">
            <div
              className="hidden md:block absolute left-[18px] top-3 bottom-3 w-px bg-border/60"
              aria-hidden
            />
            <div className="space-y-5">
              {steps.map((s, index) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-9 w-9 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-xs font-semibold text-accent">
                      {s.step}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-bg/80 backdrop-blur-sm p-4 flex-1">
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-text-muted">{s.desc}</p>
                    {index === 0 && (
                      <p className="mt-2 text-xs text-text-muted/80">
                        Exemple : "Je m'entraîne 2 fois par semaine, j'ai des haltères chez moi, je
                        veux surtout renforcer le bas du dos."
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t backdrop-blur-sm border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-2">
              Témoignages (exemples)
            </h2>
            <p className="text-2xl md:text-3xl font-bold">Résultats réalistes, sans bullshit</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border/70 bg-bg-alt/30 backdrop-blur-sm p-4 flex flex-col justify-between"
              >
                <div className="mb-3">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-text-muted">Objectif : {t.goal}</p>
                </div>
                <p className="text-sm text-text-muted mb-3">{t.result}</p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="text-yellow-400" aria-label="4,5 étoiles sur 5">
                    ★★★★☆
                  </span>
                  <span>Résultats sur 6–12 semaines</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-6 border-t border-border bg-bg-alt/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-2">
              FAQ
            </h2>
            <p className="text-2xl md:text-3xl font-bold">Questions fréquentes</p>
          </div>

          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-bg/80 backdrop-blur-sm overflow-hidden"
              >
                <summary className="list-none flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none">
                  <p className="text-sm font-medium">{item.question}</p>
                  <span
                    aria-hidden
                    className="text-xs text-text-muted group-open:rotate-45 transition-transform"
                  >
                    +
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-0 border-t border-border/70 text-sm text-text-muted">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t backdrop-blur-sm border-border">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-accent/5 to-bg-alt/60 px-6 py-8 md:px-8 md:py-10 shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative max-w-xl">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.18em] mb-3">
                Prêt à passer à l'action ?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ouvre le chat et construis ton prochain cycle d'entraînement.
              </h2>
              <p className="text-sm md:text-base text-text-muted mb-6">
                Explique ta situation en quelques phrases, et laisse Hephaestus te proposer un plan
                clair, avec des recommandations techniques, nutrition et récupération.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-sm md:text-base font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 hover:bg-accent/90 transition-all"
                >
                  Ouvrir le chat
                  <span aria-hidden>→</span>
                </Link>
                <p className="text-[11px] text-text-muted max-w-xs">
                  Hephaestus ne remplace pas un médecin, un kiné ou un coach en présentiel. Utilise
                  les réponses comme un support, pas comme un diagnostic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border bg-bg-alt/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="font-medium">Hephaestus © 2026</span>
            <span className="hidden sm:inline-block">•</span>
            <span>Projet en évolution, contenu susceptible de changer.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-text transition-colors">
              Mentions légales
            </Link>
            <Link href="/contact" className="hover:text-text transition-colors">
              Contact
            </Link>
            <Link href="/conditions" className="hover:text-text transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
