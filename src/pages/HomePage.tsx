import { Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const tools = [
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Konsulthjälpen
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Verktyg och kalkylatorer för att underlätta din vardag som konsult
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.route}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {tool.name}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Öppna verktyget
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
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
