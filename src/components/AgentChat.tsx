
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ChevronUp, ChevronDown, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Agent {
  id: string;
  name: string;
  email: string;
  lasttimeactive: string;
}

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [message, setMessage] = useState("");
  const { agent } = useAuth();
  
  useEffect(() => {
    // Subscribe to realtime updates for Agent table
    const channel = supabase
      .channel('agent-presence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'Agent',
      }, () => {
        fetchAgents();
      })
      .subscribe();
      
    // Fetch initial list of agents
    fetchAgents();
    
    // Set up polling for agents (fallback)
    const interval = setInterval(fetchAgents, 30000);
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchAgents = async () => {
    try {
      // Get agents active in the last 5 minutes
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
      const { data, error } = await supabase
        .from('Agent')
        .select('id, name, email, lasttimeactive')
        .gt('lasttimeactive', fiveMinutesAgo.toISOString());
        
      if (error) throw error;
      
      setAgents(data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const handleSendMessage = () => {
    // Future implementation: Send message to other agents
    setMessage("");
  };
  
  return (
    <div className="fixed bottom-0 right-4 z-10">
      <div className="flex flex-col">
        <Button 
          onClick={toggleOpen} 
          variant="outline" 
          className="flex items-center gap-2 rounded-t-lg rounded-b-none border-b-0 shadow-sm bg-white"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Nhân viên trực tuyến ({agents.length})</span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
        
        {isOpen && (
          <Card className="w-80 animate-fade-in rounded-t-none shadow-lg border-t-0">
            <CardHeader className="p-3 border-b">
              <CardTitle className="text-sm">Nhân viên đang hoạt động</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              <div className="divide-y">
                {agents.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    Không có nhân viên đang hoạt động
                  </div>
                ) : (
                  agents.map((a) => (
                    <div key={a.id} className="p-3 flex items-center gap-3 hover:bg-muted/50">
                      <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                        <AvatarFallback>{getInitials(a.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {a.id}</div>
                      </div>
                      {a.id !== agent?.id && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t flex gap-2">
              <Textarea 
                placeholder="Nhập tin nhắn..." 
                className="min-h-8 text-sm resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
