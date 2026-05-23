import clsx from "clsx";

export function Eyebrow({
  children,
  className,
  color = "brass",
}: {
  children: React.ReactNode;
  className?: string;
  color?: "brass" | "celadon" | "stone";
}) {
  const colors = {
    brass: "text-brass-deep",
    celadon: "text-celadon",
    stone: "text-stone",
  };
  return (
    <span
      className={clsx(
        "font-mono uppercase tracking-[0.28em] text-[11px] leading-none",
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RomanNumeral({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "font-cormorant italic font-light text-brass",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BrassDivider({
  className,
  width = "w-24",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <span
      className={clsx(
        "block h-px bg-brass-deep/60",
        width,
        className,
      )}
    />
  );
}

export function PullQuote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <blockquote
      className={clsx(
        "border-l-2 border-brass pl-6 italic font-cormorant text-emerald font-light",
        className,
      )}
    >
      {children}
    </blockquote>
  );
}

type ForestButtonProps =
  | ({ as?: "a"; href?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ as: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export function ForestButton(props: ForestButtonProps) {
  const cls = clsx(
    "inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-forest text-parchment",
    "font-mono uppercase tracking-[0.18em] text-[12px]",
    "transition-all duration-500 ease-[var(--ease-organic)]",
    "hover:bg-emerald hover:gap-4 hover:shadow-[0_20px_40px_-15px_rgba(20,35,29,0.4)]",
    props.className,
  );
  if (props.as === "button") {
    const { as: _as, className: _c, children, ...rest } = props;
    return (
      <button className={cls} {...rest}>
        {children}
      </button>
    );
  }
  const { as: _as, className: _c, children, ...rest } = props;
  return (
    <a className={cls} {...rest}>
      {children}
    </a>
  );
}

export function GhostButton({
  children,
  href,
  className,
  ...rest
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 px-6 py-3 rounded-full",
        "border border-brass-deep/60 text-brass-deep bg-transparent",
        "font-mono uppercase tracking-[0.18em] text-[11px]",
        "transition-all duration-500 ease-[var(--ease-organic)]",
        "hover:border-brass-deep hover:bg-brass-deep/5 hover:gap-3",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

export function SectionLabel({
  number,
  name,
  className,
}: {
  number: string;
  name: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <Eyebrow>{`${name} · ${number}`}</Eyebrow>
      <BrassDivider width="w-16" />
    </div>
  );
}

export function BrassParticles({ count = 18 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 0.7) % 14;
        const size = 2 + ((i * 17) % 3);
        return (
          <span
            key={i}
            className="brass-particle"
            style={{
              left: `${left}%`,
              bottom: "-10px",
              animationDelay: `-${delay}s`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
    </div>
  );
}
