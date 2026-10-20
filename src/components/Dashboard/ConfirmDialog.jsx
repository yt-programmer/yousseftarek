/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { btn } from "./ui";

const ConfirmContext = createContext(null);

// const confirm = useConfirm(); if (!(await confirm({ title, message, confirmText }))) return;
export const useConfirm = () => {
  const ask = useContext(ConfirmContext);
  // outside the provider (e.g. isolated tests) fall back to the browser dialog
  return ask || (async ({ message, title }) => window.confirm(message || title));
};

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolver = useRef(null);
  const cancelRef = useRef(null);

  const ask = useCallback((options) => new Promise((resolve) => { resolver.current = resolve; setDialog(options); }), []);
  const settle = useCallback((answer) => { resolver.current?.(answer); resolver.current = null; setDialog(null); }, []);

  useEffect(() => {
    if (!dialog) return undefined;
    const previous = document.activeElement;
    cancelRef.current?.focus();
    const onKey = (event) => { if (event.key === "Escape") settle(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus?.({ preventScroll: true }); };
  }, [dialog, settle]);

  return <ConfirmContext.Provider value={ask}>
    {children}
    {dialog && createPortal(
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) settle(false); }}>
        <div role="alertdialog" aria-modal="true" aria-label={dialog.title} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] p-6 text-white shadow-2xl">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${dialog.tone === "neutral" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}><FaExclamationTriangle /></span>
          <h2 className="mt-4 text-lg font-semibold">{dialog.title || "Are you sure?"}</h2>
          {dialog.message && <p className="mt-2 text-sm leading-6 text-gray-400">{dialog.message}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button ref={cancelRef} type="button" onClick={() => settle(false)} className={btn.ghost}>{dialog.cancelText || "Cancel"}</button>
            <button type="button" onClick={() => settle(true)} className={dialog.tone === "neutral" ? btn.primary : btn.dangerSolid}>{dialog.confirmText || "Delete"}</button>
          </div>
        </div>
      </div>,
      document.body,
    )}
  </ConfirmContext.Provider>;
}
