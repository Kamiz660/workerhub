"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Worker } from "@/lib/types";

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
  const [contacted, setContacted] = useState(false);

  function handleContact(method: string) {
    // Future: track contact intent for analytics
    setContacted(true);
    console.log(`Contact attempt: ${method} for worker ${worker.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {worker.name}</DialogTitle>
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
                className="w-full justify-start gap-3 h-14 text-base"
                id={`contact-phone-${worker.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Call</div>
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
                className="w-full justify-start gap-3 h-14 text-base"
                id={`contact-email-${worker.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-500">{worker.email}</div>
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
                className="w-full justify-start gap-3 h-14 text-base"
                id={`contact-whatsapp-${worker.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm text-gray-500">Send a message</div>
                </div>
              </Button>
            </a>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Contact initiated!</h3>
            <p className="text-gray-500 text-sm">
              {worker.name} typically responds within a few hours.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setContacted(false);
                onOpenChange(false);
              }}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
