"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import type { Transition } from "motion/react";

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

interface SunProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  className?: string;
}

const Sun = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  className,
}: SunProps) => {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    async function animateLoop() {
      while (isMounted) {
        await controls.start("animate");
        await new Promise((r) => setTimeout(r, 1000));
        await controls.start("normal");
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    animateLoop();

    return () => {
      isMounted = false;
      controls.stop();
    };
  }, [controls]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
      }}
    >
      <motion.svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={controls}
        initial="normal"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="4"
          variants={{
            normal: { scale: 1 },
            animate: { scale: 1.2 },
          }}
          transition={defaultTransition}
        />
        {[
          "M12 2v2",
          "M12 20v2",
          "M4.93 4.93 L6.34 6.34",
          "M17.66 17.66 L19.07 19.07",
          "M2 12h2",
          "M20 12h2",
          "M6.34 17.66 L4.93 19.07",
          "M19.07 4.93 L17.66 6.34",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            variants={{
              normal: { opacity: 1, rotate: 0 },
              animate: { opacity: 0.6, rotate: 5 },
            }}
            transition={defaultTransition}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export { Sun };
