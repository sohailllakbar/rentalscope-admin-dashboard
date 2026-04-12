import { nunito } from "@/lib/fonts";

interface NewsBlogContentProps {
  content: string;
}

export default function NewsBlogContent({ content }: NewsBlogContentProps) {
  return (
    <div
      className={`${nunito.className} max-w-none  text-[18px] leading-relaxed text-[#949494] whitespace-pre-line`}
    >
      {content}
    </div>
  );
}