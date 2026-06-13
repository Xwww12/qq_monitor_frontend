import { useEffect, useRef } from "react";
import gsap from "gsap";

const TOTAL_SEGMENTS = 32;

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const state = { p: 0 };

    function updateProgress() {
      const n = Math.ceil(Math.max(0, Math.min(1, state.p)) * TOTAL_SEGMENTS);
      for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        const el = segmentRefs.current[i];
        if (el) {
          el.style.background =
            i < n
              ? "#00ffff"
              : "rgba(51,65,85,0.5)";
          el.style.boxShadow =
            i < n
              ? "0 0 6px rgba(0,255,255,0.5)"
              : "none";
        }
      }
    }

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.15 })
      .to(state, {
        p: 0.2,
        duration: 0.2,
        ease: "power2.out",
        onUpdate: updateProgress,
      })
      .to(state, {
        p: 0.85,
        duration: 0.7,
        ease: "none",
        onUpdate: updateProgress,
      })
      .to(state, {
        p: 1,
        duration: 0.3,
        ease: "power1.out",
        onUpdate: updateProgress,
      })
      .to(container, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: onDone,
      });

    return () => {
      tl.kill();
    };
  }, [onDone]);

  // Pre-fill the refs array
  segmentRefs.current = new Array(TOTAL_SEGMENTS).fill(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-12 bg-[#0f172a]"
    >
      <h1
        className="uppercase tracking-[4px] select-none text-[20px] md:text-[28px]"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: "transparent",
          WebkitTextStroke: "2px #00ffff",
          filter:
            "drop-shadow(0 0 5px #00ffff) drop-shadow(0 0 10px #00ffff)",
        }}
      >
        Loading...
      </h1>

      <div className="flex justify-center gap-0.5 md:gap-[6px]">
        {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              segmentRefs.current[i] = el;
            }}
            className="block w-1.5 h-1.5 md:w-3 md:h-3 bg-slate-700/50 rounded-[2px] flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
