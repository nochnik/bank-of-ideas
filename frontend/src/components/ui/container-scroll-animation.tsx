"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "motion/react";

export const ContainerScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0.85, 1] : [0.92, 1]);
  const cardY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <div
      className="h-[40rem] md:h-[52rem] relative"
      ref={containerRef}
    >
      <div
        className="sticky top-20 flex flex-col items-center"
        style={{ perspective: "1200px" }}
      >
        <ScrollCard rotate={rotate} scale={scale} cardY={cardY} cardOpacity={cardOpacity}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
};

export const ScrollCard = ({
  rotate,
  scale,
  cardY,
  cardOpacity,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  cardY: MotionValue<number>;
  cardOpacity: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        y: cardY,
        opacity: cardOpacity,
        transformOrigin: "center bottom",
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
        border: "1px solid var(--hl)",
        background: "var(--s2)",
        borderRadius: "30px",
      }}
      className="max-w-5xl mx-auto h-[28rem] md:h-[38rem] w-full p-2 md:p-6 shadow-2xl"
    >
      <div
        className="h-full w-full overflow-hidden rounded-2xl"
        style={{ background: "var(--s1)" }}
      >
        {children}
      </div>
    </motion.div>
  );
};
