import {
  MapPin,
  Briefcase,
  Phone,
  BadgeCheck,
  BookOpen,
  ChevronDown,
} from "lucide-react";

/**
 * How to Use Section
 *
 * Renders both mobile (horizontal step indicators) and
 * desktop (vertical sidebar with step details) variants.
 *
 * Fully self-contained - no external state needed.
 */

export function HowToUseMobile() {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-bold text-gray-900 tracking-tight mb-3">How to Use</h2>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-5">
        <div className="flex items-start justify-between">

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center flex-1 gap-1.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-gray-800 leading-tight">Select<br/>Town</span>
          </div>

          {/* Connector */}
          <div className="flex items-center pt-3.5 text-gray-300">
            <div className="w-4 h-px bg-gray-200" />
            <ChevronDown className="h-3 w-3 -rotate-90 -mx-0.5" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center flex-1 gap-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-800 leading-tight">Choose<br/>Work</span>
          </div>

          {/* Connector */}
          <div className="flex items-center pt-3.5 text-gray-300">
            <div className="w-4 h-px bg-gray-200" />
            <ChevronDown className="h-3 w-3 -rotate-90 -mx-0.5" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center flex-1 gap-1.5">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Phone className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-800 leading-tight">Call<br/>Directly</span>
          </div>

          {/* Connector */}
          <div className="flex items-center pt-3.5 text-gray-300">
            <div className="w-4 h-px bg-gray-200" />
            <ChevronDown className="h-3 w-3 -rotate-90 -mx-0.5" />
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center flex-1 gap-1.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <BadgeCheck className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-gray-800 leading-tight">Hire &<br/>Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowToUseDesktop() {
  return (
    <aside className="hidden lg:block lg:col-span-3" id="how-to-use-desktop">
      <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm flex flex-col gap-5 sticky top-24">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
          <BookOpen className="h-4 w-4 text-primary" />
          How to Use
        </h2>

        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-gray-100" />

          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/10 shadow-sm">1</div>
            <div className="pt-0.5">
              <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary/80" /> Select Your Town
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Choose your location to find local workers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-100 shadow-sm">2</div>
            <div className="pt-0.5">
              <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-emerald-500" /> Choose the Work
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Select the type of work you need help with.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center border border-purple-100 shadow-sm">3</div>
            <div className="pt-0.5">
              <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-purple-500" /> Call Directly
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Contact the worker directly and discuss.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-100 shadow-sm">4</div>
            <div className="pt-0.5">
              <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-orange-500" /> Hire & Get it Done
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">Hire the best worker and get the job done.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
