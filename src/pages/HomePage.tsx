import { Calculator, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const tools = [
    {
      id: 'lon-efter-skatt',
      name: 'Lön efter skatt',
      description: 'Beräkna din nettolön baserat på bruttolön och kommun. Använder Skatteverkets officiella skattetabeller för exakta beräkningar.',
      icon: Wallet,
      route: '/lon-efter-skatt',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'utdelningsplaneraren',
      name: 'Utdelningsplaneraren',
      description: 'Planera din lön, skatt och utdelning som konsult. Optimera din ekonomi över flera år med hänsyn till 3:12-reglerna.',
      icon: Calculator,
      route: '/utdelningsplaneraren',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900
before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(60rem_40rem_at_80%_-10%,_rgba(59,130,246,0.08),_transparent_60%)]
dark:before:bg-[radial-gradient(60rem_40rem_at_80%_-10%,_rgba(59,130,246,0.12),_transparent_60%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-balance text-slate-900 dark:text-white mb-3">
            Konsulthjälpen
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700
                bg-white/70 dark:bg-slate-900/40 backdrop-blur px-3 py-1 text-sm text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Gratis • Ingen inloggning
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.route}
                aria-label={`Öppna ${tool.name}`}
                className="group relative bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl ring-1 ring-slate-200/60 dark:ring-slate-700/60 transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 motion-safe:hover:-translate-y-0.5">
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.color} ring-1 ring-white/20 backdrop-blur mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {tool.name}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="inline-flex items-center px-3 py-2 rounded-lg text-blue-700 dark:text-blue-300
                                  bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/50
                                  font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Öppna verktyget
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8
                        ring-1 ring-slate-200/60 dark:ring-slate-700/60">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Om Konsulthjälpen
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Konsulthjälpen är en samling verktyg designade för att göra livet enklare för dig som driver eget konsultbolag.
            Alla verktyg är gratis att använda och kräver ingen registrering. Din data sparas lokalt i din webbläsare.
          </p>
        </div>
      </div>
    </div>
  );
}
