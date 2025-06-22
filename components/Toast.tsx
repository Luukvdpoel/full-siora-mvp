"use client";
import { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect } from "react";

interface ToastItem {
  id: number;
  message: string;
  type?: "success" | "error";
}

const ToastContext = createContext<(msg: string, type?: "success" | "error") => void>(() => {});

export function ToastProvider({ children }: PropsWithChildren<{}>) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type?: "success" | "error") => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

function Toast({ message, onClose, type }: { message: string; onClose: () => void; type?: "success" | "error" }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "error" ? "bg-red-600" : "bg-green-600";
  return (
    <div className={`${bg} text-white px-4 py-2 rounded shadow`}> {message} </div>
  );
}
