"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import type { Transition } from "motion/react";

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

interface MoonProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const Moon = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  ...props
}: MoonProps) => {
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
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.path
          d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
          variants={{
            normal: { rotate: 0, scale: 1 },
            animate: { rotate: 8, scale: 1.05 },
          }}
          transition={defaultTransition}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { Moon };
