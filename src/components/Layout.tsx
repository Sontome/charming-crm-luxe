
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/hooks/useTheme";
import { User } from "lucide-react";

export default function Layout() {
  // Mock data for the logged-in employee
  const loggedInEmployee = {
    name: "Nguyễn Văn Chuyên",
    position: "Nhân viên CSKH",
    id: "NV001"
  };

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
              <div className="text-sm">
                <div className="font-medium">{loggedInEmployee.name}</div>
                <div className="text-muted-foreground text-xs">{loggedInEmployee.position} | ID: {loggedInEmployee.id}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('vi-VN')} | {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
        <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
