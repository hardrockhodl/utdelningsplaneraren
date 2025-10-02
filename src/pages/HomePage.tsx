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
      color: '#27b423',
    },
    {
      id: 'utdelningsplaneraren',
      name: 'Utdelningsplaneraren',
      description: 'Planera din lön, skatt och utdelning som konsult. Optimera din ekonomi över flera år med hänsyn till 3:12-reglerna.',
      icon: Calculator,
      route: '/utdelningsplaneraren',
      color: '#0f92e9',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#1c1c1c]">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="bg-white dark:bg-[#3a3a3a] rounded-md border border-[#e0e0e0] dark:border-[#3a3a3a] p-[18px]">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1c1c1c] dark:text-[#f7f8fa] mb-3">
            Om Konsulthjälpen
          </h2>
          <p className="text-[13px] text-[#70757a] dark:text-[#9ca3af] leading-[1.5]">
            Konsulthjälpen är en samling verktyg designade för att göra livet enklare för dig som driver eget konsultbolag.
            Alla verktyg är gratis att använda och kräver ingen registrering. Din data sparas lokalt i din webbläsare.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-[14px] mb-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.route}
                aria-label={`Öppna ${tool.name}`}
                className="group bg-white dark:bg-[#3a3a3a] rounded-md border border-[#e0e0e0] dark:border-[#3a3a3a]
                          hover:border-[#0f92e9] dark:hover:border-[#0f92e9] transition-all duration-200
                          hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f92e9]">
                <div className="p-[18px]">
                  <div className="flex items-center justify-center w-12 h-12 rounded-md mb-4"
                       style={{ backgroundColor: `${tool.color}33` }}>
                    <Icon className="w-5 h-5" style={{ color: tool.color }} />
                  </div>

                  <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1c1c1c] dark:text-[#f7f8fa] mb-2">
                    {tool.name}
                  </h3>

                  <p className="text-[13px] text-[#70757a] dark:text-[#9ca3af] mb-4 leading-[1.5]">
                    {tool.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0f92e9]
                                  group-hover:translate-x-1 transition-transform duration-200">
                    Öppna verktyget
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
