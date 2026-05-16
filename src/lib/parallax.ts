"use client";

import { RefObject } from "react";
import {
  MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export type ParallaxSpec = {
  yIn: [number, number];
  yOut: [number, number];
  scaleOut?: [number, number];
  opacityOut?: [number, number];
};

export type ParallaxResult = {
  y: MotionValue<number>;
  scale?: MotionValue<number>;
  opacity?: MotionValue<number>;
};

export function useParallax(
  target: RefObject<HTMLElement | null>,
  spec: ParallaxSpec,
): ParallaxResult {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });

  const baseY = useTransform(
    scrollYProgress,
    spec.yIn,
    prefersReducedMotion ? [0, 0] : spec.yOut,
  );
  const y = useSpring(baseY, {
    stiffness: 90,
    damping: 18,
    mass: 0.3,
  });

  const scale = spec.scaleOut
    ? useSpring(
        useTransform(
          scrollYProgress,
          spec.yIn,
          prefersReducedMotion
            ? [spec.scaleOut[0], spec.scaleOut[0]]
            : spec.scaleOut,
        ),
        {
          stiffness: 90,
          damping: 18,
          mass: 0.3,
        },
      )
    : undefined;

  const opacity = spec.opacityOut
    ? useSpring(
        useTransform(
          scrollYProgress,
          spec.yIn,
          prefersReducedMotion
            ? [spec.opacityOut[0], spec.opacityOut[0]]
            : spec.opacityOut,
        ),
        {
          stiffness: 90,
          damping: 18,
          mass: 0.3,
        },
      )
    : undefined;

  return { y, scale, opacity };
}
