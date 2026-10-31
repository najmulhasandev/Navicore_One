import type { Metadata } from "next";
import Link from "next/link";
import { getMessages } from "@/i18n/messages";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  const m = getMessages();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-5xl font-semibold">{m.notFound.title}</h1>
      <p className="mt-5 text-lg text-ink-soft">{m.notFound.text}</p>
      <Link href="/os" className="btn btn-red mt-8">{m.notFound.cta}</Link>
    </div>
  );
}
