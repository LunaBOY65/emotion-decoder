// src/components/visualizer/WheelSlice.tsx
"use client";

import React from "react";

interface WheelSliceProps {
  core: string; // ชั้นที่ 1: อารมณ์หลัก (วงใน)
  secondary: string; // ชั้นที่ 2: อารมณ์รอง (วงกลาง)
  specific: string; // ชั้นที่ 3: ความรู้สึกเฉพาะเจาะจง (วงนอก)
  color: string; // โทนสีประจำอารมณ์หลัก เช่น #EF4444 (สีแดง)
}

export default function WheelSlice({
  core,
  secondary,
  specific,
  color,
}: WheelSliceProps) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* 1. วงล้อกราฟิก SVG 3 ชั้น */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {/* ชั้นที่ 3: วงนอกสุด (Specific) */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeDasharray="140 500"
            strokeLinecap="round"
            className="opacity-40 transition-all duration-700"
          />

          {/* ชั้นที่ 2: วงกลาง (Secondary) */}
          <circle
            cx="100"
            cy="100"
            r="56"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeDasharray="110 500"
            strokeLinecap="round"
            className="opacity-70 transition-all duration-700 delay-100"
          />

          {/* ชั้นที่ 1: วงในสุด (Core) */}
          <circle
            cx="100"
            cy="100"
            r="32"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeDasharray="80 500"
            strokeLinecap="round"
            className="opacity-100 transition-all duration-700 delay-200"
          />
        </svg>

        {/* จุดกึ่งกลางแสดงชื่ออารมณ์หลัก */}
        <div className="absolute text-center">
          <span className="text-xs text-neutral-400 block font-light">
            แกนอารมณ์
          </span>
          <span className="text-base font-bold text-white tracking-wide">
            {core}
          </span>
        </div>
      </div>

      {/* 2. ป้ายข้อความบอกลำดับ 3 ชั้น */}
      <div className="w-full space-y-2 mt-3">
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <span className="text-neutral-400">1. อารมณ์หลัก (Core)</span>
          <span className="font-semibold text-white">{core}</span>
        </div>

        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <span className="text-neutral-400">2. อารมณ์รอง (Secondary)</span>
          <span className="font-medium text-neutral-200">{secondary}</span>
        </div>

        <div
          className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl border font-medium"
          style={{ borderColor: `${color}60`, backgroundColor: `${color}15` }}
        >
          <span className="text-neutral-300">3. ความรู้สึกแท้จริง (Root)</span>
          <span className="font-bold text-white underline underline-offset-2">
            {specific}
          </span>
        </div>
      </div>
    </div>
  );
}
