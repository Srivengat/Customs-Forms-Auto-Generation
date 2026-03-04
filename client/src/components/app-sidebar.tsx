import { 
  FileText, 
  ShieldCheck, 
  History, 
  LayoutDashboard,
  Box
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Generate Bill", url: "/", icon: FileText },
  { title: "Verify Document", url: "/verify", icon: ShieldCheck },
  { title: "History Logs", url: "/history", icon: History },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-border shadow-sm">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Box className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base leading-tight">CustomsFlow</span>
            <span className="text-xs text-muted-foreground font-medium">Extraction System</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        transition-all duration-200 py-5 px-4 rounded-xl mb-1
                        ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-foreground hover:bg-secondary/50'}
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="bg-secondary/50 p-4 rounded-xl flex items-center gap-3 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            CO
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Officer Active</span>
            <span className="text-xs text-muted-foreground">Secure Session</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
