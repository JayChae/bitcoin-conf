"use client";

import { useState } from "react";
import GradientButton from "./GradientButton";

interface ShowMoreButtonProps {
  totalCount: number;
  initialCount: number;
  moreText: string;
  closeText: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  variant?: "default" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ShowMoreButton({
  totalCount,
  initialCount,
  moreText,
  closeText,
  isExpanded: externalIsExpanded,
  onToggle: externalOnToggle,
  variant = "accent",
  size = "md",
  className,
}: ShowMoreButtonProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // 외부에서 상태를 관리하는 경우와 내부에서 관리하는 경우 모두 지원
  const isExpanded =
    externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const remainingCount = totalCount - initialCount;
  const shouldShowButton = totalCount > initialCount;

  const handleToggle = () => {
    if (externalOnToggle) {
      externalOnToggle();
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  };

  if (!shouldShowButton) return null;

  return (
    <GradientButton
      onClick={handleToggle}
      variant={variant}
      size={size}
      className={className}
    >
      {isExpanded ? closeText : `${moreText} (+${remainingCount})`}
    </GradientButton>
  );
}

// 커스텀 훅으로 상태 관리 로직 분리
export function useShowMore(totalCount: number, initialCount: number) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedCount = isExpanded
    ? totalCount
    : Math.min(initialCount, totalCount);
  const shouldShowButton = totalCount > initialCount;
  const remainingCount = totalCount - initialCount;

  const toggle = () => setIsExpanded(!isExpanded);

  return {
    isExpanded,
    displayedCount,
    shouldShowButton,
    remainingCount,
    toggle,
    setIsExpanded,
  };
}
