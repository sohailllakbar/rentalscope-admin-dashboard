// components/dashboard/StatsCard.tsx
import Link from "next/link";
import Image from "next/image";
import arrowicon from "@/assets/icons/dashboard/arrow-icon.svg";

type StatsCardProps = {
  title: string;
  value: string;
  iconSrc: string;
  bgColor: string; // main card background
  href: string;
  iconBgColor: string; // accent for bottom bar & subtle icon bg
};

export default function StatsCard({
  title,
  value,
  iconSrc,
  bgColor,
  href,
  iconBgColor,
}: StatsCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div
        className={`relative flex h-35 flex-col overflow-hidden rounded-[5px] border border-white/10 shadow-md transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-2xl`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Very subtle overlay for depth / premium feel */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/[0.07] to-transparent" />

        {/* Main content area – same sizes & spacing */}
        <div className="relative z-10 flex h-33 flex-1 items-center justify-between px-6">
          <div>
            <p className="text-4xl font-semibold tracking-tight text-[#FFFFFF] drop-shadow-[0_0px_0.6px_rgba(0,0,0,0.4)] md:text-3xl">
              {value}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-wide text-white md:text-xl">
              {title}
            </p>
          </div>

          {/* Icon container – same size, but subtle bg + hover scale */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-110`}
            style={{ backgroundColor: `${iconBgColor}1a` }} // ~10% opacity
          >
            <Image
              src={iconSrc}
              alt={title}
              width={56}
              height={56}
              className="drop-shadow-md"
            />
          </div>
        </div>

        {/* Bottom bar – same height, now with tiny gradient + arrow animation */}
        <div
          className={`flex h-8 items-center justify-center gap-1.5 px-6 text-sm font-medium text-white transition-all duration-300 group-hover:brightness-110`}
          style={{
            background: `linear-gradient(to right, ${iconBgColor}, ${darken(iconBgColor, 18)})`,
          }}
        >
          <span>More Info</span>
          <Image
            src={arrowicon}
            alt="→"
            width={15}
            height={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

// Tiny helper – darkens hex color slightly (no extra deps needed)
function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = (num >> 16) - amt;
  const g = ((num >> 8) & 0x00ff) - amt;
  const b = (num & 0x0000ff) - amt;
  return `#${(0x1000000 + (r < 0 ? 0 : r) * 0x10000 + (g < 0 ? 0 : g) * 0x100 + (b < 0 ? 0 : b)).toString(16).slice(1)}`;
}
