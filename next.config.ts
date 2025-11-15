import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // อนุญาตให้โหลดรูปภาพจาก Supabase Storage
    remotePatterns: [
      {
        // โหลดรูปภาพจาก Supabase Storage
        protocol: "https",
        hostname: "zuvlrjqialugntncjcnp.supabase.co", // เปลี่ยนเป็นโดเมนของคุณ

      },
    ],
  },
};

export default nextConfig;
