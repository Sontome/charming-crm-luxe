
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generateTicketSerial } from "@/utils/formatters";
import { ConfigData } from "@/pages/Index";
import { Loader2 } from "lucide-react";
import { PendingTicket } from "@/components/TicketHistory";

interface TicketFormProps {
  customerCode: number;
  configData: ConfigData;
  onSave?: () => void;
  onClear?: () => void;
  pendingTickets?: PendingTicket[];
}

export default function TicketForm({ 
  customerCode, 
  configData, 
  onSave, 
  onClear,
  pendingTickets = []
}: TicketFormProps) {
  const { toast } = useToast();
  const { agent } = useAuth();
  const [notes, setNotes] = useState("");
  const [requestType, setRequestType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [detailOptions, setDetailOptions] = useState<{id: string, label: string}[]>([]);
  const [ticketDetail, setTicketDetail] = useState("");
  const [status, setStatus] = useState("DONE");
  const [channel, setChannel] = useState("Inbound");
  const [departmentCollaboration, setDepartmentCollaboration] = useState("Không");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPendingTicket, setSelectedPendingTicket] = useState("");

  // Update detail options when request type changes
  useEffect(() => {
    if (requestType && configData.detailOptionsMap[requestType]) {
      setDetailOptions(configData.detailOptionsMap[requestType]);
      setTicketDetail("");
    } else {
      setDetailOptions([]);
      setTicketDetail("");
    }
  }, [requestType, configData.detailOptionsMap]);

  // Set default values when config data loads
  useEffect(() => {
    if (configData.statusOptions.length > 0) {
      const doneOption = configData.statusOptions.find(option => option.label === "DONE");
      if (doneOption) {
        setStatus(doneOption.label);
      }
    }
    
    if (configData.channelOptions.length > 0) {
      const inboundOption = configData.channelOptions.find(option => option.label === "Inbound");
      if (inboundOption) {
        setChannel(inboundOption.label);
      }
    }
    
    if (configData.departmentOptions.length > 0) {
      const noOption = configData.departmentOptions.find(option => option.label === "Không");
      if (noOption) {
        setDepartmentCollaboration(noOption.label);
      }
    }
  }, [configData]);

  // Automatically select the first pending ticket when available
  useEffect(() => {
    if (pendingTickets && pendingTickets.length > 0 && !selectedPendingTicket) {
      setSelectedPendingTicket(pendingTickets[0].ticketSerial);
      
      // Also set the request type and ticket detail based on the selected ticket
      const selectedTicket = pendingTickets[0];
      if (selectedTicket.nhuCauKH) {
        setRequestType(selectedTicket.nhuCauKH);
      }
      if (selectedTicket.chiTietNhuCau) {
        setTicketDetail(selectedTicket.chiTietNhuCau);
      }
    }
  }, [pendingTickets, selectedPendingTicket]);

  const handlePendingTicketChange = (ticketSerial: string) => {
    setSelectedPendingTicket(ticketSerial);
    
    // Update form values based on the selected ticket
    const selectedTicket = pendingTickets?.find(ticket => ticket.ticketSerial === ticketSerial);
    if (selectedTicket) {
      if (selectedTicket.nhuCauKH) {
        setRequestType(selectedTicket.nhuCauKH);
      }
      if (selectedTicket.chiTietNhuCau) {
        setTicketDetail(selectedTicket.chiTietNhuCau);
      }
    }
  };

  const handleSave = async () => {
    if (!agent) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Bạn chưa đăng nhập",
      });
      return;
    }

    if (!notes || !requestType || !serviceType || !ticketDetail || !status || !channel) {
      toast({
        variant: "destructive",
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin trước khi lưu",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      
      // Get customer's lastActivity for timeStart
      const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .select("lastActivity")
        .eq("customerCode", customerCode)
        .single();
      
      if (customerError) throw customerError;
      
      const timeStart = customerData.lastActivity;
      
      // Check if we're updating an existing ticket or creating a new one
      if (selectedPendingTicket) {
        // We're updating an existing ticket
        
        // Insert new interaction with the existing ticket serial
        const { data: interactionData, error: interactionError } = await supabase
          .from("Interaction")
          .insert({
            customerCode: customerCode,
            timeStart: timeStart,
            nhuCauKH: requestType,
            chiTietNhuCau: ticketDetail,
            noteInput: notes,
            agentID: agent.id,
            status: status,
            ticketSerial: selectedPendingTicket
          })
          .select()
          .single();
        
        if (interactionError) throw interactionError;
        
        // Update the ticket timeEnd to now
        const { error: ticketUpdateError } = await supabase
          .from("Ticket")
          .update({
            timeEnd: now,
            status: status,
            interactionCodeEnd: interactionData.interactionCode
          })
          .eq("ticketSerial", selectedPendingTicket);
        
        if (ticketUpdateError) throw ticketUpdateError;
        
        // If status is DONE, update all interactions with this ticket serial to DONE
        if (status === "DONE") {
          // Update all interactions with this ticket serial
          const { error: interactionUpdateError } = await supabase
            .from("Interaction")
            .update({
              status: "DONE",
              nhuCauKH: requestType,
              chiTietNhuCau: ticketDetail
            })
            .eq("ticketSerial", selectedPendingTicket);
          
          if (interactionUpdateError) throw interactionUpdateError;
        }
      } else {
        // We're creating a new ticket
        
        // Get next ticket code
        const { data: maxTicketData } = await supabase
          .from("Ticket")
          .select("ticketCode")
          .order("ticketCode", { ascending: false })
          .limit(1)
          .single();
        
        const nextTicketCode = maxTicketData ? maxTicketData.ticketCode + 1 : 1;
        
        // Generate ticket serial with the updated format
        const ticketSerial = generateTicketSerial(
          serviceType, 
          agent.id, 
          timeStart, 
          nextTicketCode
        );

        // Insert new interaction first
        const { data: interactionData, error: interactionError } = await supabase
          .from("Interaction")
          .insert({
            customerCode: customerCode,
            timeStart: timeStart,
            nhuCauKH: requestType,
            chiTietNhuCau: ticketDetail,
            noteInput: notes,
            agentID: agent.id,
            status: status,
            ticketSerial: ticketSerial
          })
          .select()
          .single();
        
        if (interactionError) throw interactionError;
        
        // Insert new ticket with timeStart from lastActivity and timeEnd as now
        const { error: ticketError } = await supabase
          .from("Ticket")
          .insert({
            ticketSerial: ticketSerial,
            agent: agent.id,
            kenhTiepNhan: channel,
            interactionCodeStart: interactionData.interactionCode,
            timeStart: timeStart,
            customerCode: customerCode,
            phoiHop: departmentCollaboration,
            status: status,
            interactionCodeEnd: interactionData.interactionCode,
            ticketCode: nextTicketCode,
            timeEnd: now
          });
        
        if (ticketError) throw ticketError;
      }
      
      toast({
        title: "Đã lưu thành công",
        description: "Thông tin tương tác đã được ghi nhận",
      });

      // Reset form after saving
      setNotes("");
      setRequestType("");
      setServiceType("");
      setTicketDetail("");
      setStatus("DONE");
      setChannel("Inbound");
      setDepartmentCollaboration("Không");
      setSelectedPendingTicket("");

      // Call parent onSave if provided
      if (onSave) onSave();
      
      // Call onClear to reset search and ticket history
      if (onClear) onClear();
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu thông tin, vui lòng thử lại sau",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in shadow-md p-6 rounded-lg bg-card">
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea 
          placeholder="Nhập ghi chú tại đây..." 
          className="min-h-[120px] w-full border transition-shadow focus:shadow-md" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {pendingTickets && pendingTickets.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Ticket trùng</label>
          <Select value={selectedPendingTicket} onValueChange={handlePendingTicketChange}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn Ticket trùng" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Tạo Ticket mới</SelectItem>
                {pendingTickets.map((ticket) => (
                  <SelectItem key={ticket.ticketSerial} value={ticket.ticketSerial}>
                    {ticket.ticketSerial} - {ticket.nhuCauKH}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nhu Cầu Khách Hàng</label>
          <Select value={requestType} onValueChange={(value) => setRequestType(value)}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn nhu cầu" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.requestTypes.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Loại DV</label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn loại dịch vụ" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.serviceTypes.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Chi Tiết Nhu Cầu</label>
          <Select value={ticketDetail} onValueChange={setTicketDetail}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn chi tiết" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {detailOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trạng thái Xử Lý</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="DONE" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phối Hợp Liên Phòng Ban</label>
          <Select value={departmentCollaboration} onValueChange={setDepartmentCollaboration}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Không" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.departmentOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kênh Tiếp Nhận</label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Inbound" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.channelOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          className="bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all" 
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : "Lưu Lại"}
        </Button>
      </div>
    </div>
  );
}
