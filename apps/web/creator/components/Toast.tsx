"use client";
import { createContext, useCallback, useContext, useEffect, useState, PropsWithChildren } from 'react';

const ToastContext = createContext<(msg: string) => void>(() => {});

function ToastMessage({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => setMessage(msg), []);
  const clear = useCallback(() => setMessage(null), []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clear, 3000);
    return () => clearTimeout(t);
  }, [message, clear]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && <ToastMessage message={message} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
