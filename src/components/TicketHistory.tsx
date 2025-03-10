
import { useState, useEffect } from "react";
import TicketTable from "./ticket/TicketTable";
import TicketForm from "./ticket/TicketForm";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";
import { ConfigData } from "@/pages/Index";
import { useToast } from "@/components/ui/use-toast";

interface Interaction {
  interactionCode: number;
  customerCode: number;
  timeStart: string;
  nhuCauKH: string;
  chiTietNhuCau: string;
  noteInput: string;
  agentID: string;
  ticketSerial: string;
  status: string;
}

interface TicketHistoryProps {
  customerCode: number;
  configData: ConfigData;
}

export default function TicketHistory({ customerCode, configData }: TicketHistoryProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [groupedInteractions, setGroupedInteractions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInteractions = async () => {
      if (!customerCode) return;

      try {
        // Fetch all interactions for this customer
        const { data, error } = await supabase
          .from("Interaction")
          .select(`
            interactionCode,
            customerCode,
            timeStart,
            nhuCauKH,
            chiTietNhuCau,
            noteInput,
            agentID,
            ticketSerial,
            status
          `)
          .eq("customerCode", customerCode)
          .order("timeStart", { ascending: false });

        if (error) throw error;
        
        if (data) {
          setInteractions(data);
          
          // Group interactions by ticketSerial
          const groupedByTicket: Record<string, Interaction[]> = {};
          
          data.forEach(interaction => {
            if (!groupedByTicket[interaction.ticketSerial]) {
              groupedByTicket[interaction.ticketSerial] = [];
            }
            groupedByTicket[interaction.ticketSerial].push(interaction);
          });
          
          // Transform grouped data for the table
          const tableData = Object.entries(groupedByTicket).map(([ticketSerial, tickets]) => {
            // Sort by timeStart descending to get the latest first
            tickets.sort((a, b) => 
              new Date(b.timeStart).getTime() - new Date(a.timeStart).getTime()
            );
            
            const latestTicket = tickets[0];
            
            // Combine notes from all interactions in this ticket
            const combinedNotes = tickets.map(t => 
              `${t.agentID}: ${t.noteInput}`
            ).join("\n");
            
            return {
              id: ticketSerial,
              date: formatDate(latestTicket.timeStart).split(' ')[0],
              time: formatDate(latestTicket.timeStart).split(' ')[1],
              requestType: latestTicket.nhuCauKH,
              content: latestTicket.chiTietNhuCau,
              notes: combinedNotes,
              agent: latestTicket.agentID,
              status: latestTicket.status
            };
          });
          
          setGroupedInteractions(tableData);
        }
      } catch (error) {
        console.error("Error fetching interactions:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải lịch sử tương tác"
        });
      }
    };

    fetchInteractions();
  }, [customerCode, toast]);

  const handleSaveSuccess = () => {
    // Refresh the interactions list
    if (customerCode) {
      const fetchInteractions = async () => {
        const { data, error } = await supabase
          .from("Interaction")
          .select("*")
          .eq("customerCode", customerCode)
          .order("timeStart", { ascending: false });

        if (error) {
          console.error("Error refreshing interactions:", error);
          return;
        }
        
        if (data) {
          setInteractions(data);
          
          // Update grouped interactions
          const groupedByTicket: Record<string, Interaction[]> = {};
          
          data.forEach(interaction => {
            if (!groupedByTicket[interaction.ticketSerial]) {
              groupedByTicket[interaction.ticketSerial] = [];
            }
            groupedByTicket[interaction.ticketSerial].push(interaction);
          });
          
          const tableData = Object.entries(groupedByTicket).map(([ticketSerial, tickets]) => {
            tickets.sort((a, b) => 
              new Date(b.timeStart).getTime() - new Date(a.timeStart).getTime()
            );
            
            const latestTicket = tickets[0];
            const combinedNotes = tickets.map(t => 
              `${t.agentID}: ${t.noteInput}`
            ).join("\n");
            
            return {
              id: ticketSerial,
              date: formatDate(latestTicket.timeStart).split(' ')[0],
              time: formatDate(latestTicket.timeStart).split(' ')[1],
              requestType: latestTicket.nhuCauKH,
              content: latestTicket.chiTietNhuCau,
              notes: combinedNotes,
              agent: latestTicket.agentID,
              status: latestTicket.status
            };
          });
          
          setGroupedInteractions(tableData);
        }
      };

      fetchInteractions();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Ticket history table */}
      <TicketTable tickets={groupedInteractions} />
      
      {/* Notes and new interaction form */}
      <TicketForm 
        customerCode={customerCode}
        configData={configData} 
        onSave={handleSaveSuccess}
      />
    </div>
  );
}
