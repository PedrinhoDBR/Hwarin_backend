import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

type Props = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export default function Alert({ open, message, onClose }: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-950/88 px-4 py-3 text-red-50 shadow-2xl backdrop-blur-xl">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Erro</p>
          <p className="text-sm text-red-100/90">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-red-200 transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}