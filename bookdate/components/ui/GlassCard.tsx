"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn("glass-card p-6", glow && "glass-card--glow", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
