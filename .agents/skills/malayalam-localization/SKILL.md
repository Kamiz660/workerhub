---
name: malayalam-localization
description: Guidelines and terminology rules for localizing English copy into natural, modern Malayalam for the WorkerHub project. Used whenever a new sentence needs translation.
---

# Malayalam UX Writing & Localization Skill

Use this skill whenever you need to localize or translate any English copy, buttons, titles, forms, or text blocks into Malayalam for the WorkerHub application.

---

## 1. Core Principle: Localize, Do Not Translate
- **The Malayalam original look:** The goal is to make the website feel like it was originally built and designed for Kerala users.
- **Modern Malayalam:** Prioritize current, natural, everyday Malayalam spoken in modern conversations and digital services in Kerala. Do not use archaic, overly formal, or literary Malayalam.
- **Conversion & Action-Oriented:**
  - Keep CTAs short, clear, and confident.
  - Avoid making buttons longer simply because Malayalam words are longer.
  - *Example:* Instead of a verbose literal "തൊഴിലാളികളെ തിരയുന്നതിനായി ഇവിടെ ക്ലിക്ക് ചെയ്യുക" (Click here to search workers), use a concise and active: "തൊഴിലാളികളെ കണ്ടെത്തുക" (Find Workers).
- **Accessibility & Simplicity:** If a translation reduces comprehension for users with lower literacy or limited technical familiarity, prefer the simpler, more commonly understood wording (even if it is less linguistically precise).

---

## 2. Context-Based Translation
Always translate based on the visual and functional context of the element, not just the raw string:
- **"Register"**
  - If registering a worker: "രജിസ്റ്റർ ചെയ്യുക" or "സേവനം ചേർക്കുക" (Add service).
  - If registering an account/user: "അക്കൗണ്ട് നിർമ്മിക്കുക" (Create account).
- **"Search"**
  - If on a search button: "തിരയുക" (Search) or "കണ്ടെത്തുക" (Find).
  - If as a placeholder: "ഇവിടെ തിരയാം..." (Search here...).
- **"View"**
  - If viewing a profile: "പ്രൊഫൈൽ കാണുക" (View profile).
  - If viewing a list of jobs: "ജോലികൾ കാണുക" (View jobs).

---

## 3. Terminology Glossary (WorkerHub Consistency)
Ensure the same concept uses the same Malayalam term across the entire application:

| English Term | Preferred Malayalam Localization | Context & Usage |
| :--- | :--- | :--- |
| **Worker / Contractor** | തൊഴിലാളി / സേവന ദായകൻ | "തൊഴിലാളി" is widely understood and familiar. |
| **Location / Town** | സ്ഥലം | Common everyday word for location/place. |
| **Profession / Category** | ജോലി / വിഭാഗം | "വിഭാഗം" for list categories, "ജോലി" for the actual job type. |
| **Phone Number** | ഫോൺ നമ്പർ | Transliterated, highly familiar to everyone. |
| **Call / Contact** | വിളിക്കുക / ബന്ധപ്പെടുക | "വിളിക്കുക" (Call) for direct phone/WhatsApp actions. |
| **Verified** | വെരിഫൈഡ് / അംഗീകൃത | Transliterated "വെരിഫൈഡ്" or "അംഗീകൃത" for trusted badges. |
| **Always Free** | എപ്പോഴും സൗജന്യം | Simple and highly trusted pricing label. |
| **List Yourself / Join** | സേവനം രജിസ്റ്റർ ചെയ്യുക | Modern digital onboarding phrase. |

---

## 4. UI/UX & Layout Protection
Malayalam text uses taller characters and runs longer than English. Follow these visual safety rules:
- **Line Heights:** Ensure line-height is at least `leading-relaxed` or `leading-loose` to prevent stacking/clipping of characters.
- **Button Wraps:** Never let button labels wrap to multiple lines. Keep translations to 2–3 words maximum.
- **Audit Checklist:**
  - Check for clipped text or cut-off ligatures.
  - Verify that status badges and text tags do not overflow.
  - Confirm buttons remain fully responsive on mobile layout.
