import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  key?: React.Key;
}

export default function ThreeDCard({ children, className = "", depth = 25 }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position du curseur par rapport au centre du composant (-0.5 à 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculer les angles de rotation (max 12 degrés pour rester élégant)
    const maxRotation = 12;
    setRotateX(-mouseY * maxRotation);
    setRotateY(mouseX * maxRotation);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered ? 1.03 : 1,
        z: isHovered ? depth : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.8,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className={`relative transform-gpu transition-shadow duration-300 ${
        isHovered 
          ? "shadow-[0_25px_60px_rgba(15,23,42,0.12),0_15px_30px_rgba(15,23,42,0.08)] z-10" 
          : "shadow-sm"
      } ${className}`}
    >
      {/* Reflet brillant (glare effect) pour accentuer l'aspect 3D métallique/verre */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/25 mix-blend-overlay"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: rotateY * 12,
            y: -rotateX * 12,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      </div>

      {/* Conteneur interne avec profondeur (Z-index 3D) */}
      <div 
        className="h-full w-full"
        style={{ 
          transform: `translateZ(${isHovered ? depth : 0}px)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
