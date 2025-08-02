"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";

interface DownloadProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const Download = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  ...props
}: DownloadProps) => {
  const controls = useAnimation();

  useEffect(() => {
    const loopAnimation = async () => {
      while (true) {
        await controls.start("animate");
        await new Promise((res) => setTimeout(res, 1000));
      }
    };

    loopAnimation();
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
          variants={{
            animate: { pathLength: 1, opacity: 1 },
          }}
          animate={controls}
          initial={"animate"}
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        />
        <motion.g
          variants={{
            animate: {
              y: [0, 3, 0],
              transition: {
                repeat: 0,
                duration: 1,
              },
            },
          }}
          animate={controls}
          initial={"animate"}
        >
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </motion.g>
      </svg>
    </div>
  );
};

export { Download };
