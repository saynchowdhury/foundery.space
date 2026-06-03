import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";

interface SiteShellProps {
  children: React.ReactNode;
}

/** Shared chrome for directory and content pages (browse, guides, opportunities). */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-brand selection:text-black">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
