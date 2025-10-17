import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-slate-50 pb-16">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
