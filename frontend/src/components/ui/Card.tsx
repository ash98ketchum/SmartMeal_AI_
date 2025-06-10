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
  // 3D tilt values
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
    hover:   { scale: 1.04, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`
        relative
        bg-white/60 backdrop-blur-sm
        border border-white/30
        rounded-2xl
        shadow-lg hover:shadow-2xl transition-shadow
        overflow-hidden
        ${glow ? 'ring-2 ring-green-200 ring-opacity-40' : ''}
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
      {/* Optional: add a subtle gradient stripe at the top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-300 to-orange-400" />

      <div className="relative p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
