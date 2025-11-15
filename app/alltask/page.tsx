// 1. กำหนดให้ไฟล์นี้เป็น Client Component
// จำเป็นต้องใช้ เพราะเรามีการใช้ React Hooks (useState, useEffect) และ event handlers (onClick)
"use client";

// 2. Import เครื่องมือที่จำเป็น
import Footer from "@/components/footer"; // Import คอมโพเนนต์ Footer
import Image from "next/image"; // Import คอมโพเนนต์ Image ของ Next.js
import task from "../../assets/images/task.png"; // Import รูปภาพ logo
import Link from "next/link"; // Import คอมโพเนนต์ Link สำหรับการนำทาง (navigation)
import { useEffect, useState } from "react"; // Import React Hooks
import { supabase } from "../../lib/supabaseClient"; // Import Supabase client

// 3. กำหนด Type (ชนิดข้อมูล) ของ Task
//    นี่คือการใช้ TypeScript เพื่อกำหนดว่า object 'Task' ต้องมีหน้าตา (structure) แบบไหน
type Task = {
  id: string; // ไอดี
  created_at: string; // วันที่สร้าง (มาเป็น string)
  title: string; // ชื่องาน
  detail: string; // รายละเอียด
  image_url: string | null; // URL รูปภาพ (อาจจะเป็น null ถ้าไม่มี)
  is_completed: boolean; // สถานะ (จริง/เท็จ)
  update_at: string | null; // วันที่แก้ไข (อาจจะเป็น null)
};

