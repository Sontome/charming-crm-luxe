
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Logo } from "./navigation/Logo";
import { NavItems } from "./navigation/NavItems";

export default function Navbar() {
  const { agent } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all animate-fade-in">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
        <Logo />
        <NavItems userRole={agent?.user_role} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
