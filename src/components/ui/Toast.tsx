"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Info, X } from "@phosphor-icons/react";

interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let addToastFn: ((toast: Omit<ToastData, "id">) => void) | null = null;

export function showToast(message: string, type: ToastData["type"] = "success") {
  addToastFn?.({ message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    addToastFn = (toast) => {
      const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center" dir="ltr">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`
              flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium backdrop-blur-xl
              ${toast.type === "success" ? "bg-accent/20 text-accent border border-accent/30" : ""}
              ${toast.type === "error" ? "bg-danger/20 text-danger border border-danger/30" : ""}
              ${toast.type === "info" ? "bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30" : ""}
            `}
          >
            {toast.type === "success" && <Check weight="bold" className="size-4" />}
            {toast.type === "error" && <X weight="bold" className="size-4" />}
            {toast.type === "info" && <Info weight="bold" className="size-4" />}
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
