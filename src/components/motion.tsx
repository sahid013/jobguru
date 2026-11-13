"use client";

import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, type HTMLMotionProps } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

// One motion vocabulary for the whole site: short, springy, never decorative.
// MotionConfig honours the OS "reduce motion" setting everywhere.

export const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={spring}>
      {children}
    </MotionConfig>
  );
}

/** Page content entrance — used by route templates so every navigation settles in softly. */
export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Height-animated show/hide for tree branches and panels. */
export function Collapse({ open, children, className }: { open: boolean; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className={className}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ height: { duration: 0.24, ease }, opacity: { duration: 0.18 } }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Rotates its child (a chevron) between closed and open. */
export function Rotate({ open, degrees = 90, children }: { open: boolean; degrees?: number; children: ReactNode }) {
  return (
    <motion.span className="inline-flex" animate={{ rotate: open ? degrees : 0 }} transition={spring}>
      {children}
    </motion.span>
  );
}

const MotionNextLink = motion.create(Link);

/** A Next.js link that gives a subtle press response. */
export function PressLink(props: ComponentProps<typeof MotionNextLink>) {
  return <MotionNextLink whileTap={{ scale: 0.97 }} {...props} />;
}

/** A button that gives a subtle press response. */
export function PressButton(props: HTMLMotionProps<"button">) {
  return <motion.button whileTap={{ scale: 0.97 }} {...props} />;
}

/** Lists whose items rise in one after another on first paint. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.li
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
      }}
    >
      {children}
    </motion.li>
  );
}
