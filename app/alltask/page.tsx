"use client";

import Footer from "@/components/footer";
import Image from "next/image";
import task from "../../assets/images/task.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// สร้างประเภทข้อมูลแบบ Task
type Task = {
  id: string;
  created_at: string;
  title: string;
  detail: string;
  image_url: string | null;
  is_completed: boolean;
  update_at: string | null;
};

export default function Page() {
  // สร้างตัวแปรทั้งหมด
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("task_tb")
        .select(
          "id, created_at, title, detail, image_url, is_completed, update_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่");
        console.error(error);
        return;
      }
      if (data) setTasks(data as Task[]);
    };

    fetchTasks();
  }, []);

  // สร้าง function เพื่อลบงานตาม id
  const handleDeleteClick = async (id: string) => {
    if (confirm("คุณแน่ใจหรือว่าต้องการลบงานนี้?")) {
      const { error } = await supabase.from("task_tb").delete().eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่");
        console.log(error.message);
        return;
      }

      alert("ลบงานเรียบร้อย");
      // ใช้รูปแบบฟังก์ชัน ป้องกัน state ค้าง
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* ส่วนบน */}
        <Image className="mt-20" src={task} alt="task" width={150} />
        <h1 className="mt-5 text-2xl font-bold text-blue-600">
          Manage Task App
        </h1>
        <h1 className="mt-2 text-lg text-blue-500">บริการจัดการงานที่ทำ</h1>

        {/* ปุ่มเพิ่มงาน */}
        <div className="flex justify-end w-10/12">
          <Link
            href="/addtask"
            className="mt-5 text-white bg-blue-500 px-8 py-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            เพิ่มงาน
          </Link>
        </div>

        {/* ตารางรายการงาน */}
        <div className="w-10/12 flex mt-5">
          <table className="w-full border font-bold">
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

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="text-center border">
                  <td className="border p-2 flex justify-center items-center">
                    {task.image_url ? (
                      <Image
                        src={task.image_url}
                        alt={task.title || "task"}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                      />
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="border p-2">{task.title}</td>
                  <td className="border p-2">{task.detail}</td>
                  <td className="border p-2">
                    {task.is_completed ? "✅สำเร็จ" : "❌ไม่สำเร็จ"}
                  </td>
                  <td className="border p-2">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {task.update_at
                      ? new Date(task.update_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border p-2">
                    <Link
                      className="text-green-500 mr-5 hover:text-green-700"
                      href="#"
                    >
                      แก้ไข
                    </Link>
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

        <Footer />
      </div>
    </>
  );
}
