import { Gift, ShieldCheck, Phone, Timer } from "lucide-react";

/**
 * Value Propositions Bar
 *
 * Bottom trust/benefit indicators: Free, Trusted, Direct, Quick.
 * Fully self-contained — no external state needed.
 */
export function ValueProps() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white border border-gray-150 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm">
        {/* Badge 1 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 border border-orange-100">
            <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">100% Free</p>
            <p className="text-[10px] sm:text-[11px] text-gray-500">No hidden charges</p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">Local & Trusted</p>
            <p className="text-[10px] sm:text-[11px] text-gray-500">Verified workers</p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">Call Directly</p>
            <p className="text-[10px] sm:text-[11px] text-gray-500">Talk & hire directly</p>
          </div>
        </div>

        {/* Badge 4 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 border border-purple-100">
            <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">Quick & Easy</p>
            <p className="text-[10px] sm:text-[11px] text-gray-500">Save time & effort</p>
          </div>
        </div>
      </div>
    </section>
  );
}
