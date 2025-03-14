
import { Home, Search, FileText, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { agent } = useAuth();
  
  const menuItems = [
    {
      icon: Home,
      label: "Trang chủ",
      path: "/",
    },
    {
      icon: Search,
      label: "Khảo sát",
      path: "/search",
    },
    {
      icon: FileText,
      label: "Báo cáo",
      path: "/reports",
    },
  ];

  // Add the upload button for admin users
  if (agent?.user_role === 'admin') {
    menuItems.push({
      icon: Upload,
      label: "Upload Misscall",
      path: "/upload-misscall",
    });
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all animate-fade-in">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-2 font-bold text-primary">
          <img 
            src="https://sso.tima.vn/images/logo.png" 
            alt="Tima Logo" 
            className="h-8 w-auto object-contain animate-fade-in" 
          />
          <span className="hidden sm:inline-block pl-2 border-l">Contact Center</span>
        </div>

        <nav className="flex items-center space-x-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none hover:shadow-sm",
                  isActive
                    ? "text-primary font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
