import Image from "next/image";
import type { GroupId } from "@/content/types";
import { groupById } from "@/content/module-groups";

interface Icon3DProps {
  group: GroupId;
  /** Rendered width and height in CSS pixels. The source files are 256px, so up to 128px stays crisp at 2x. */
  size?: number;
  priority?: boolean;
  className?: string;
}

/**
 * One pre-rendered, transparent WebP "3D" icon per module group (see /public/icons).
 * Decorative: the group name is always printed next to it, so alt is empty.
 * Explicit width/height + sizes keep layout stable (no CLS); below-the-fold icons lazy-load by default.
 */
export function Icon3D({ group, size = 96, priority = false, className }: Icon3DProps) {
  const g = groupById(group);
  return (
    <Image
      src={`/icons/${g.icon}.webp`}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={`icon-float ${className ?? ""}`}
      draggable={false}
    />
  );
}
