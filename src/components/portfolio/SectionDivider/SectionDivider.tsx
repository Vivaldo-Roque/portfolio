import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Variant = "leaf" | "circuit";

export default function SectionDivider({ variant = "leaf" }: { variant?: Variant }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtler parallax translation for a professional, premium feel
  const yElement = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const isLeaf = variant === "leaf";

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-20 overflow-hidden sm:h-24 flex items-center justify-center"
    >
      {/* Very faint background light pool */}
      <motion.div
        style={{ opacity }}
        className="absolute left-1/2 top-1/2 h-32 w-64 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full blur-[60px] opacity-10 dark:block hidden"
      >
        <div
          className={`h-full w-full rounded-full ${
            isLeaf
              ? "bg-[radial-gradient(circle,var(--moss)_0%,transparent_70%)]"
              : "bg-[radial-gradient(circle,var(--lime)_0%,transparent_70%)]"
          }`}
        />
      </motion.div>

      {/* Main Divider Line & Accent */}
      <motion.div
        style={{ y: yElement, willChange: "transform", opacity }}
        className="relative w-full max-w-2xl px-8 flex items-center justify-center"
      >
        {/* Sleek, ultra-thin line with gradient fade */}
        <div className="absolute inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-40 dark:opacity-20" />
        
        {/* Accent lines using theme color */}
        <div 
          className="absolute inset-x-24 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30" 
          style={{ color: isLeaf ? 'var(--moss)' : 'var(--lime)' }}
        />

        {/* Center Emblem */}
        <div className="relative flex items-center justify-center px-4 bg-background z-10">
          {isLeaf ? (
            /* Minimalist Leaf Emblem */
            <div 
              className="h-3 w-3 rounded-tl-full rounded-br-full border border-current opacity-80"
              style={{ color: 'var(--moss)' }}
            />
          ) : (
            /* Minimalist Circuit Emblem */
            <div className="flex items-center gap-1">
              <div 
                className="h-2 w-2 rounded-full border border-current opacity-80"
                style={{ color: 'var(--lime)' }}
              />
              <div 
                className="h-[1px] w-2 bg-current opacity-60"
                style={{ color: 'var(--lime)' }}
              />
              <div 
                className="h-1.5 w-1.5 bg-current opacity-80"
                style={{ color: 'var(--lime)' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

