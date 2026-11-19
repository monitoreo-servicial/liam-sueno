import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Download, Smartphone, Check } from 'lucide-react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture Android beforeinstallprompt if available
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-6 pb-safe shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Instalar app en tu celular</h2>
              <p className="text-xs text-indigo-300 font-medium">Liam - Sueño & Siestas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content for iPhone / iOS */}
        <div className="mt-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            En iPhone, Apple no permite instalar apps con un solo clic, pero podés agregarla a tu pantalla de inicio en <strong className="text-white">3 toques rápidos</strong> desde Safari:
          </p>

          <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-indigo-500/30">
                1
              </div>
              <div className="text-xs text-slate-300">
                Toca el botón <strong className="text-white">Compartir</strong> de Safari abajo en el medio de la pantalla:
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                  <Share className="w-4 h-4 text-indigo-400" />
                  <span>Botón Compartir (icono de cuadrado con flecha ↑)</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-indigo-500/30">
                2
              </div>
              <div className="text-xs text-slate-300">
                Baja un poco en el menú y toca:
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                  <PlusSquare className="w-4 h-4 text-amber-400" />
                  <span>"Agregar a la pantalla de inicio"</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                3
              </div>
              <div className="text-xs text-slate-300">
                Toca <strong className="text-emerald-400 font-bold">"Agregar"</strong> arriba a la derecha. ¡Listo! Queda con el icono de la lunita en tu pantalla.
              </div>
            </div>
          </div>

          {/* If on Android and native prompt is ready */}
          {deferredPrompt && (
            <button
              onClick={handleNativeInstall}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Instalar ahora con 1 clic (Android)</span>
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Entendido, ya sé cómo hacerlo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
