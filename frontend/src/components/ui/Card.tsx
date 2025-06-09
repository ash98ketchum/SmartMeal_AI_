// src/components/ui/Card.tsx
import React, { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = true,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);
  const springConfig = { damping: 20, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hoverEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  }
  function handleMouseLeave() {
    if (!hoverEffect) return;
    x.set(0);
    y.set(0);
  }

  const variants = {
    initial: { scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`
        bg-white shadow-md rounded-xl
        ${glow ? 'ring-2 ring-green-200 ring-opacity-50' : ''}
        ${className}
      `}
      style={{
        x: 0,
        y: 0,
        rotateX: hoverEffect ? springRotateX : 0,
        rotateY: hoverEffect ? springRotateY : 0,
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="initial"
      whileHover={hoverEffect ? 'hover' : undefined}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default Card;
