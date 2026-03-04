import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function Layout({ children }: { children: ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
              <h2 className="font-display font-semibold text-sm text-muted-foreground hidden sm:block">
                Secure Customs Portal
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Online
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-mesh-pattern">
            <div className="max-w-5xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
