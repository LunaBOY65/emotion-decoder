// src/components/visualizer/AtmosphericBg.tsx
"use client";

import React from "react";

interface AtmosphericBgProps {
  color?: string; // รหัสสีประจำอารมณ์ ถ้ายังไม่วิเคราะห์จะใช้สีเริ่มต้น
}

export default function AtmosphericBg({
  color = "#F9FAFB",
}: AtmosphericBgProps) {
  // ใช้สีเป็นสีขาวอมเทานิดๆ สำหรับหน้าแรก
  return (
    // เปลี่ยนมาใช้การเทสีพื้นหลังเต็มจอแบบเรียบๆ สไตล์มินิมอล
    <div
      className="fixed inset-0 transition-colors duration-700 ease-out -z-10"
      style={{ backgroundColor: color }}
    />
  );
}
