// src/components/visualizer/WheelSlice.tsx
"use client";

import React from "react";

interface WheelSliceProps {
  core: string; // ชั้นที่ 1: อารมณ์หลัก (วงใน)
  secondary: string; // ชั้นที่ 2: อารมณ์รอง (วงกลาง)
  specific: string; // ชั้นที่ 3: ความรู้สึกเฉพาะเจาะจง (วงนอก)
  color: string; // โทนสีประจำอารมณ์หลัก
}

export default function WheelSlice({
  core,
  secondary,
  specific,
  color,
}: WheelSliceProps) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* 2. ป้ายข้อความบอกลำดับ 3 ชั้น */}
      <div className="w-full space-y-2 mt-3">
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-white/70 border border-neutral-900/10">
          <span className="text-neutral-500">1. อารมณ์หลัก (Core)</span>
          <span className="font-semibold text-neutral-900">{core}</span>
        </div>

        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-white/70 border border-neutral-900/10">
          <span className="text-neutral-500">2. อารมณ์รอง (Secondary)</span>
          <span className="font-medium text-neutral-800">{secondary}</span>
        </div>

        <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-xl bg-white/80 border border-neutral-900/10 font-medium">
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: color }}
            />
            3. ความรู้สึกแท้จริง (Root)
          </span>
          <span className="font-bold text-neutral-900 underline underline-offset-2">
            {specific}
          </span>
        </div>
      </div>
    </div>
  );
}
