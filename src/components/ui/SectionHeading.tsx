import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  /** "dark" = on a maroon band: white title, baby-pink text. */
  tone?: "light" | "dark";
  id?: string;
}

export function SectionHeading({ eyebrow, title, lead, as = "h2", align = "left", tone = "light", id }: SectionHeadingProps) {
  const Tag = as;
  const dark = tone === "dark";
  return (
    <div data-reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className={`mb-4 text-sm font-semibold uppercase tracking-[0.18em] ${dark ? "text-mist" : "text-red"}`}>{eyebrow}</p>
      ) : null}
      <Tag id={id} className={`font-display text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl ${dark ? "text-white" : ""}`}>
        {title}
      </Tag>
      {lead ? <p className={`mt-5 text-lg sm:text-xl ${dark ? "text-mist" : "text-ink-soft"}`}>{lead}</p> : null}
    </div>
  );
}
