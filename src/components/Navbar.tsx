
import { Home, Search, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const menuItems = [
    {
      icon: Home,
      label: "Trang chủ",
      path: "/",
    },
    {
      icon: Search,
      label: "Tra cứu",
      path: "/search",
    },
    {
      icon: FileText,
      label: "Báo cáo",
      path: "/reports",
    },
  ];

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-2 font-bold text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="hidden sm:inline-block">Contact Center</span>
        </div>

        <nav className="flex items-center space-x-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none",
                  isActive
                    ? "text-primary font-medium"
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
