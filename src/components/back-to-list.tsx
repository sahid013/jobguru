"use client";

import { useEffect, useState } from "react";

/** Link pinned to the bottom-right corner; shows once the word list has scrolled out of view. */
export function BackToList({ targetId, label }: { targetId: string; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const update = () => setVisible(target.getBoundingClientRect().top < 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <a
      href={`#${targetId}`}
      lang="bn"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`back-to-list rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-brand shadow-[0_8px_20px_#034e3a24] transition-opacity ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ↑ {label}
    </a>
  );
}
