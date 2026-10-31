import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({ eyebrow, title, lead, as = "h2", align = "left", id }: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-red">{eyebrow}</p> : null}
      <Tag id={id} className="font-display text-4xl font-semibold sm:text-5xl">{title}</Tag>
      {lead ? <p className="mt-5 text-lg text-ink-soft sm:text-xl">{lead}</p> : null}
    </div>
  );
}
