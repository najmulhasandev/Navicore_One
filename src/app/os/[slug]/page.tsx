import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allParts, getPart } from "@/lib/parts";
import { partBreadcrumb, partMetadata } from "@/lib/seo";
import { PartLayout } from "@/components/PartLayout";
import { JsonLd } from "@/components/ui/JsonLd";

/** Exactly the 52 parts in os-parts.ts, generated at build time. Anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return allParts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const part = getPart(slug);
  return part ? partMetadata(part) : {};
}

export default async function PartPage({ params }: Props) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();
  return (
    <>
      <JsonLd data={partBreadcrumb(part)} />
      <PartLayout part={part} />
    </>
  );
}
