import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Variant = "leaf" | "circuit";

export default function SectionDivider({ variant = "leaf" }: { variant?: Variant }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Two layers, different speeds
  const yBack = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yFront = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const isLeaf = variant === "leaf";

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-32 overflow-hidden sm:h-40"
    >
      {/* Back gradient orb */}
      <motion.div
        style={{ y: yBack, willChange: "transform", opacity }}
        className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      >
        <div
          className={`h-full w-full rounded-full ${
            isLeaf
              ? "bg-[radial-gradient(circle,var(--moss),transparent_70%)] opacity-50"
              : "bg-[radial-gradient(circle,var(--lime),transparent_70%)] opacity-40"
          }`}
        />
      </motion.div>

      {/* Front floating leaf / circuit dot */}
      <motion.div
        style={{ y: yFront, willChange: "transform" }}
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"
      >
        <span
          className={`h-1.5 w-24 rounded-full ${
            isLeaf ? "bg-gradient-to-r from-transparent via-moss to-transparent" : "bg-gradient-to-r from-transparent via-lime to-transparent"
          }`}
        />
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-background" />
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-t from-transparent to-background" />
    </div>
  );
}
