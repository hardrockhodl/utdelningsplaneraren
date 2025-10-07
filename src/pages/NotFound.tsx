import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#1c1c1c] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[#0f92e9] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-[#1c1c1c] dark:text-[#f7f8fa] mb-4">
            Sidan hittades inte
          </h2>
          <p className="text-[#70757a] dark:text-[#9ca3af] mb-8">
            Sidan du letar efter finns inte eller har flyttats.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3
                     bg-[#0f92e9] text-white rounded-md font-medium
                     hover:bg-[#0d7ec9] transition-colors duration-200
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f92e9]"
          >
            <Home className="w-5 h-5" />
            Tillbaka till startsidan
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3
                     bg-white dark:bg-[#3a3a3a] text-[#1c1c1c] dark:text-[#f7f8fa]
                     border border-[#e0e0e0] dark:border-[#3a3a3a] rounded-md font-medium
                     hover:border-[#0f92e9] dark:hover:border-[#0f92e9] transition-colors duration-200
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f92e9]"
          >
            <Search className="w-5 h-5" />
            Se alla verktyg
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-[#70757a] dark:text-[#9ca3af] mb-3">
            Populära verktyg:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/lon-efter-skatt"
              className="text-sm px-3 py-1 bg-white dark:bg-[#3a3a3a]
                       text-[#0f92e9] rounded-md border border-[#e0e0e0]
                       dark:border-[#3a3a3a] hover:border-[#0f92e9]
                       transition-colors duration-200"
            >
              Lön efter skatt
            </Link>
            <Link
              to="/fakturera-ratt-timpris"
              className="text-sm px-3 py-1 bg-white dark:bg-[#3a3a3a]
                       text-[#0f92e9] rounded-md border border-[#e0e0e0]
                       dark:border-[#3a3a3a] hover:border-[#0f92e9]
                       transition-colors duration-200"
            >
              Timpris
            </Link>
            <Link
              to="/formansbil"
              className="text-sm px-3 py-1 bg-white dark:bg-[#3a3a3a]
                       text-[#0f92e9] rounded-md border border-[#e0e0e0]
                       dark:border-[#3a3a3a] hover:border-[#0f92e9]
                       transition-colors duration-200"
            >
              Förmånsbil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
