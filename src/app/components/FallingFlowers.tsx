"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function FallingFlowers() {
  const flowerImages = [
    "/images/flower1.svg",
    "/images/flower2.svg",
    "/images/flower3.svg",
  ];

  const [flowers, setFlowers] = useState<any[]>([]);
  const [active, setActive] = useState(true); // point 10 → enable/disable animation
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) return;

    // Create new flower function
    const createFlower = () => {
      const randomImage =
        flowerImages[Math.floor(Math.random() * flowerImages.length)];

      const newFlower = {
        id: Math.random(),
        img: randomImage,
        startX: Math.random() * 100,
        endX: Math.random() * 100,
        duration: 6 + Math.random() * 4,
        size: 20 + Math.random() * 20,
        rotateStart: Math.random() * 30 - 15,
        rotateEnd: Math.random() * 50 - 25,
      };

      setFlowers((prev) => {
        const updated = [...prev, newFlower];

        // limit → prevent lag
        if (updated.length > 20) updated.shift();
        return updated;
      });
    };

    intervalRef.current = setInterval(createFlower, 600);

    // ❌ stop after 20 seconds
    const stopTimer = setTimeout(() => {
      setActive(false);             // Stop creating new flowers
      setFlowers([]);               // Remove everything from DOM
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 600000); // 20 sec

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(stopTimer);
    };
  }, [active]);

  // OPTIONAL:
  // Restart flowers automatically every 30 sec
  // uncomment to enable
  /*
  useEffect(() => {
    if (!active) {
      const restartTimer = setTimeout(() => {
        setActive(true);
      }, 30000); // restart after 30 sec
      return () => clearTimeout(restartTimer);
    }
  }, [active]);
  */

  const removeFlower = (id: number) => {
    setFlowers((prev) => prev.filter((f) => f.id !== id));
  };

  if (!active) return null; // point 10 → No DOM = no lag

  return (
    <div className="pointer-events-none fixed inset-0 w-full h-full overflow-hidden z-[9999]">
      {flowers.map((f) => (
        <motion.div
          key={f.id}
          initial={{
            y: -150,
            x: `${f.startX}vw`,
            rotate: f.rotateStart,
            opacity: 1,
          }}
          animate={{
            y: "105vh",
            x: `${f.endX}vw`,
            rotate: f.rotateEnd,
            opacity: 1,
          }}
          transition={{
            duration: f.duration,
            ease: "easeInOut",
          }}
          onAnimationComplete={() => removeFlower(f.id)}
          className="absolute"
        >
          <Image
            src={f.img}
            alt="flower"
            width={f.size}
            height={f.size}
            unoptimized
            priority
          />
        </motion.div>
      ))}
    </div>
  );
}
