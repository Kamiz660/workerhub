"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, CheckCircle2, ChevronDown, ChevronUp, Zap, Droplet, Hammer, Paintbrush, Settings, Sparkles, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENTS } from "@/lib/constants";
import {
  addWorker,
  uploadProfilePic,
  validateProfilePic,
  InsertWorkerSchema,
} from "@/lib/workers-api";
import type { WorkerCategory } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

// Note: any type is used for icon to avoid complex Lucide type importing
const CATEGORIES: { value: WorkerCategory; icon: any }[] = [
  { value: "electrician", icon: Zap },
  { value: "plumber", icon: Droplet },
  { value: "carpenter", icon: Hammer },
  { value: "painter", icon: Paintbrush },
  { value: "technician", icon: Settings },
  { value: "cleaner", icon: Sparkles },
  { value: "mason", icon: Hammer },
  { value: "welder", icon: Flame },
];

interface FormErrors {
  [key: string]: string;
}

export function AddWorkerModal() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Form state (Required)
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WorkerCategory>("electrician");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  // Form state (Optional)
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [servicesText, setServicesText] = useState("");

  // Honeypot
  const [hpWebsite, setHpWebsite] = useState("");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for the semantic open event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(EVENTS.OPEN_ADD_WORKER_MODAL, handler);
    return () =>
      window.removeEventListener(EVENTS.OPEN_ADD_WORKER_MODAL, handler);
  }, []);

  function resetForm() {
    setName("");
    setCategory("electrician");
    setLocation("");
    setPhone("");
    
    setProfession("");
    setEmail("");
    setHourlyRate("");
    setExperience("");
    setBio("");
    setServicesText("");
    
    setHpWebsite("");

    setSelectedFile(null);
    setFileError(null);
    setPreviewUrl(null);
    
    setErrors({});
    setSubmitError(null);
    setSuccess(false);
    setShowOptional(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateProfilePic(file);
    if (validationError) {
      setFileError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    // Duplicate submission prevention
    const lastSubmitted = localStorage.getItem("worker_last_submitted");
    if (lastSubmitted) {
      const timeSince = Date.now() - parseInt(lastSubmitted, 10);
      if (timeSince < 10 * 60 * 1000) { // 10 minutes
        setSubmitError(t("form.validation.duplicatePhone"));
        return;
      }
    }

    const services = servicesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const input = {
      name,
      profession,
      category,
      location,
      phone,
      email: email || "",
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      experience: experience ? Number(experience) : undefined,
      bio: bio || "",
      services,
      image: "",
      hp_website: hpWebsite,
    };

    // Validate with Zod
    const result = InsertWorkerSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        // Localize based on key
        if (key === "name") fieldErrors[key] = t("form.validation.nameMin");
        else if (key === "phone") fieldErrors[key] = t("form.validation.phoneInvalid");
        else if (key === "location") fieldErrors[key] = t("form.validation.locationRequired");
        else if (key === "category") fieldErrors[key] = t("form.validation.categoryRequired");
        else if (key === "profession") fieldErrors[key] = t("form.validation.professionRequired");
        else fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      
      // Expand optional section if errors live there
      if (
        fieldErrors.profession ||
        fieldErrors.email ||
        fieldErrors.hourlyRate ||
        fieldErrors.experience ||
        fieldErrors.bio ||
        fieldErrors.services
      ) {
        setShowOptional(true);
      }
      return;
    }

    setSubmitting(true);

    try {
      // Upload profile pic if selected
      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadProfilePic(selectedFile);
      }

      await addWorker({ ...result.data, image: imageUrl });

      // Save timestamp to prevent duplicates
      localStorage.setItem("worker_last_submitted", Date.now().toString());

      // Dispatch refresh event
      window.dispatchEvent(new CustomEvent(EVENTS.WORKER_ADDED));

      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t("form.validation.generalError")
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}>
        <DialogContent className="sm:max-w-md text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl mb-2">{t("form.successTitle")}</DialogTitle>
          <p className="text-gray-650 mb-6 text-sm sm:text-base leading-relaxed">
            {t("form.successDesc")}
          </p>
          <Button onClick={() => { setOpen(false); resetForm(); }} className="w-full bg-primary hover:bg-primary/90 rounded-xl py-3.5 font-bold cursor-pointer border-0">
            {t("form.closeBtn")}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold">{t("form.title")}</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">{t("form.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 flex flex-col gap-6">
          {/* Honeypot Field */}
          <div className="sr-only" aria-hidden="true" tabIndex={-1}>
            <label htmlFor="hp_website">Website</label>
            <input
              id="hp_website"
              type="text"
              name="hp_website"
              value={hpWebsite}
              onChange={(e) => setHpWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* REQUIRED SECTION */}
          <div className="space-y-4">
            {/* Name & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                  {t("form.nameLabel")} *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.namePlaceholder")}
                  className={errors.name ? "border-red-500 rounded-xl" : "rounded-xl"}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                  {t("form.phoneLabel")} *
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("form.phonePlaceholder")}
                  className={errors.phone ? "border-red-500 rounded-xl" : "rounded-xl"}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-1.5 block">
                {t("form.locationLabel")} *
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("form.locationPlaceholder")}
                className={errors.location ? "border-red-500 rounded-xl" : "rounded-xl"}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>

            {/* Category Grid */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                {t("form.categoryLabel")} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "border-primary bg-primary/10 text-primary shadow-sm" 
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-primary" : "text-gray-400"}`} />
                      <span className="text-xs font-semibold">{t(`categories.${cat.value}`)}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* OPTIONAL SECTION TOGGLE */}
          <div className="border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary w-full justify-center p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
            >
              {showOptional ? (
                <><ChevronUp className="h-4 w-4" /> {language === "en" ? "Hide optional details" : "ആവശ്യമെങ്കിൽ നൽകേണ്ട വിവരങ്ങൾ മറയ്ക്കുക"}</>
              ) : (
                <><ChevronDown className="h-4 w-4" /> {language === "en" ? "Add more details to stand out (Optional)" : "കൂടുതൽ വിവരങ്ങൾ ചേർക്കുക (ആവശ്യമെങ്കിൽ)"}</>
              )}
            </button>
          </div>

          {/* OPTIONAL SECTION */}
          {showOptional && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              
              {/* Photo */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  {language === "en" ? "Profile Picture" : "പ്രൊഫൈൽ ചിത്രം"} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span>
                </label>
                <div className="flex items-center gap-3">
                  {previewUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 w-full cursor-pointer"
                    />
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP. Max 5MB.</p>
                  </div>
                </div>
                {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
              </div>

              {/* Profession & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    {t("form.professionLabel")} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span>
                  </label>
                  <Input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder={t("form.professionPlaceholder")}
                    className="border-gray-200 placeholder:text-gray-300 rounded-xl"
                  />
                  {errors.profession && <p className="text-xs text-red-500 mt-1">{errors.profession}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    {t("form.emailLabel")} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span>
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("form.emailPlaceholder")}
                    className="border-gray-200 placeholder:text-gray-300 rounded-xl"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Rate & Experience */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex justify-between">
                    <span>{language === "en" ? "Hourly Rate (₹)" : "മണിക്കൂർ നിരക്ക് (₹)"} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span></span>
                  </label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder={t("form.ratePlaceholder")}
                    className="border-gray-200 placeholder:text-gray-300 rounded-xl"
                  />
                  {hourlyRate === "" && <p className="text-[10px] text-gray-400 mt-1">{language === "en" ? 'Will display as "Contact for rates"' : '"നിരക്കുകൾക്കായി വിളിക്കുക" എന്ന് കാണിക്കും'}</p>}
                  {errors.hourlyRate && <p className="text-xs text-red-500 mt-1">{errors.hourlyRate}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    {language === "en" ? "Years of Experience" : "പരിചയസമ്പത്ത് (വർഷത്തിൽ)"} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span>
                  </label>
                  <Input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder={t("form.experiencePlaceholder")}
                    className="border-gray-200 placeholder:text-gray-300 rounded-xl"
                  />
                  {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
                </div>
              </div>

              {/* Services & Bio */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    {language === "en" ? "Services Offered" : "ചെയ്യുന്ന പ്രധാന ജോലികൾ"} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span>
                  </label>
                  <Input
                    value={servicesText}
                    onChange={(e) => setServicesText(e.target.value)}
                    placeholder={language === "en" ? "e.g. Wiring, Panel Upgrades (comma separated)" : "ഉദാ: വയറിംഗ്, പാനൽ വർക്കുകൾ (കോമ ഉപയോഗിച്ച് തിരിക്കുക)"}
                    className="border-gray-200 placeholder:text-gray-300 rounded-xl"
                  />
                  {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    {language === "en" ? "Bio" : "സ്വയം പരിചയപ്പെടുത്തൽ"} <span className="text-gray-400 font-normal">({language === "en" ? "Optional" : "ആവശ്യമെങ്കിൽ"})</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t("form.aboutPlaceholder")}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm resize-none placeholder:text-gray-350 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
              <span className="shrink-0 block mt-0.5">⚠️</span>
              <p>{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl cursor-pointer"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={submitting}
            >
              {language === "en" ? "Cancel" : "റദ്ദാക്കുക"}
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm cursor-pointer border-0 font-bold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("form.submittingBtn")}
                </>
              ) : (
                t("form.submitBtn")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