// 4. เริ่มต้นคอมโพเนนต์หลักของหน้า (Page Component)
export default function Page() {
  // 5. สร้าง State สำหรับเก็บรายการ Task ทั้งหมด
  //    เริ่มต้นเป็น array ว่าง `[]` และกำหนดว่าต้องเป็น array ของ Task (Task[])
  const [tasks, setTasks] = useState<Task[]>([]);

  // 6. ใช้ useEffect เพื่อดึงข้อมูล Task เมื่อคอมโพเนนต์เริ่มทำงาน
  //    (จะทำงานแค่ครั้งเดียวตอนโหลดหน้านี้ เพราะ `[]` (dependency array) ว่างเปล่า)
  useEffect(() => {
    // 6.1. สร้าง async function ภายใน useEffect เพื่อดึงข้อมูล
    const fetchTasks = async () => {
      // 6.2. เรียก Supabase API เพื่อ 'select' ข้อมูลจากตาราง 'task_tb'
      const { data, error } = await supabase
        .from("task_tb")
        .select(
          "id, created_at, title, detail, image_url, is_completed, update_at" // เลือกคอลัมน์ที่ต้องการ
        )
        // 6.3. สั่งให้เรียงลำดับข้อมูล โดยเอา 'created_at' (วันที่สร้าง)
        //      มาเรียงแบบ 'descending' (ใหม่สุดอยู่บน)
        .order("created_at", { ascending: false });

      // 6.4. จัดการ Error (ถ้ามี)
      if (error) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่");
        console.error(error);
        return; // หยุดทำงานถ้าเกิด error
      }

      // 6.5. ถ้าดึงข้อมูลสำเร็จ (data) ให้นำข้อมูลไปอัปเดต state 'tasks'
      //      (เราบอก TypeScript ว่า data ที่ได้มาคือ Task[] แน่นอน)
      if (data) setTasks(data as Task[]);
    };

    // 6.6. เรียกใช้ฟังก์ชัน fetchTasks() ที่เราเพิ่งสร้าง
    fetchTasks();
  }, []); // `[]` ที่ว่างเปล่า หมายความว่า effect นี้จะทำงานแค่ครั้งเดียวตอนโหลดหน้า

  // 7. สร้างฟังก์ชันสำหรับลบ Task (เมื่อผู้ใช้กดปุ่ม "ลบ")
  //    ฟังก์ชันนี้จะรับ 'id' ของ task ที่ต้องการลบเข้ามา
  const handleDeleteClick = async (id: string) => {
    // 7.1. แสดงหน้าต่าง 'confirm' เพื่อยืนยันการลบ
    //      (หมายเหตุ: `confirm()` อาจไม่ทำงานในบางสภาพแวดล้อม iframe
    //      ในโปรเจกต์จริง ควรเปลี่ยนเป็น Modal UI ที่สร้างเอง)
    if (confirm("คุณแน่ใจหรือว่าต้องการลบงานนี้?")) {
      // 7.2. (ถ้าผู้ใช้กดยืนยัน) เรียก Supabase API เพื่อ 'delete'
      const { error } = await supabase.from("task_tb").delete().eq("id", id); // ลบแถวที่ 'id' ตรงกัน

      // 7.3. จัดการ Error (ถ้ามี)
      if (error) {
        alert("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่");
        console.log(error.message);
        return;
      }

      // 7.4. ถ้าลบสำเร็จ, แสดง alert
      alert("ลบงานเรียบร้อย");

      // 7.5. อัปเดต State 'tasks' ในหน้าเว็บทันที (เพื่อให้ UI อัปเดต)
      //      โดยการกรอง (filter) เอา task ที่มี 'id' ตรงกับที่เพิ่งลบออกไป
      // 7.6. `setTasks((prev) => ...)`: นี่คือวิธีอัปเดต state ที่ปลอดภัย
      //      โดยอิงจากค่า state ก่อนหน้า (prev)
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // 8. ส่วนของ JSX (HTML) ที่จะแสดงผลบนหน้าจอ
  return (
    <>
      <div className="flex flex-col items-center">
        {/* 8.1. ส่วนหัว (Logo และ Title) */}
        <Image className="mt-20" src={task} alt="task" width={150} />
        <h1 className="mt-5 text-2xl font-bold text-blue-600">
          Manage Task App
        </h1>
        <h1 className="mt-2 text-lg text-blue-500">บริการจัดการงานที่ทำ</h1>

        {/* 8.2. ปุ่มสำหรับลิงก์ไปหน้า "เพิ่มงาน" (/addtask) */}
        <div className="flex justify-end w-10/12">
          <Link
            href="/addtask"
            className="mt-5 text-white bg-blue-500 px-8 py-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            เพิ่มงาน
          </Link>
        </div>

        {/* 8.3. ส่วนตารางที่ใช้แสดงรายการ Task ทั้งหมด */}
        <div className="w-10/12 flex mt-5">
          <table className="w-full border font-bold">
            {/* 8.4. ส่วนหัวตาราง (Table Head) */}
            <thead className="bg-blue-100">
              <tr className="text-center border">
                <td className="border p-2">รูป</td>
                <td className="border p-2">งานที่ต้องทำ</td>
                <td className="border p-2">รายละเอียดงาน</td>
                <td className="border p-2">สถานะ</td>
                <td className="border p-2">วันที่เพิ่ม</td>
                <td className="border p-2">วันที่แก้ไข</td>
                <td className="border p-2">ACTION</td>
              </tr>
            </thead>

            {/* 8.5. ส่วนเนื้อหาตาราง (Table Body) */}
            <tbody>
              {/* 8.6. ใช้ .map() เพื่อ "วนลูป" ข้อมูลใน state 'tasks'
                     เพื่อนำแต่ละ 'task' (object) มาสร้างแถว (<tr>) ทีละแถว */}
              {tasks.map((task) => (
                // 8.7. `key={task.id}`: สำคัญมากสำหรับ React
                //      เพื่อให้รู้ว่าแถวไหนเป็นแถวไหน เวลาข้อมูลเปลี่ยน
                <tr key={task.id} className="text-center border">
                  {/* 8.8. แสดงรูป: เช็คว่า `task.image_url` มีค่าหรือไม่ */}
                  <td className="border p-2 flex justify-center items-center">
                    {task.image_url ? (
                      // ถ้ามี URL ให้แสดงรูป
                      <Image
                        src={task.image_url}
                        alt={task.title || "task"}
                        width={50}
                        height={50}
                        className="object-cover rounded" // object-cover ช่วยให้รูปไม่บิดเบี้ยว
                      />
                    ) : (
                      // ถ้าไม่มี (เป็น null) ให้แสดงขีด "-"
                      <span>-</span>
                    )}
                  </td>
                  {/* 8.9. แสดง Title และ Detail */}
                  <td className="border p-2">{task.title}</td>
                  <td className="border p-2">{task.detail}</td>
                  {/* 8.10. แสดงสถานะ: ใช้ Ternary Operator
                         ถ้า task.is_completed เป็น true, แสดง "✅สำเร็จ"
                         ถ้าไม่, แสดง "❌ไม่สำเร็จ" */}
                  <td className="border p-2">
                    {task.is_completed ? "✅สำเร็จ" : "❌ไม่สำเร็จ"}
                  </td>
                  {/* 8.11. แสดงวันที่สร้าง (จัดรูปแบบให้อ่านง่ายขึ้น) */}
                  <td className="border p-2">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  {/* 8.12. แสดงวันที่แก้ไข (เช็คก่อนว่า `update_at` ไม่ใช่ null) */}
                  <td className="border p-2">
                    {task.update_at
                      ? new Date(task.update_at).toLocaleString()
                      : "-"}
                  </td>
                  {/* 8.13. ส่วน Action (ปุ่มแก้ไขและลบ) */}
                  <td className="border p-2">
                    {/* 8.14. ลิงก์ "แก้ไข" ที่ส่ง `task.id` ไปกับ URL
                           เช่น /updatetask/12345 */}
                    <Link
                      className="text-green-500 mr-5 hover:text-green-700"
                      href={`/updatetask/${task.id}`}
                    >
                      แก้ไข
                    </Link>
                    {/* 8.15. ปุ่ม "ลบ" ที่เมื่อคลิก (onClick)
                           จะเรียก `handleDeleteClick` พร้อมส่ง `task.id` ของแถวนี้ไป */}
                    <button
                      onClick={() => handleDeleteClick(task.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 8.16. แสดงคอมโพเนนต์ Footer */}
        <Footer />
      </div>
    </>
  );
}
