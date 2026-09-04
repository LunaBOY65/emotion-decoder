// src\constants\emotionsData.ts
// Taxonomy อารมณ์ทั้งหมดจาก Wheel of Emotions (3 ชั้น)

// รายชื่ออารมณ์หลัก 7 กลุ่ม พร้อมสีพาสเทลและไอคอนใบหน้า
export const CORE_EMOTIONS = {
  สุข: {
    color: "#FDE047", // สีเหลืองพาสเทล
    bgClass: "bg-[#FDE047] text-neutral-900",
    mouth: "smile",
    angry: false,
  },
  ทุกข์: {
    color: "#99F6E4", // สีเขียวมิ้นต์พาสเทล
    bgClass: "bg-[#99F6E4] text-neutral-900",
    mouth: "flat",
    angry: false,
  },
  กลัว: {
    color: "#DDD6FE", // สีม่วงพาสเทล
    bgClass: "bg-[#DDD6FE] text-neutral-900",
    mouth: "wavy",
    angry: false,
  },
  โกรธ: {
    color: "#FDA4AF", // สีแดง/ชมพูพาสเทล
    bgClass: "bg-[#FDA4AF] text-neutral-900",
    mouth: "frown",
    angry: true,
  },
  รังเกียจ: {
    color: "#86EFAC", // สีเขียวพาสเทล
    bgClass: "bg-[#86EFAC] text-neutral-900",
    mouth: "zigzag",
    angry: false,
  },
  เศร้า: {
    color: "#BAE6FD", // สีฟ้าพาสเทล
    bgClass: "bg-[#BAE6FD] text-neutral-900",
    mouth: "frown",
    angry: false,
  },
  ประหลาดใจ: {
    color: "#FDBA74", // สีส้มพาสเทล
    bgClass: "bg-[#FDBA74] text-neutral-900",
    mouth: "open",
    angry: false,
  },
} as const;

export type CoreEmotionType = keyof typeof CORE_EMOTIONS;
