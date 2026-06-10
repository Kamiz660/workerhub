import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left flex flex-col items-center sm:items-start">
            <Link href="/" className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                Worker<span className="text-blue-600">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Find trusted local workers for your home and business needs in
              Koothattukulam and surrounding areas.
            </p>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                "Electricians",
                "Plumbers",
                "Carpenters",
                "Painters",
                "Technicians",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href={`/workers?category=${service.toLowerCase().slice(0, -1)}`}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {["About Us", "How It Works", "For Workers", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-500 cursor-default">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Locations */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Locations
            </h3>
            <ul className="space-y-2">
              {[
                "Koothattukulam",
                "Muvattupuzha",
                "Piravom",
                "Thodupuzha",
                "Perumbavoor",
                "Kolenchery",
              ].map((location) => (
                <li key={location}>
                  <Link
                    href={`/workers?search=${location}`}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {location}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} WorkerHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-400 cursor-default">
              Privacy
            </span>
            <span className="text-sm text-gray-400 cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
