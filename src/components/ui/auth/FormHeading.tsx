type FormHeadingProps = {
  title: string;
  subtitle: string;
};

export default function FormHeading({ title, subtitle }: FormHeadingProps) {
  return (
    <div className="text-center">
      <h1 className="text-[40px] leading-[1.2] font-bold tracking-[-0.2px] text-[#0E86E8]">
        {title}
      </h1>

      <p className="mt-3 text-[25px] leading-normal font-normal tracking-[0.1px] text-[#7A7A7A]">
        {subtitle}
      </p>
    </div>
  );
}
