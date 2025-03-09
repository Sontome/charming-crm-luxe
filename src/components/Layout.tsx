
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/hooks/useTheme";

export default function Layout() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
