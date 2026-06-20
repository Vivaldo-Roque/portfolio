import { useMemo } from "react";

export function Fireflies() {
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 16 + Math.random() * 18,
        size: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="animate-firefly absolute bottom-[-10vh] block rounded-full bg-lime shadow-[0_0_4px_var(--lime)]"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
