import Link from "next/link";
import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <Image
        src="/gurizes-logo.png"
        alt="Gurizes FC"
        width={48}
        height={48}
        className="size-12 rounded-lg object-contain ring-1 ring-accent/35 transition group-hover:ring-accent"
      />

      {!compact && (
        <span className="leading-tight">
          <span className="block text-base font-semibold tracking-normal text-white">
            Gurizes FC
          </span>
          <span className="block text-xs font-medium text-white/55">
            Fut dos Gurizes
          </span>
        </span>
      )}
    </Link>
  );
}
