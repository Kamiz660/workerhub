"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const locationsEn = ["Koothattukulam", "Muvattupuzha", "Piravom", "Thodupuzha", "Perumbavoor", "Kolenchery"];
const locationsMl = ["കൂത്താട്ടുകുളം", "മൂവാറ്റുപുഴ", "പിറവം", "തൊടുപുഴ", "പെരുമ്പാവൂർ", "കോലഞ്ചേരി"];

const servicesEn = ["Electricians", "Plumbers", "Carpenters", "Painters", "Technicians"];
const servicesMl = ["ഇലക്ട്രീഷ്യൻ", "പ്ലംബർ", "കാർപെന്റർ", "പെയിന്റർ", "ടെക്നീഷ്യൻ"];

const companyEn = ["About Us", "How It Works", "For Workers", "Contact"];
const companyMl = ["ഞങ്ങളെക്കുറിച്ച്", "പ്രവർത്തിക്കുന്ന വിധം", "തൊഴിലാളികൾക്കായി", "ബന്ധപ്പെടുക"];

export function Footer() {
  const { language, t } = useLanguage();

  const services = language === "en" ? servicesEn : servicesMl;
  const locations = language === "en" ? locationsEn : locationsMl;
  const company = language === "en" ? companyEn : companyMl;

  const desc = language === "en"
    ? "Find trusted local workers for your home and business needs in Koothattukulam and surrounding areas."
    : "കൂത്താട്ടുകുളത്തും സമീപ പ്രദേശങ്ങളിലുമുള്ള വിശ്വസ്തരായ തൊഴിലാളികളെ നിങ്ങളുടെ ആവശ്യങ്ങൾക്കായി കണ്ടെത്തൂ.";

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left flex flex-col items-center sm:items-start">
            <Link href="/" className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                Worker<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {language === "en" ? "Services" : "സേവനങ്ങൾ"}
            </h3>
            <ul className="space-y-2">
              {services.map((service, index) => {
                const searchVal = servicesEn[index].toLowerCase().slice(0, -1);
                return (
                  <li key={service}>
                    <Link
                      href={`/workers?category=${searchVal}`}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {service}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {language === "en" ? "Company" : "കമ്പനി"}
            </h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {language === "en" ? "Locations" : "സ്ഥലങ്ങൾ"}
            </h3>
            <ul className="space-y-2">
              {locations.map((location, index) => {
                const searchVal = locationsEn[index];
                return (
                  <li key={location}>
                    <Link
                      href={`/workers?search=${searchVal}`}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {location}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} WorkerHub. {language === "en" ? "All rights reserved." : "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം."}
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-400 cursor-default">
              {language === "en" ? "Privacy" : "സ്വകാര്യത"}
            </span>
            <span className="text-sm text-gray-400 cursor-default">
              {language === "en" ? "Terms" : "വ്യവസ്ഥകൾ"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
