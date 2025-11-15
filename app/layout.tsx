// 1. Import "ไทป์" (type) Metadata จาก Next.js
//    เราใช้สิ่งนี้เพื่อช่วยตรวจสอบ (ด้วย TypeScript) ว่า object 'metadata' ของเรา
//    มีโครงสร้างที่ถูกต้องตามที่ Next.js กำหนด
import type { Metadata } from "next";

// 2. Import ฟังก์ชันสำหรับโหลดฟอนต์ 'Kanit' (ฟอนต์ "คณิต")
//    นี่คือระบบจัดการฟอนต์ของ Next.js (next/font/google)
//    ที่จะช่วยดาวน์โหลดและ optimize ฟอนต์ให้เราอัตโนมัติ
import { Kanit } from "next/font/google";

// 3. Import ไฟล์ CSS หลัก (Global Stylesheet)
//    ไฟล์นี้จะถูกนำไปใช้กับทุกหน้าในแอปพลิเคชัน
//    (มักจะเป็นที่อยู่ของ base styles หรือ Tailwind CSS)
import "./globals.css";

// 4. สร้างตัวแปร 'kanit' โดยเรียกใช้ฟังก์ชัน Kanit ที่ import มา
//    นี่คือการ "ตั้งค่า" ฟอนต์ที่เราจะใช้
const kanit = Kanit({
  // 4.1 ระบุว่าให้โหลดเฉพาะ "subset" ของฟอนต์ที่เป็นภาษาไทย
  //     (เพื่อลดขนาดไฟล์ ไม่ต้องโหลดตัวอักษรภาษาอื่นที่ไม่จำเป็น)
  subsets: ["thai"],

  // 4.2 ระบุ "น้ำหนัก" (weight) ของฟอนต์ที่เราต้องการใช้งานทั้งหมดในแอป
  //     Next.js จะไปโหลดน้ำหนักเหล่านี้มาให้ครบ
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// 5. สร้างและ export "Metadata" (ข้อมูล SEO) สำหรับแอปพลิเคชัน
//    Next.js จะนำ object นี้ไปสร้าง <head> tag ให้อัตโนมัติ
//    นี่คือ Metadata ของ "Root" (ราก) ซึ่งจะเป็นค่าเริ่มต้นของทุกหน้า
export const metadata: Metadata = {
  // 5.1 title: ข้อความที่จะแสดงบนแท็บของเบราว์เซอร์
  title: "Manage Task App by Tanatorn SAU",

  // 5.2 description: คำอธิบายเว็บไซต์ (สำคัญต่อ SEO และการแสดงผลใน Google)
  description: "เว็บแอพพลิเคชันสำหรับจัดการงานที่สร้างโดย Tanatorn SAU",

  // 5.3 keywords: คำค้นหาที่เกี่ยวข้อง (ช่วย SEO เล็กน้อย)
  keywords: [
    "Task Management",
    "To-Do List",
    "Productivity",
    "Project Management",
    "Task Organizer",
    "Work Planner",
  ],

  // 5.4 authors: ข้อมูลผู้สร้าง
  authors: [{ name: "Tanatorn SAU", url: "https://github.com/TanatornSAU" }],
};

// 6. นี่คือ "RootLayout" (โครงสร้างหลัก)
//    เป็น Component หลักที่จะ "ห่อ" ทุกหน้าในเว็บไซต์ของเรา
export default function RootLayout({
  // 6.1 "children" คือ props ที่ Next.js ส่งมาให้
  //     มันคือ "เนื้อหาของเพจ" (เช่น page.tsx) ที่กำลังจะถูกแสดงผล
  children,
}: Readonly<{
  // 6.2 กำหนดไทป์ของ children ว่าเป็น ReactNode (อะไรก็ได้ที่ React render ได้)
  children: React.ReactNode;
}>) {
  // 7. ส่วนที่ return JSX (HTML) ที่เป็นโครงสร้างหลักของเว็บ
  return (
    // 7.1 แท็ก <html> (โครงสร้างบนสุด)
    <html lang="en">
      {/* 7.2 แท็ก <body>
            - เราใช้ className={`${kanit.className}`}
            - นี่คือการ "สั่งให้ใช้ฟอนต์ Kanit" ที่เราตั้งค่าไว้ (ในข้อ 4)
            - Next.js จะสร้างชื่อคลาส (className) ที่เหมาะสมให้เอง
            - ผลคือ ทุกอย่างที่อยู่ใน <body> จะใช้ฟอนต์ Kanit เป็นค่าเริ่มต้น
      */}
      <body className={`${kanit.className}`}>
        {/*
          7.3 {children}
              - นี่คือจุดสำคัญที่สุด
              - เป็นตำแหน่งที่จะนำ "เนื้อหาของแต่ละหน้า" (ที่ส่งมาจาก Next.js) มาวาง
              - เช่น เมื่อผู้ใช้ไปที่ /alltask, เนื้อหาของ /alltask/page.tsx จะมาแสดงตรงนี้
              - Layout นี้เปรียบเหมือน "กรอบรูป" และ {children} คือ "รูปภาพ" ที่เปลี่ยนไปเรื่อยๆ
        */}
        {children}
      </body>
    </html>
  );
}
