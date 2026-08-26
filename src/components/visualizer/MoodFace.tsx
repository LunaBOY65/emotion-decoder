// src/components/visualizer/MoodFace.tsx
// หน้าตาคาแรกเตอร์เส้นเรียบง่าย ใช้แทนอิโมจิ ให้แอปมีสไตล์เป็นของตัวเอง
"use client";

export type MouthType =
  | "smile"
  | "frown"
  | "open"
  | "wavy"
  | "zigzag"
  | "think"
  | "flat";

interface MoodFaceProps {
  mouth?: MouthType;
  angry?: boolean; // true = คิ้วหักมุมแบบโกรธ
  size?: number;
  className?: string;
}

// เก็บรูปทรงปากแต่ละแบบไว้ตรงนี้ที่เดียว อยากเปลี่ยนหน้าตาก็แก้ตรงนี้พอ
const MOUTH_PATHS: Record<MouthType, string> = {
  smile: "M32,58 Q50,76 68,58", // ยิ้มกว้าง โค้งลง
  frown: "M32,68 Q50,52 68,68", // เศร้า/โกรธ โค้งขึ้น
  wavy: "M30,62 Q38,54 46,62 Q54,70 62,62 Q70,54 78,62", // สั่นๆ แบบกลัว
  zigzag: "M30,62 L38,68 L46,60 L54,68 L62,60 L70,68", // ฟันปลา แบบรังเกียจ
  think: "M38,64 L62,64", // เส้นตรง แบบกำลังคิด
  flat: "M34,64 L66,64", // เส้นตรง แบบเหนื่อยๆ
  open: "", // ใช้วงรีแทน (ดูด้านล่าง)
};

export default function MoodFace({
  mouth = "smile",
  angry = false,
  size = 80,
  className = "",
}: MoodFaceProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* คิ้ว โชว์เฉพาะตอนโกรธ */}
      {angry && (
        <>
          <line
            x1="24"
            y1="32"
            x2="40"
            y2="38"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="76"
            y1="32"
            x2="60"
            y2="38"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      )}

      {/* ตาสองข้าง เป็นจุดกลมๆ */}
      <circle cx="34" cy="46" r="5" fill="currentColor" />
      <circle cx="66" cy="46" r="5" fill="currentColor" />

      {/* ปาก: ถ้าเป็น "open" วาดวงรีแทนเส้น */}
      {mouth === "open" ? (
        <ellipse
          cx="50"
          cy="65"
          rx="10"
          ry="13"
          fill="currentColor"
          opacity="0.9"
        />
      ) : (
        <path
          d={MOUTH_PATHS[mouth]}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
