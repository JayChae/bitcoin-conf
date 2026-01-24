"use client";

import { useState, useEffect } from "react";
import ChromaGrid from "@/components/ChromaGrid";
import ShinyText from "@/components/ShinyText";
import ShowMoreButton, { useShowMore } from "./ShowMoreButton";
import { type Speaker } from "../messages/speakers";
// import { isMobileRef } from "../_utils/mobile";

type Props = {
  speakers: Speaker[];
  moreText: string;
  closeText: string;
};

export default function Speakers({ speakers, moreText, closeText }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const { isExpanded, toggle } = useShowMore(speakers.length, 6);

  // 모바일 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일에서는 제한된 수만, 데스크톱에서는 모든 스피커 표시
  const displayedSpeakers =
    isMobile && !isExpanded ? speakers.slice(0, 6) : speakers;

  return (
    <div className="flex flex-col items-center justify-center gap-16 md:gap-6">
      <ChromaGrid
        items={displayedSpeakers}
        radius={300}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
        className="md:gap-14"
      />

      {/* 모바일에서만 더보기 버튼 표시 */}
      {isMobile && speakers.length > 6 && (
        <ShowMoreButton
          totalCount={speakers.length}
          initialCount={6}
          moreText={moreText}
          closeText={closeText}
          isExpanded={isExpanded}
          onToggle={toggle}
        />
      )}

      <ShinyText
        text="More speakers on the way!"
        className="text-2xl font-semibold mt-6 md:mt-18 md:text-3xl lg:text-4xl lg:mg-24"
      />
    </div>
  );
}
