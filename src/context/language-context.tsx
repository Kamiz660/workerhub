"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "../locales/en";
import { ml } from "../locales/ml";

export type Language = "en" | "ml";

const dictionaries = {
  en,
  ml,
};

type DeepKey<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${DeepKey<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

type TranslationKey = DeepKey<typeof en>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage after mount
  useEffect(() => {
    const savedLang = localStorage.getItem("workerhub-lang") as Language;
    if (savedLang === "en" || savedLang === "ml") {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("workerhub-lang", lang);
  };

  // Dot-notation translation helper with simple template variable replacement
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let current: any = dictionaries[language];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English dictionary if key missing in Malayalam
        let fallback: any = dictionaries["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // return key as final fallback
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== "string") {
      return key;
    }

    // Replace variables in format {varName}
    let result = current;
    if (variables) {
      Object.entries(variables).forEach(([name, value]) => {
        result = result.replace(new RegExp(`{${name}}`, "g"), String(value));
      });
    }

    return result;
  };

  // Avoid hydrations mismatch by rendering children with default 'en' state initially
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
