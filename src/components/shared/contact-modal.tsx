"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Worker } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

interface ContactModalProps {
  worker: Worker;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({
  worker,
  open,
  onOpenChange,
}: ContactModalProps) {
  const { t, language } = useLanguage();
  const [contacted, setContacted] = useState(false);

  function handleContact(method: string) {
    setContacted(true);
    console.log(`Contact attempt: ${method} for worker ${worker.id}`);
  }

  const modalTitle = language === "en"
    ? `Contact ${worker.name}`
    : `${worker.name}-നെ ബന്ധപ്പെടുക`;

  const responseText = language === "en"
    ? `${worker.name} typically responds within a few hours.`
    : `${worker.name} സാധാരണയായി ഏതാനും മണിക്കൂറുകൾക്കുള്ളിൽ മറുപടി നൽകും.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>

        {!contacted ? (
          <div className="flex flex-col gap-3 py-4">
            <a
              href={`tel:${worker.phone}`}
              onClick={() => handleContact("phone")}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 text-base cursor-pointer"
                id={`contact-phone-${worker.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm sm:text-base">{language === "en" ? "Call" : "വിളിക്കുക"}</div>
                  <div className="text-sm text-gray-500">{worker.phone}</div>
                </div>
              </Button>
            </a>

            <a
              href={`mailto:${worker.email}`}
              onClick={() => handleContact("email")}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 text-base cursor-pointer"
                id={`contact-email-${worker.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm sm:text-base">{t("card.email")}</div>
                  <div className="text-sm text-gray-500">{worker.email || "No email provided"}</div>
                </div>
              </Button>
            </a>

            <a
              href={`https://wa.me/${worker.phone.replace(/[\s+]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleContact("whatsapp")}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 text-base cursor-pointer"
                id={`contact-whatsapp-${worker.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm sm:text-base">{t("card.whatsapp")}</div>
                  <div className="text-sm text-gray-500">
                    {language === "en" ? "Send a message" : "സന്ദേശം അയക്കുക"}
                  </div>
                </div>
              </Button>
            </a>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              {language === "en" ? "Contact initiated!" : "ബന്ധപ്പെടാൻ ആരംഭിച്ചു!"}
            </h3>
            <p className="text-gray-500 text-sm">
              {responseText}
            </p>
            <Button
              className="mt-4 cursor-pointer"
              variant="outline"
              onClick={() => {
                setContacted(false);
                onOpenChange(false);
              }}
            >
              {t("form.closeBtn")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
