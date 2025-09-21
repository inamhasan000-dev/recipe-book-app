'use client'
import AuthLayout from "@/components/AuthLayout";
import Layout from "@/components/Layout";
import MainApp from "@/components/MainApp";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div
        className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vh-60px)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        }}
      >
        {/* Faded overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Main content (above overlay) */}
        <main className="relative flex flex-col gap-[32px] row-start-2 items-center sm:items-start rounded-xl shadow-lg">
          <MainApp />
        </main>
      </div>
    </Layout>

  );
}
