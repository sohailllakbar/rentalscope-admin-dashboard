import Image from "next/image";

export default function AuthLogoSection() {
  return (
    <div className="relative hidden bg-white md:flex md:basis-[45%] md:items-center md:justify-center">
      {/* Divider */}
      <div className="absolute top-16 right-0 bottom-10 z-10 w-px bg-[#0000003b]" />


      {/* Logo */}
      <div className="relative h-72 w-72 lg:h-85 lg:w-85">
        <Image
          src="/logos/main-logo-rental-scope.webp"
          alt="Tenant Trust logo"
          fill
          priority
          sizes="(max-width: 768px) 0px, 50vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
