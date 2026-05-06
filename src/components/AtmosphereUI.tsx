export function CornerLabel({
  position,
  children,
}: {
  position: "tl" | "tr" | "bl" | "br";
  children: React.ReactNode;
}) {
  const pos = {
    tl: "top-6 left-6",
    tr: "top-6 right-6 text-right",
    bl: "bottom-6 left-6",
    br: "bottom-6 right-6 text-right",
  }[position];
  return (
    <div className={`absolute ${pos} z-20 label-mono`}>
      {children}
      <div className="mt-1 h-px w-12 bg-foreground/30" />
    </div>
  );
}

export function CrescentMoonIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="opacity-80">
      <defs>
        <radialGradient id="cm" cx="0.7" cy="0.4">
          <stop offset="0%" stopColor="#fff4cc" />
          <stop offset="60%" stopColor="#c9b89a" />
          <stop offset="100%" stopColor="#5a4a32" />
        </radialGradient>
      </defs>
      <circle cx="22" cy="20" r="14" fill="url(#cm)" />
      <circle cx="14" cy="18" r="13" fill="#131827" />
    </svg>
  );
}

export function StarIcon({ size = 14, color = "#fff4cc" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path
        d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6 opacity-50">
      <span className="h-px w-12 bg-foreground/40" />
      <StarIcon size={10} />
      <span className="h-px w-12 bg-foreground/40" />
    </div>
  );
}
