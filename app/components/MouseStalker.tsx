import { useEffect, useRef } from "react";

const LERP = 0.18;
const OFFSET = 35;

export default function MouseStalker() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = elRef.current;
    if (!el) return;

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, animFrame = 0;

    function setPos(x: number, y: number) {
      el!.style.left = x + "px";
      el!.style.top = y + "px";
    }

    function reset() {
      const w = el!.offsetWidth || 0, h = el!.offsetHeight || 0;
      targetX = currentX = -w - 10;
      targetY = currentY = -h - 10;
      setPos(currentX, currentY);
    }

    function loop() {
      animFrame = 0;
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      setPos(currentX, currentY);
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.5) {
        animFrame = requestAnimationFrame(loop);
      }
    }

    function onMouseMove(e: MouseEvent) {
      targetX = e.clientX + OFFSET;
      targetY = e.clientY + OFFSET;
      if (!animFrame) animFrame = requestAnimationFrame(loop);
    }

    reset();
    el.style.opacity = "1";
    window.addEventListener("resize", reset);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", reset);
      window.removeEventListener("mousemove", onMouseMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={elRef}
      className="fixed top-0 left-0 z-[9998] pointer-events-none select-none opacity-0 text-[27px] leading-none"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      👁
    </div>
  );
}
