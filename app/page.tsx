import Footer from "@/components/footer";
import Image from "next/image";
import task from "../assets/images/task.png";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <Image className="mt-20" src={task} alt="task" width={200} />
        <h1 className="mt-10  text-4xl font-bold text-blue-600">
          Manage Task App
        </h1>

        <h1 className="mt-5  text-2xl  text-blue-500">บริการจัดการงานที่ทำ</h1>
        <Link
          href="/alltask"
          className="mt-10 text-white bg-blue-500 px-25  py-4 rounded hover:bg-blue-700 cursor-pointer"
        >
          เข้าใช้งานแอปพลิเคชั่น
        </Link>

        <Footer />
      </div>
    </>
  );
}
