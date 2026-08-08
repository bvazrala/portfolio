"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    // Preserve the normal cursor for touch devices and people who have
    // requested reduced motion.
    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = dotRef.current;
    const glow = glowRef.current;

    if (!dot || !glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    let dotX = targetX;
    let dotY = targetY;
    let dotVelocityX = 0;
    let dotVelocityY = 0;

    let glowX = targetX;
    let glowY = targetY;
    let glowVelocityX = 0;
    let glowVelocityY = 0;

    let interactive = false;
    let pressed = false;
    let visible = false;
    let frame = 0;

    document.documentElement.classList.add("custom-cursor-enabled");

    const updateVisibility = () => {
      dot.style.opacity = visible ? "1" : "0";
      glow.style.opacity = visible
        ? interactive
          ? "0.8"
          : "0.5"
        : "0";
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!visible) {
        dotX = targetX;
        dotY = targetY;
        glowX = targetX;
        glowY = targetY;
        visible = true;
      }

      const target =
        event.target instanceof Element
          ? event.target.closest(INTERACTIVE_SELECTOR)
          : null;

      const nextInteractive = target !== null;

      if (nextInteractive !== interactive) {
        interactive = nextInteractive;
        dot.dataset.interactive = String(interactive);
        glow.dataset.interactive = String(interactive);
      }

      updateVisibility();
    };

    const onPointerDown = () => {
      pressed = true;
    };

    const onPointerUp = () => {
      pressed = false;
    };

    const onPointerLeave = () => {
      visible = false;
      updateVisibility();
    };

    const tick = () => {
      // Main cursor: tighter spring.
      dotVelocityX =
        (dotVelocityX + (targetX - dotX) * 0.14) * 0.72;
      dotVelocityY =
        (dotVelocityY + (targetY - dotY) * 0.14) * 0.72;

      dotX += dotVelocityX;
      dotY += dotVelocityY;

      // Glow: softer spring that trails the main cursor.
      glowVelocityX =
        (glowVelocityX + (dotX - glowX) * 0.06) * 0.76;
      glowVelocityY =
        (glowVelocityY + (dotY - glowY) * 0.06) * 0.76;

      glowX += glowVelocityX;
      glowY += glowVelocityY;

      const dotScale = pressed ? 0.75 : interactive ? 2.2 : 1;
      const glowScale = interactive ? 1.4 : 1;

      dot.style.transform = `
        translate3d(${dotX}px, ${dotY}px, 0)
        translate(-50%, -50%)
        scale(${dotScale})
      `;

      glow.style.transform = `
        translate3d(${glowX}px, ${glowY}px, 0)
        translate(-50%, -50%)
        scale(${glowScale})
      `;

      frame = window.requestAnimationFrame(tick);
    };

    document.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener(
      "pointerleave",
      onPointerLeave,
    );
    window.addEventListener("blur", onPointerLeave);

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      window.removeEventListener("blur", onPointerLeave);

      document.documentElement.classList.remove(
        "custom-cursor-enabled",
      );
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="custom-cursor-glow"
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        aria-hidden="true"
      />
    </>
  );
}
