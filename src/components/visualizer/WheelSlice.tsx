// src/components/visualizer/WheelSlice.tsx
"use client";

interface WheelSliceProps {
  core: string;
  secondary: string;
  specific: string;
  color: string;
}

export default function WheelSlice({
  core,
  secondary,
  specific,
}: WheelSliceProps) {
  return (
    <div className="w-full space-y-2">
      {/* ชั้น 1 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/70 border border-neutral-900/8">
        <span className="text-[11px] text-neutral-500">อารมณ์หลัก</span>
        <span className="text-sm font-semibold text-neutral-900">{core}</span>
      </div>

      {/* ชั้น 2 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/70 border border-neutral-900/8">
        <span className="text-[11px] text-neutral-500">อารมณ์รอง</span>
        <span className="text-sm font-medium text-neutral-800">
          {secondary}
        </span>
      </div>

      {/* ชั้น 3 (เด่นสุด) */}
      <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white/85 border border-neutral-900/10">
        <span className="flex items-center gap-2 text-[11px] text-neutral-600">
          ความรู้สึกแท้จริง
        </span>
        <span className="text-sm font-bold text-neutral-900 underline underline-offset-2">
          {specific}
        </span>
      </div>
    </div>
  );
}
