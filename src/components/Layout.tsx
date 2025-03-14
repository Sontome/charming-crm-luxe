
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/hooks/useTheme";
import { LogOut, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import AgentChat from "./AgentChat";

export default function Layout() {
  const { agent, logout } = useAuth();

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-muted/30 py-2 px-4 border-b">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="text-sm hover:bg-muted/50 rounded-md py-1 px-2 transition-colors">
                    <div className="font-medium">{agent?.name}</div>
                    <div className="text-muted-foreground text-xs text-left">
                      ID: {agent?.id} | {agent?.user_role === 'admin' ? 'Admin' : 'Nhân viên'}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('vi-VN')} | {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
        <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <AgentChat />
      </div>
    </ThemeProvider>
  );
}
