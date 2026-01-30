import React from "react";

interface DividerProps {
  className?: string;
}

export default function Divider({ className = "" }: DividerProps) {
  return (
    <div className={`w-full flex justify-center my-8 ${className}`}>
      <div className="w-full  h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    </div>
  );
}
