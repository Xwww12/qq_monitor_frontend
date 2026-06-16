import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BackgroundGlow from "./BackgroundGlow";

const FILL_COLOR = "rgb(147, 76, 204)";
const FILL_GLOW = "0 0 6px rgba(147, 76, 204, 0.5)";

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // 小屏幕减少格子数（20 格），大屏 32 格
  const [segmentCount] = useState(() => {
    if (typeof window === "undefined") return 32;
    return window.innerWidth < 768 ? 20 : 32;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const state = { p: 0 };

    function updateProgress() {
      const n = Math.ceil(Math.max(0, Math.min(1, state.p)) * segmentCount);
      for (let i = 0; i < segmentCount; i++) {
        const el = segmentRefs.current[i];
        if (el) {
          el.style.background = i < n ? FILL_COLOR : "rgba(51,65,85,0.5)";
          el.style.boxShadow = i < n ? FILL_GLOW : "none";
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
  }, [onDone, segmentCount]);

  // Pre-fill the refs array
  segmentRefs.current = new Array(segmentCount).fill(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-12"
    >
      {/* 背景光晕，和主页一致 */}
      <div className="absolute inset-0 opacity-30">
        <BackgroundGlow />
      </div>

      <img
        src="/img/open-screen/开屏图片.jpg"
        alt="Loading"
        className="w-[160px] md:w-[200px] select-none rounded-xl"
      />

      <div className="flex justify-center gap-0.5 md:gap-[6px]">
        {Array.from({ length: segmentCount }, (_, i) => (
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
