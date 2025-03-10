
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  agent: Agent | null;
  loading: boolean;
  login: (id: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for agent in session storage on initial load
    const storedAgent = sessionStorage.getItem("agent");
    if (storedAgent) {
      setAgent(JSON.parse(storedAgent));
    }
    setLoading(false);
  }, []);

  const login = async (id: string, password: string) => {
    try {
      setLoading(true);
      
      console.log("Attempting login with:", id, password);
      
      // Fetch the agent with the provided ID and password
      const { data, error } = await supabase
        .from("Agent")
        .select("id, name, email")
        .eq("id", id)
        .eq("password", password)
        .maybeSingle();

      console.log("Login response:", data, error);

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không đúng"
        });
        return;
      }

      // Set the agent in state and session storage
      setAgent(data);
      sessionStorage.setItem("agent", JSON.stringify(data));
      
      // Update last active time
      await supabase
        .from("Agent")
        .update({ lasttimeactive: new Date().toISOString() })
        .eq("id", id);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${data.name}`
      });
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Clear agent from state and storage
    setAgent(null);
    sessionStorage.removeItem("agent");
    
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống"
    });
    
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ agent, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
