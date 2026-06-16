import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedPanelProps {
  index: number;
  className?: string;
  children: React.ReactNode;
}

export default function AnimatedPanel({ index, className, children }: AnimatedPanelProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  // Spring pop-in on mount, staggered by index
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // 先仅隐藏（不设 scale），让 Nivo 图表在完整布局尺寸下完成 ResizeObserver 测量
    gsap.set(el, { opacity: 0 });

    // 双 RAF 确保浏览器布局和 Nivo 测量全部完成，再启动 scale 动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.fromTo(el,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            delay: 0.3 + index * 0.25,
            onComplete: () => {
              readyRef.current = true;
            },
          }
        );
      });
    });
  }, [index]);

  // Parallax hover: panel shifts opposite to mouse direction
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const maxShift = 10;

    const handleMouseMove = (e: MouseEvent) => {
      if (!readyRef.current) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      gsap.to(el, {
        x: -deltaX * maxShift,
        y: -deltaY * maxShift,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      if (!readyRef.current) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
