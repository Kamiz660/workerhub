"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Settings,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  AlertTriangle,
} from "lucide-react";
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
import type { WorkerCategory, Worker } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { AuthDialog } from "@/components/shared/auth-dialog";

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

const DRAFT_KEY = "worker_listing_draft";
const ANALYTICS_KEY = "workerhub_funnel_events";

interface FormErrors {
  [key: string]: string;
}

function trackFunnelEvent(event: string, meta?: Record<string, any>) {
  try {
    const payload = { event, timestamp: Date.now(), ...meta };
    const history = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "[]");
    history.push(payload);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(history.slice(-100)));
    console.log(`[Funnel Analytics] ${event}`, payload);
  } catch {
    // Silent fallback
  }
}

export function AddWorkerModal() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  // Resume Draft & Exit Protection
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [createdWorker, setCreatedWorker] = useState<Worker | null>(null);
  const [openAuthUpsell, setOpenAuthUpsell] = useState(false);

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
    const handler = () => {
      setOpen(true);
      // Check if draft exists
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.name || parsed.phone || parsed.location) {
            setShowResumePrompt(true);
          } else {
            trackFunnelEvent("listing_started", { source: "modal_trigger" });
          }
        } else {
          trackFunnelEvent("listing_started", { source: "modal_trigger" });
        }
      } catch {
        trackFunnelEvent("listing_started", { source: "modal_trigger" });
      }
    };
    window.addEventListener(EVENTS.OPEN_ADD_WORKER_MODAL, handler);
    return () =>
      window.removeEventListener(EVENTS.OPEN_ADD_WORKER_MODAL, handler);
  }, []);

  // Autosave draft when form inputs or step change
  useEffect(() => {
    if (!open || success) return;
    const draftData = {
      step,
      name,
      category,
      location,
      phone,
      profession,
      email,
      hourlyRate,
      experience,
      bio,
      servicesText,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    } catch {
      // Storage unavailable
    }
  }, [
    open,
    success,
    step,
    name,
    category,
    location,
    phone,
    profession,
    email,
    hourlyRate,
    experience,
    bio,
    servicesText,
  ]);

  function loadDraft() {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setStep(parsed.step || 1);
        if (parsed.name) setName(parsed.name);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.profession) setProfession(parsed.profession);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.hourlyRate) setHourlyRate(parsed.hourlyRate);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.servicesText) setServicesText(parsed.servicesText);
        trackFunnelEvent("listing_draft_resumed", { step: parsed.step });
      }
    } catch {
      // Ignore invalid JSON
    }
    setShowResumePrompt(false);
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
    setShowResumePrompt(false);
  }

  function isDirty() {
    return Boolean(name || phone || location || bio || profession || selectedFile);
  }

  function resetForm() {
    setStep(1);
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
    setShowResumePrompt(false);
    setShowExitConfirm(false);
    setCreatedWorker(null);

    clearDraft();
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen && isDirty() && !success && !showExitConfirm) {
      setShowExitConfirm(true);
      return;
    }
    setOpen(isOpen);
    if (!isOpen) resetForm();
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

  function validateStep(targetStep: number): boolean {
    setErrors({});
    if (targetStep === 2) {
      // Validating Step 1 (Category is auto-selected)
      return true;
    }
    if (targetStep === 3) {
      // Validating Step 2 (Name & Phone)
      const stepErrors: FormErrors = {};
      if (!name.trim() || name.trim().length < 2) {
        stepErrors.name = t("form.validation.nameMin");
      }
      const numbers = phone.replace(/\D/g, "");
      if (!phone.trim() || numbers.length < 10) {
        stepErrors.phone = t("form.validation.phoneInvalid");
      }
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return false;
      }
    }
    if (targetStep === 4) {
      // Validating Step 3 (Location)
      if (!location.trim() || location.trim().length < 2) {
        setErrors({ location: t("form.validation.locationRequired") });
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step + 1)) {
      const next = Math.min(step + 1, 4);
      trackFunnelEvent("listing_step_completed", { completedStep: step, nextStep: next });
      setStep(next);
    }
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitError(null);
    setErrors({});

    // Duplicate submission prevention
    const lastSubmitted = localStorage.getItem("worker_last_submitted");
    if (lastSubmitted) {
      const timeSince = Date.now() - parseInt(lastSubmitted, 10);
      if (timeSince < 10 * 60 * 1000) {
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
        if (key === "name") fieldErrors[key] = t("form.validation.nameMin");
        else if (key === "phone") fieldErrors[key] = t("form.validation.phoneInvalid");
        else if (key === "location") fieldErrors[key] = t("form.validation.locationRequired");
        else fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // Jump to step with error
      if (fieldErrors.name || fieldErrors.phone) setStep(2);
      else if (fieldErrors.location) setStep(3);
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadProfilePic(selectedFile);
      }

      const newWorker = await addWorker({ ...result.data, image: imageUrl });

      localStorage.setItem("worker_last_submitted", Date.now().toString());
      clearDraft();

      trackFunnelEvent("listing_published", {
        workerId: newWorker.id,
        category: newWorker.category,
        location: newWorker.location,
      });

      window.dispatchEvent(new CustomEvent(EVENTS.WORKER_ADDED));

      setCreatedWorker(newWorker);
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t("form.validation.generalError")
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success Screen with Live Card Preview ────────────────────────────
  if (success && createdWorker) {
    return (
      <>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="w-full sm:max-w-lg p-6 text-center max-h-[92vh] overflow-y-auto rounded-2xl">
            <div className="flex justify-center mb-3">
              <div className="rounded-full bg-emerald-100 p-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
            </div>

            <DialogTitle className="text-2xl font-bold text-slate-900">
              🎉 Your listing is live!
            </DialogTitle>
            <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              People in {createdWorker.location} can now find and call you directly.
            </p>

            {/* Live Worker Card Preview */}
            <div className="my-5 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Live Preview of Your Profile
              </div>
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0 overflow-hidden">
                  {createdWorker.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={createdWorker.image}
                      alt={createdWorker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    createdWorker.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-base truncate">
                      {createdWorker.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      5.0
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary">
                    {createdWorker.profession}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {createdWorker.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {createdWorker.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Sunk-cost Account Upsell */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 text-left my-4">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Want to manage or edit your profile later?
              </h5>
              <p className="text-[11px] text-slate-600 mt-1">
                Create a free account to update your rates, phone number, and services anytime.
              </p>
              <Button
                type="button"
                onClick={() => {
                  trackFunnelEvent("account_created_post_submit");
                  setOpenAuthUpsell(true);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 text-xs font-bold mt-3 border-0 cursor-pointer"
              >
                Create Free Account
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="w-full rounded-xl py-3 text-sm font-semibold cursor-pointer border-slate-200"
            >
              Done
            </Button>
          </DialogContent>
        </Dialog>

        {openAuthUpsell && (
          <AuthDialog
            open={openAuthUpsell}
            onOpenChange={setOpenAuthUpsell}
            initialMode="signup"
            initialIntent="worker"
            onSuccess={() => {
              setOpenAuthUpsell(false);
              setOpen(false);
              resetForm();
            }}
          />
        )}
      </>
    );
  }

  // Helper for step titles
  function getStepTitle() {
    switch (step) {
      case 1:
        return "What service do you offer?";
      case 2:
        return "Who are you?";
      case 3:
        return "Where do you work?";
      case 4:
        return "Stand out (Optional)";
      default:
        return "Register Your Service";
    }
  }

  function getStepSubtitle() {
    switch (step) {
      case 1:
        return "Select your primary trade category to start.";
      case 2:
        return "Enter your full name and phone number for client calls.";
      case 3:
        return "Enter your primary town or service location.";
      case 4:
        return "Add a profile photo, experience, or bio to get more calls.";
      default:
        return "";
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-full h-full sm:h-auto sm:max-w-xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto p-0 rounded-none sm:rounded-2xl border-0 sm:border flex flex-col justify-between">
          <div>
            {/* Header & Step Progress Bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="Back"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Step {step} of 4
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {step === 4 ? "Ready to publish" : "Almost done"}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>

              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                {getStepTitle()}
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">{getStepSubtitle()}</p>
            </div>

            {/* Resume Draft Banner */}
            {showResumePrompt && (
              <div className="mx-6 mt-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Resume your saved draft?</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="text-xs text-amber-700 hover:underline px-2 py-1"
                  >
                    Start Fresh
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={loadDraft}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs py-1 px-3 border-0 cursor-pointer"
                  >
                    Resume
                  </Button>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 4) nextStep();
                else handleSubmit(e);
              }}
              className="p-6 pt-4 flex flex-col gap-5"
            >
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

              {/* STEP 1: CATEGORY SELECTION */}
              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            setCategory(cat.value);
                            trackFunnelEvent("category_selected", { category: cat.value });
                          }}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 mb-2 ${
                              isSelected ? "text-primary" : "text-slate-400"
                            }`}
                          />
                          <span className="text-xs font-bold">
                            {t(`categories.${cat.value}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: NAME & PHONE */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 mb-1.5 block">
                      {t("form.nameLabel")} *
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("form.namePlaceholder")}
                      autoFocus
                      className={
                        errors.name
                          ? "border-red-500 rounded-xl"
                          : "rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-primary/20"
                      }
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 mb-1.5 block">
                      {t("form.phoneLabel")} *
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("form.phonePlaceholder")}
                      className={
                        errors.phone
                          ? "border-red-500 rounded-xl"
                          : "rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-primary/20"
                      }
                    />
                    {errors.phone ? (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Clients will call or WhatsApp this number directly.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 mb-1.5 block">
                      {t("form.locationLabel")} *
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t("form.locationPlaceholder")}
                      autoFocus
                      className={
                        errors.location
                          ? "border-red-500 rounded-xl"
                          : "rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-primary/20"
                      }
                    />
                    {errors.location ? (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.location}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        e.g. Kottayam, Koothattukulam, Ernakulam
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: OPTIONAL BOOST (PHOTO, BIO, EXPERIENCE) */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Photo */}
                  <div>
                    <label className="text-xs font-bold text-slate-900 mb-1.5 block">
                      Profile Picture <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {previewUrl ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0">
                          <Upload className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 w-full cursor-pointer"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          JPEG, PNG or WebP. Max 5MB.
                        </p>
                      </div>
                    </div>
                    {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
                  </div>

                  {/* Profession & Experience */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-900 mb-1 block">
                        Profession <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="e.g. Master Plumber"
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-900 mb-1 block">
                        Years Experience <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 5"
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Hourly Rate & Email */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-900 mb-1 block">
                        Hourly Rate (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="e.g. 150"
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-900 mb-1 block">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="rounded-xl border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-xs font-bold text-slate-900 mb-1 block">
                      Bio / Services Description <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Briefly describe your experience and work scope..."
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-2">
                  <span className="shrink-0 block mt-0.5">⚠️</span>
                  <p>{submitError}</p>
                </div>
              )}

              {/* Step Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={submitting}
                    className="rounded-xl py-2.5 text-xs font-semibold cursor-pointer border-slate-200"
                  >
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenChange(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 px-5 font-bold text-xs cursor-pointer border-0 flex items-center gap-1.5 ml-auto"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl py-3 px-6 font-bold text-xs shadow-sm cursor-pointer border-0 flex items-center gap-1.5 ml-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Publishing...
                      </>
                    ) : (
                      "Publish My Listing"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Protection Alert */}
      {showExitConfirm && (
        <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
          <DialogContent className="sm:max-w-xs text-center p-6 rounded-2xl">
            <div className="mx-auto w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Discard your listing draft?
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your details will be lost if you leave now.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-2 text-xs font-bold cursor-pointer border-0"
              >
                Continue Editing
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowExitConfirm(false);
                  setOpen(false);
                  resetForm();
                }}
                className="w-full text-red-600 hover:bg-red-50 rounded-xl py-2 text-xs font-semibold cursor-pointer"
              >
                Discard & Start Over
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
