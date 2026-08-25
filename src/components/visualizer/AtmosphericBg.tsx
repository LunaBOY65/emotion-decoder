// src/components/visualizer/AtmosphericBg.tsx
"use client";

import React from "react";

interface AtmosphericBgProps {
  color?: string; // รหัสสีประจำอารมณ์ เช่น #EF4444 (ถ้ายังไม่วิเคราะห์จะใช้สีเริ่มต้น)
}

export default function AtmosphericBg({ color = "#3b82f6" }: AtmosphericBgProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* วงแสงด้านบนซ้าย */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] opacity-25 transition-colors duration-1000 ease-out"
        style={{ backgroundColor: color }}
      />

      {/* วงแสงด้านล่างขวา */}
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[320px] h-[320px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ease-out"
        style={{ backgroundColor: color }}
      />

      {/* วงแสงตรงกลาง (จางๆ) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[140px] opacity-15 transition-colors duration-1000 ease-out"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}