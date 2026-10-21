import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

// Shared dialog: Escape + backdrop click close it, page scroll is locked, focus moves in and returns on close.
export default function Modal({ open, onClose, title, eyebrow, subtitle, children, busy = false, size = "max-w-2xl" }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector("input:not([type=hidden]):not([type=file]), textarea, select, button[type=submit]");
    first?.focus({ preventScroll: true });
    const onKey = (event) => { if (event.key === "Escape" && !busy) { event.stopPropagation(); onCloseRef.current?.(); } };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; previous?.focus?.({ preventScroll: true }); };
  }, [open, busy]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose?.(); }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={title} className={`my-auto w-full ${size} rounded-2xl border border-white/10 bg-[#111318] p-5 text-white shadow-2xl md:p-7`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">{eyebrow}</p>}
            <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
          </div>
          <button type="button" aria-label="Close" onClick={() => !busy && onClose?.()} className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:text-white"><FaTimes /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
