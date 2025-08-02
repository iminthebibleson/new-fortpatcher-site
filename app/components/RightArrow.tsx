"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";

interface ArrowProps extends React.SVGAttributes<SVGSVGElement> {
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

const RightArrow = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  ...props
}: ArrowProps) => {
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
          d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
          variants={pathVariants}
          initial="initial"
          animate={controls}
        />
      </motion.svg>
    </div>
  );
};

export { RightArrow };
