"use client";

import { useEffect, useState } from "react";
import { nunito } from "@/lib/fonts";
import Image from "next/image";
import placeholderImage from "@/assets/icons/common/placeholder-image.jpg";

interface RequestDetails {
  id: number;
  name: string;
  status: "Unread" | "Read";
  subject: string;
  email: string;
  feedback: string;
  avatar: string;
  reply: string | null;
}

interface HelpRequestDetailsProps {
  details: RequestDetails;
  onSendReply: (reply: string) => Promise<void>;
}

export default function HelpRequestDetails({
  details,
  onSendReply,
}: HelpRequestDetailsProps) {
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fallbackSrc = placeholderImage.src;
  const [avatarSrc, setAvatarSrc] = useState(details.avatar || fallbackSrc);

  useEffect(() => {
    setAvatarSrc(details.avatar || fallbackSrc);
  }, [details.avatar, fallbackSrc]);

  const handleSubmit = async () => {
    if (!reply.trim()) return;

    try {
      setIsSending(true);
      await onSendReply(reply);
      setReply("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={`${nunito.className} relative space-y-6 rounded-[5px] bg-[#FFFFFF] p-4 sm:p-6`}
    >
      {/* Top Section */}
      <div className="flex justify-between relative">
        <div className="w-full pr-0 sm:pr-32">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#000000]">
              Person Details
            </h3>

            <p>
              <span className="mr-2 text-[18px] sm:text-[20px] font-semibold text-gray-700">
                First Name:
              </span>
              <span className="text-[16px] sm:text-[18px] text-gray-500">
                {details.name}
              </span>
            </p>

            <p>
              <span className="mr-2 text-[18px] sm:text-[20px] font-semibold text-gray-700">
                Status:
              </span>
              <span className={`text-[16px] italic sm:text-[18px]  ${details.status === "Unread" ? "text-[#018EDE]" : "text-[#EB141B]"}`}>
                {details.status}
              </span>
            </p>

            <p>
              <span className="mr-2 text-[18px] sm:text-[20px] font-semibold text-gray-700">
                Subject:
              </span>
              <span className="text-[16px] sm:text-[18px] text-gray-500">
                {details.subject}
              </span>
            </p>

            <p>
              <span className="mr-2 text-[18px] sm:text-[20px] font-semibold text-gray-700">
                Email Address:
              </span>
              <span className="text-[16px] sm:text-[18px] text-gray-500 underline">
                {details.email}
              </span>
            </p>

            <div>
              <div className="text-[20px] sm:text-[25px] font-bold text-[#231F20E5]">
                Feedback:
              </div>
              <p className="text-[16px] sm:text-[18px] text-gray-500">
                {details.feedback}
              </p>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute top-4 right-4 sm:top-4 sm:right-4">
          <Image
            src={avatarSrc}
            alt={details.name}
            width={100}
            height={100}
            className="sm:w-30 sm:h-30 rounded-full border border-gray-200 object-cover"
            onError={() => setAvatarSrc(fallbackSrc)}
          />
        </div>
      </div>

      {/* Reply Section */}
      {details.reply ? (
        <div className="mt-6 space-y-1">
          <label className="block text-[20px] sm:text-[25px] font-bold text-[#231F20E5]">
            Reply:
          </label>

          <div className="w-full rounded-[5px] px-4 py-1 text-[16px] sm:text-[18px] text-[#828282]">
            {details.reply}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-2">
            <label className="block text-[20px] sm:text-[25px] font-bold text-[#231F20E5]">
              Reply:
            </label>

            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write reply here..."
              rows={8}
              className="w-full rounded-[5px] border border-gray-300 px-4 py-3 text-[16px] sm:text-[18px] text-[#828282] placeholder-gray-400 transition-all duration-200 focus:border-[#0D80E1] focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          {/* Center Button */}
          <div className="my-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSending}
              className="w-full rounded-lg bg-linear-to-b from-[#0D80E1] to-[#085799] px-10 py-3 text-[20px] sm:text-[22px] font-bold text-white shadow transition-all hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
