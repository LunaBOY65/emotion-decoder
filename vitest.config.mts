// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node", // ใช้ Node.js environment เพราะเราจะเริ่มเทสต์ API หลังบ้าน
  },
  resolve: {
    alias: {
      // ทำให้ Vitest รู้จักเครื่องหมาย @/ ว่าคือโฟลเดอร์ src/ เหมือนกับ Next.js
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
