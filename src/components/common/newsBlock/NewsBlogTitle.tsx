// components/common/NewsBlogTitle.tsx
import { nunito } from "@/lib/fonts";

interface NewsBlogTitleProps {
  title: string;
  date?: string;
  author?: string;
}

export default function NewsBlogTitle({
  title,
  date,
  author,
}: NewsBlogTitleProps) {
  return (
    <div className={`${nunito.className} capitalize space-y-2`}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>
      {(date || author) && (
        <div className="flex items-center gap-4 text-[18px] font-semibold text-[#A5A5A5]">
          {date && <span>{date}</span>}
          {author && <span>• {author}</span>}
        </div>
      )}
    </div>
  );
}