"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "accent";
  size?: "sm" | "md" | "lg";
}

export default function GradientButton({
  children,
  variant = "accent",
  size = "md",
  className,
  ...props
}: GradientButtonProps) {
  const baseClasses = "font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-pointer border rounded-full";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-gray-500/20 to-gray-600/30 hover:from-gray-500/30 hover:to-gray-600/40 border-gray-500/40 text-gray-700",
    accent: "bg-gradient-to-r from-accent/20 to-accent/30 hover:from-accent/30 hover:to-accent/40 border-accent/40 text-accent"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
