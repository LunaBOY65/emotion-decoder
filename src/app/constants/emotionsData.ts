// Taxonomy อารมณ์ทั้งหมดจาก Wheel of Emotions (3 ชั้น)

// รายชื่ออารมณ์หลัก 7 กลุ่มตามภาพวงล้อ พร้อมโทนสีประจำอารมณ์
export const CORE_EMOTIONS = {
  สุข: {
    color: "#FACC15", // สีเหลือง
    bgClass: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  },
  ทุกข์: {
    color: "#14B8A6", // สีเขียวมิ้นต์/คราม
    bgClass: "bg-teal-500/10 border-teal-500/30 text-teal-300",
  },
  กลัว: {
    color: "#FB923C", // สีส้ม
    bgClass: "bg-orange-500/10 border-orange-500/30 text-orange-300",
  },
  โกรธ: {
    color: "#EF4444", // สีแดง
    bgClass: "bg-red-500/10 border-red-500/30 text-red-300",
  },
  รังเกียจ: {
    color: "#22C55E", // สีเขียวสด
    bgClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  },
  เสียใจ: {
    color: "#6EE7B7", // สีเขียวอ่อน/พาสเทล
    bgClass: "bg-teal-400/10 border-teal-400/30 text-teal-200",
  },
  ประหลาดใจ: {
    color: "#A855F7", // สีม่วง
    bgClass: "bg-purple-500/10 border-purple-500/30 text-purple-300",
  },
} as const;

export type CoreEmotionType = keyof typeof CORE_EMOTIONS;
