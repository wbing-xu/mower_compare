"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/companies", label: "公司" },
  { href: "/products", label: "产品" },
  { href: "/compare", label: "对比" },
  { href: "/cms", label: "数据管理" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-10 w-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-semibold">M</span>
          <div className="text-left">
            <p className="text-lg font-semibold">Mower Intelligence</p>
            <p className="text-xs text-slate-500">割草机行业洞察平台</p>
          </div>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 transition",
                pathname === item.href
                  ? "bg-brand-600 text-white shadow-card"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
