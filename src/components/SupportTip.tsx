import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";

const AMOUNTS = [1, 3, 10] as const;

const PAYMENT_METHODS = [
  { label: "PayPal", href: "https://paypal.me/skyletter" },
  { label: "UPI", href: "upi://pay?pa=skyletter@upi&pn=SkyLetter" },
  { label: "Crypto", href: "https://commerce.coinbase.com/" },
];

export function SupportTip() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [showMethods, setShowMethods] = useState(false);

  const close = () => {
    setOpen(false);
    setShowMethods(false);
    setAmount(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 font-serif italic text-xs sm:text-sm text-foreground/60 hover:text-foreground/90 transition-colors"
      >
        <Heart size={11} className="opacity-70 group-hover:opacity-100" />
        <span className="border-b border-foreground/20 group-hover:border-foreground/50 pb-[1px]">
          leave a small tip
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[80] bg-black/65 flex items-center justify-center px-5"
            onClick={close}
          >
            <motion.div
              initial={{ y: 18, opacity: 0, rotate: -1.2 }}
              animate={{ y: 0, opacity: 1, rotate: -1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="paper-letter w-full max-w-sm p-7 sm:p-9 relative"
            >
              <button
                onClick={close}
                className="absolute top-2 right-2 opacity-60 hover:opacity-100"
                style={{ color: "#3d2f1f" }}
                aria-label="close"
              >
                <X size={15} />
              </button>

              <div className="text-center" style={{ color: "#3d2f1f" }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
                  ⋆ support skyletter ⋆
                </div>
                <p className="font-serif italic text-base mt-2 leading-snug">
                  if this made you feel something,
                  <br />
                  you can leave a small tip.
                </p>

                <div className="flex items-center justify-center gap-2 mt-5">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className="px-4 py-2 font-serif italic text-base transition-all"
                      style={{
                        color: "#3d2f1f",
                        background: amount === a ? "rgba(61,47,31,0.12)" : "transparent",
                        border: `1px solid ${amount === a ? "rgba(61,47,31,0.7)" : "rgba(61,47,31,0.3)"}`,
                        borderRadius: 2,
                      }}
                    >
                      ${a}
                    </button>
                  ))}
                </div>

                {!showMethods ? (
                  <button
                    disabled={!amount}
                    onClick={() => setShowMethods(true)}
                    className="mt-6 paper-button text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Make Payment
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-6"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-3">
                      choose a way to send ${amount}
                    </div>
                    <div className="flex items-center justify-center gap-4 font-serif italic text-sm">
                      {PAYMENT_METHODS.map((m, i) => (
                        <span key={m.label} className="flex items-center gap-4">
                          <a
                            href={m.href}
                            target="_blank"
                            rel="noreferrer"
                            className="border-b border-[#3d2f1f]/30 hover:border-[#3d2f1f] pb-[1px]"
                          >
                            {m.label}
                          </a>
                          {i < PAYMENT_METHODS.length - 1 && (
                            <span className="opacity-40">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <p className="font-serif italic text-[11px] opacity-55 mt-5 leading-relaxed">
                  entirely optional. thank you for being here.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
