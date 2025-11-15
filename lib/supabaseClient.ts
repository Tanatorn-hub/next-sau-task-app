
// 1. นำเข้า (import) ฟังก์ชัน 'createClient'
//    มาจากแพ็คเกจ '@supabase/supabase-js' (ไลบรารี Supabase)
//    ฟังก์ชันนี้คือเครื่องมือหลักสำหรับสร้างการเชื่อมต่อ (client) ไปยัง Supabase
import { createClient } from '@supabase/supabase-js'

// 3. ดึงค่า Supabase URL จาก "Environment Variables" (ไฟล์ .env.local)
//    `process.env.NEXT_PUBLIC_SUPABASE_URL` คือการอ่านค่าตัวแปร
//    คำว่า 'NEXT_PUBLIC_' สำคัญมาก เพราะ Next.js จะอนุญาตให้โค้ดฝั่งเบราว์เซอร์ (Client) อ่านค่านี้ได้
//    `as string` เป็นการบอก TypeScript ว่า "เชื่อฉันเถอะว่าค่านี้จะเป็น string"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string

// 4. ดึงค่า Supabase Anon Key (คีย์สาธารณะ) จาก "Environment Variables"
//    ทำงานเหมือนบรรทัดบน แต่เป็นการดึง 'Anon Key' ซึ่งปลอดภัยที่จะเปิดเผยในฝั่งเบราว์เซอร์
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// 6. ตรวจสอบความปลอดภัย: เช็กว่าค่าที่ดึงมาในข้อ 3 หรือ 4 "ว่างเปล่า" หรือไม่
//    ถ้า `supabaseUrl` เป็นค่าว่าง (null, undefined, "")
//    หรือ (||) `supabaseKey` เป็นค่าว่าง
if (!supabaseUrl || !supabaseKey) {
  // 7. ถ้ามีค่าใดค่าหนึ่งว่างเปล่า ให้ "โยน Error" (throw new Error)
  //    นี่คือการ "สั่งให้แอปหยุดทำงาน" โดยตั้งใจ พร้อมแสดงข้อความเตือน
  //    เพื่อบอก Developer ว่า "ลืมตั้งค่าในไฟล์ .env.local หรือเปล่า?"
  //    (ซึ่งดีกว่าปล่อยให้แอปไปพังทีหลังตอนพยายามเชื่อมต่อ)
  throw new Error("Missing Supabase URL or Anon Key. Please check your .env.local file.")
}

// 10. (ถ้าไม่ error และมีค่าครบ)
//     เรียกใช้ฟังก์ชัน 'createClient' ที่ import มาในข้อ 1
//     โดยส่ง 'supabaseUrl' และ 'supabaseKey' ที่เราดึงมาเข้าไป
//     ผลลัพธ์ที่ได้คือ "Supabase Client" (ตัวเชื่อมต่อฐานข้อมูล)
//     เราเก็บผลลัพธ์นี้ไว้ในตัวแปรชื่อ 'supabase'
//     `export` หมายความว่า เราอนุญาตให้ไฟล์อื่นๆ ในโปรเจกต์
//     (เช่น page.tsx หรือ api/route.ts) สามารถ import ตัวแปร 'supabase' นี้ไปใช้งานได้
export const supabase = createClient(supabaseUrl, supabaseKey)