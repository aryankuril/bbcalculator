// components/Button.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

interface ButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  text,
  href,
  onClick,
  className = "",
  disabled = false,
  target,
  rel,
}) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [textWidth, setTextWidth] = useState(0);

  const measure = useCallback(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth + 32);
    }
  }, []);

  useEffect(() => {
    measure();
  }, [text, measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const chars = (text ?? "").split("").map((char) =>
    char === " " ? "\u00A0" : char
  );

  const handleClick = () => {
    if (disabled) return;
    setHovered(false);
    setActive(true);
    setTimeout(() => setActive(false), 160);

    if (onClick) onClick();
  };

  const handlePointerEnter = () => !disabled && setHovered(true);
  const handlePointerLeave = () => {
    !disabled && setHovered(false);
    !disabled && setActive(false);
  };
  const handlePointerDown = () => !disabled && setActive(true);
  const handlePointerUp = () => !disabled && setActive(false);
  const handleBlur = () => {
    setHovered(false);
    setActive(false);
  };

  const content = (
    <div
      className={`relative z-10 px-4 py-2 h-12 flex items-center uppercase body3 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <span ref={textRef} className="flex items-center">
        {chars.map((char, idx) => (
          <span
            key={idx}
            className="relative block overflow-hidden lg:h-7 h-6 w-auto"
            style={{ transitionDelay: `${idx * 30}ms` }}
          >
            <>
              {/* top */}
              <span
                className={`block transform transition-transform duration-300 ease-in-out ${
                  hovered && !disabled ? "-translate-y-7" : "translate-y-0"
                }`}
              >
                {char}
              </span>

              {/* bottom */}
              <span
                className={`block absolute left-0 top-0 transform transition-transform duration-300 ease-in-out ${
                  hovered && !disabled ? "translate-y-0" : "translate-y-7"
                }`}
                aria-hidden
              >
                {char}
              </span>
            </>
          </span>
        ))}

        <span className="text-[18px] font-normal select-none ml-1">+</span>
      </span>
    </div>
  );

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onBlur={handleBlur}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-in-out h-12 bg-[var(--color-highlight)] pointer-events-none`}
        style={{
          width: hovered && !disabled ? textWidth : 48,
          left: -5,
          opacity: disabled ? 0.5 : 1,
          transform: active ? "scale(0.97)" : undefined,
        }}
      />

      {href ? (
        target ? (
          <a
            href={href}
            target={target}
            rel={rel}
            className={
              disabled ? "pointer-events-none relative z-10" : "relative z-10"
            }
            onClick={handleClick}
            onBlur={handleBlur}
          >
            {content}
          </a>
        ) : (
          <Link
            href={disabled ? "#" : href}
            className={
              disabled ? "pointer-events-none relative z-10" : "relative z-10"
            }
            onClick={handleClick}
            onBlur={handleBlur}
          >
            {content}
          </Link>
        )
      ) : (
        <button
          onClick={handleClick}
          disabled={disabled}
          className="relative z-10 body3"
          onBlur={handleBlur}
        >
          {content}
        </button>
      )}
    </div>
  );
};

export default Button;
