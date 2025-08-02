"use client";

import { motion, useAnimation, type Variants, type SVGMotionProps } from "framer-motion";
import { useEffect } from "react";

interface GithubProps extends SVGMotionProps<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const pathVariants: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
  draw: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

const Github = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  ...props
}: GithubProps) => {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    async function loop() {
      while (isMounted) {
        await controls.start("draw");
        await new Promise((res) => setTimeout(res, 2000));
        await controls.start("initial");
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    loop();

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.svg
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
          d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          variants={pathVariants}
          initial="initial"
          animate={controls}
        />
        <motion.path
          d="M9 18c-4.51 2-5-2-7-2"
          variants={pathVariants}
          initial="initial"
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};

export { Github };
