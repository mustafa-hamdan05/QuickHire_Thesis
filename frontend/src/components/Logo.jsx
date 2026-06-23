import React, { useId } from "react";

// QuickHire logo — tile monogram.
// Usage: <Logo size={42} />  (navbar)  ·  <Logo size={360} />  (hero)
export default function Logo({ size = 44 }) {
  const gid = useId(); // unique gradient id so multiple logos on one page never clash

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="QuickHire logo"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cd2a3e" />
          <stop offset="1" stopColor="#00843d" />
        </linearGradient>
      </defs>
      <rect x="14" y="14" width="92" height="92" rx="26" fill={`url(#${gid})`} />
      <text
        x="56"
        y="80"
        fontFamily="'Inter', Arial, sans-serif"
        fontSize="62"
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
      >
        Q
      </text>
      <path d="M80 40 L72 54 L79 54 L77 66 L88 50 L81 50 Z" fill="#ffffff" />
    </svg>
  );
}
