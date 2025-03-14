
import { Home, Search, FileText, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  userRole?: string;
}

export function NavItems({ userRole }: NavItemsProps) {
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
  if (userRole === 'admin') {
    menuItems.push({
      icon: Upload,
      label: "Upload Misscall",
      path: "/upload-misscall",
    });
  }

  return (
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
  );
}
