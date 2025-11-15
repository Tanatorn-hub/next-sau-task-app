// 1. กำหนดให้ไฟล์นี้เป็น Client Component
// จำเป็นต้องใช้ เพราะเรามีการใช้ React Hooks (useState) และ event handlers (onChange, onSubmit)
"use client";

// 2. Import เครื่องมือที่จำเป็น
import Image from "next/image"; // Import คอมโพเนนต์ Image ของ Next.js
import task from "./../../assets/images/task.png"; // Import รูปภาพ logo
import Link from "next/link"; // Import คอมโพเนนต์ Link สำหรับการนำทาง
import Footer from "../../components/footer"; // Import คอมโพเนนต์ Footer
import { useState } from "react"; // Import React Hook 'useState'
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

// 3. เริ่มต้นคอมโพเนนต์หลักของหน้า (Page Component)
export default function Page() {
  // 4. สร้างตัวแปร State สำหรับจัดการข้อมูลในฟอร์ม
  const [title, setTitle] = useState(""); // State สำหรับเก็บ "ชื่องาน"
  const [detail, setDetail] = useState(""); // State สำหรับเก็บ "รายละเอียดงาน"
  const [imageFile, setImageFile] = useState<File | null>(null); // State สำหรับเก็บ "ไฟล์รูปภาพ" (ก้อนข้อมูล) ที่ผู้ใช้เลือก
  const [imagePreview, setImagePreview] = useState(""); // State สำหรับเก็บ "URL ของรูปภาพ" ที่จะแสดงพรีวิว
  const [isCompleted, setIsCompleted] = useState(false); // State สำหรับเก็บ "สถานะงาน" (ค่าเริ่มต้นคือ false - ยังไม่เสร็จ)

  // 5. ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้ "เลือกรูปภาพ"
  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 5.1. ดึงไฟล์แรกที่ผู้ใช้เลือก (ถ้ามี)
    const file = event.target.files?.[0];

    // 5.2. ถ้ามีไฟล์
    if (file) {
      // 5.2.1. เก็บ "ไฟล์" (ก้อนข้อมูล) ไว้ใน state 'imageFile' (เพื่อเตรียมอัปโหลด)
      setImageFile(file);
      // 5.2.2. สร้าง URL ชั่วคราว (local URL) จากไฟล์นั้น
      //        แล้วเก็บไว้ใน state 'imagePreview' เพื่อแสดงรูปที่ผู้ใช้เพิ่งเลือกทันที
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 6. ฟังก์ชันหลัก: เมื่อผู้ใช้กด "บันทึกงานใหม่" (submit ฟอร์ม)
  const handleUploadAndSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    // 6.1. ป้องกันไม่ให้หน้าเว็บโหลดใหม่ (พฤติกรรมปกติของ form)
    event.preventDefault();

    // 6.2. ตรวจสอบข้อมูลเบื้องต้น (Validation)
    if (title.trim() == "" || detail.trim() == "") {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return; // หยุดทำงานถ้าข้อมูลไม่ครบ
    }

    // 6.3. สร้างตัวแปรเก็บ image_url (ค่าเริ่มต้นคือ string ว่าง)
    let imageUrl = "";

    // 6.4. *** ส่วนอัปโหลดรูป: ตรวจสอบว่าผู้ใช้ได้ "เลือกไฟล์รูป" หรือไม่ ***
    // (ถ้า 'imageFile' ไม่ใช่ null แปลว่ามีการเลือกรูป)
    if (imageFile) {
      // 6.4.1. สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน โดยใช้เวลา (Date.now())
      const newFileName = `${Date.now()}_${imageFile.name}`;

      // 6.4.2. อัปโหลด "ไฟล์" (imageFile) ไปยัง Supabase Storage
      //        ใน bucket ที่ชื่อ 'task_bk' ด้วยชื่อไฟล์ใหม่ 'newFileName'
      const { data, error } = await supabase.storage
        .from("task_bk")
        .upload(newFileName, imageFile);

      // 6.4.3. ตรวจสอบ error จากการอัปโหลดไฟล์
      if (error) {
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      } else {
        // 6.4.4. ถ้าอัปโหลดสำเร็จ: ไปดึง Public URL ของไฟล์ที่เพิ่งอัปโหลด
        const { data } = supabase.storage
          .from("task_bk")
          .getPublicUrl(newFileName);

        // 6.4.5. นำ Public URL ที่ได้มา อัปเดตค่าในตัวแปร 'imageUrl'
        //        เพื่อเตรียมบันทึกลง Database
        imageUrl = data.publicUrl;
      }
    }
    // (ถ้า `imageFile` เป็น null (คือผู้ใช้ไม่ใส่รูป) โค้ดใน if นี้ทั้งหมดจะถูกข้ามไป
    // และ 'imageUrl' จะยังคงเป็น "" (string ว่าง) ตามค่าเริ่มต้น)

    // 6.5. บันทึกข้อมูล (Insert) ลงตาราง 'task_tb' ใน Supabase Database
    const { data, error } = await supabase.from("task_tb").insert({
      title: title, // ค่าจาก state
      detail: detail, // ค่าจาก state
      image_url: imageUrl, // ค่า URL (จะเป็น "" ถ้าไม่อัปโหลด, หรือเป็น Public URL ถ้าอัปโหลด)
      is_completed: isCompleted, // ค่าจาก state
    });

    // 6.6. ตรวจสอบ error จากการ insert database
    if (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      console.log(error.message);
      return;
    }

    // 6.7. ถ้าทุกอย่างสำเร็จ
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");

    // 6.8. เปลี่ยนหน้า (redirect) กลับไปหน้า '/alltask'
    //      (ใน Next.js ควรใช้ useRouter().push('/alltask') จะดีกว่า)
    window.location.href = "/alltask";
  };

  // 7. ส่วนของ JSX (HTML) ที่จะแสดงผลบนหน้าจอ
  return (
    <>
      <div className="flex flex-col items-center pb-30">
        {/* 7.1. ส่วนหัว (Logo และ Title) */}
        <Image className="mt-20" src={task} alt="Task" width={120} />
        <h1 className="mt-8 text-2xl font-bold text-blue-700">
          Manage Task App
        </h1>
        <h1 className="mt-2 text-lg text-blue-700">บริการจัดการงานที่ทำ</h1>

        {/* 7.2. ส่วนฟอร์มเพิ่มงาน */}
        <div className="w-3xl border border-gray-500 p-10 mx-auto rounded-xl mt-5">
          <h1 className="text-xl font-bold text-center">➕ เพิ่มงานใหม่</h1>

          {/* 7.3. ตัวฟอร์ม: เมื่อกด submit ให้เรียกฟังก์ชัน handleUploadAndSave */}
          <form onSubmit={handleUploadAndSave} className="w-full space-y-4">
            {/* 7.4. Input: ชื่องาน */}
            <div>
              <label>ชื่องาน</label>
              <input
                value={title} // แสดงค่าจาก state 'title'
                onChange={(e) => setTitle(e.target.value)} // เมื่อพิมพ์ ให้อัปเดต state 'title'
                type="text"
                className="w-full border rounded-lg p-2"
                required // บังคับกรอก
              />
            </div>

            {/* 7.5. Input: รายละเอียด (Textarea) */}
            <div>
              <label>รายละเอียด</label>
              <textarea
                value={detail} // แสดงค่าจาก state 'detail'
                onChange={(e) => setDetail(e.target.value)} // เมื่อพิมพ์ ให้อัปเดต state 'detail'
                className="w-full border rounded-lg p-2"
                rows={5}
                required // บังคับกรอก
              />
            </div>

            {/* 7.6. Input: อัปโหลดรูป */}
            <div>
              <label className="block mb-1 font-medium">อัปโหลดรูป</label>
              {/* Input file จริงๆ จะถูกซ่อนไว้ (className="hidden") */}
              <input
                id="fileInput"
                type="file"
                accept="image/*" // รับเฉพาะไฟล์รูปภาพ
                className="hidden"
                onChange={handleSelectImage} // เมื่อเลือกไฟล์ ให้เรียกฟังก์ชัน handleSelectImage
              />
              {/* นี่คือ "ปุ่มปลอม" (label) ที่ผู้ใช้เห็นและกด */}
              {/* ใช้ 'htmlFor="fileInput"' เพื่อเชื่อมโยงกับ input file ที่ซ่อนอยู่ */}
              <label
                htmlFor="fileInput"
                className="inline-block bg-blue-500 text-white px-4 py-2
                          rounded cursor-pointer hover:bg-blue-600"
              >
                เลือกรูป
              </label>

              {/* 7.7. ส่วนแสดงตัวอย่างรูปภาพ */}
              {/* จะแสดงผลก็ต่อเมื่อ 'imagePreview' มีค่า (ไม่เป็น string ว่าง) */}
              {imagePreview && (
                <Image
                  src={imagePreview} // ใช้ URL ชั่วคราว (local) จาก state 'imagePreview'
                  alt="preview"
                  width={150}
                  height={150}
                  className="mt-2"
                />
              )}
            </div>

            {/* 7.8. Input: สถานะ (Select/Dropdown) */}
            <div>
              <label>สถานะ</label>
              <select
                // ถ้า isCompleted เป็น true ให้ value="1", ถ้า false ให้ value="0"
                value={isCompleted ? "1" : "0"}
                // เมื่อเปลี่ยนค่า: ถ้าค่าที่เลือกคือ "1" ให้ setIsCompleted(true)
                // ถ้าไม่ใช่ (คือ "0") ให้ setIsCompleted(false)
                onChange={(e) => setIsCompleted(e.target.value === "1")}
                className="w-full border rounded-lg p-2"
              >
                <option value="0">❌ยังไม่เสร็จ</option>
                <option value="1">✅เสร็จแล้ว</option>
              </select>
            </div>

            {/* 7.9. ปุ่ม Submit ของฟอร์ม */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2
                                    rounded hover:bg-blue-600"
              >
                บันทึกงานใหม่
              </button>
            </div>
          </form>

          {/* 7.10. ลิงก์สำหรับกลับหน้าหลัก */}
          <Link
            href="/alltask"
            className="text-blue-500 w-full text-center mt-5 block hover:text-blue-600"
          >
            กลับไปหน้าแสดงงานทั้งหมด
          </Link>
        </div>

        {/* 7.11. ส่วน Footer */}
        <Footer />
      </div>
    </>
  );
}
