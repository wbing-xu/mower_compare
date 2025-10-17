import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "割草机行业分析平台",
  description:
    "面向割草机与割草机器人行业的公司画像、产品矩阵与参数对比分析平台"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={cn("min-h-screen bg-slate-50 text-slate-900")}>{children}</body>
    </html>
  );
}
