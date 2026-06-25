"use client";

import { Plus, UserPlus } from "lucide-react";
import { EVENTS } from "@/lib/constants";

/**
 * Dual CTA Banner
 *
 * Glassmorphic promotional banner with two action paths:
 * - "List Yourself" for workers
 * - "Add a Worker" for users recommending trusted workers
 *
 * Fully self-contained — no external state needed.
 */
export function CtaBanner() {
  const openModal = () =>
    window.dispatchEvent(new CustomEvent(EVENTS.OPEN_ADD_WORKER_MODAL));

  return (
    <div className="mt-8">
      <div className="bg-blue-600/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg relative overflow-hidden border border-white/10">
        {/* Glass decorative elements */}
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-white/[0.04]" />
        <div className="absolute top-1/2 right-8 w-12 h-12 rounded-full bg-white/[0.06]" />

        <div className="relative z-10">
          {/* Headline */}
          <h3 className="text-[15px] font-extrabold text-white leading-tight">
            Help grow your local network
          </h3>
          <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
            Whether you&apos;re a worker or know one — get them listed.
          </p>

          {/* Dual CTA buttons */}
          <div className="mt-4 flex gap-2.5">
            {/* For workers */}
            <button
              className="flex-1 bg-white text-blue-700 font-extrabold text-[12px] px-3 py-2.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              onClick={openModal}
            >
              <Plus className="h-3.5 w-3.5" />
              List Yourself
            </button>
            {/* For users recommending workers */}
            <button
              className="flex-1 bg-white/15 border border-white/20 text-white font-extrabold text-[12px] px-3 py-2.5 rounded-xl hover:bg-white/25 active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              onClick={openModal}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add a Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
