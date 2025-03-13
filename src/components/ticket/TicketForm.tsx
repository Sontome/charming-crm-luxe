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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TicketFormProps {
  customerCode: number;
  configData: ConfigData;
  onSave?: () => void;
  onClear?: () => void;
}

interface PendingTicket {
  ticketSerial: string;
  timeStart: string;
  nhuCauKH: string;
  chiTietNhuCau: string;
}

export default function TicketForm({ customerCode, configData, onSave, onClear }: TicketFormProps) {
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
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [pendingTickets, setPendingTickets] = useState<PendingTicket[]>([]);
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

  // Fetch pending tickets for this customer
  const fetchPendingTickets = async () => {
    try {
      // Only get PENDING tickets for this specific customer
      const { data: ticketData, error: ticketError } = await supabase
        .from("Ticket")
        .select("ticketSerial, timeStart")
        .eq("customerCode", customerCode)
        .eq("status", "PENDING");
      
      if (ticketError) throw ticketError;
      
      if (ticketData && ticketData.length > 0) {
        // For each ticket, get the interaction details
        const pendingTicketsWithDetails = await Promise.all(
          ticketData.map(async (ticket) => {
            const { data: interactionData, error: interactionError } = await supabase
              .from("Interaction")
              .select("nhuCauKH, chiTietNhuCau")
              .eq("ticketSerial", ticket.ticketSerial)
              .order("interactionCode", { ascending: false })
              .limit(1)
              .single();
            
            if (interactionError) {
              console.error("Error fetching interaction:", interactionError);
              return {
                ...ticket,
                nhuCauKH: "Không xác định",
                chiTietNhuCau: "Không xác định"
              };
            }
            
            return {
              ...ticket,
              nhuCauKH: interactionData.nhuCauKH,
              chiTietNhuCau: interactionData.chiTietNhuCau
            };
          })
        );
        
        setPendingTickets(pendingTicketsWithDetails);
        return pendingTicketsWithDetails.length > 0;
      } else {
        setPendingTickets([]);
        return false;
      }
    } catch (error) {
      console.error("Error fetching pending tickets:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách ticket đang chờ xử lý"
      });
      return false;
    }
  };

  const handleSaveExisting = async () => {
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
      
      // Update the existing ticket's timeEnd and status
      const { error: updateTicketError } = await supabase
        .from("Ticket")
        .update({ 
          timeEnd: now,
          status: status // Use the current status from the dropdown
        })
        .eq("ticketSerial", selectedPendingTicket);
      
      if (updateTicketError) {
        console.error("Error updating ticket:", updateTicketError);
        throw updateTicketError;
      }
      
      console.log("Successfully updated ticket with serial:", selectedPendingTicket, "New status:", status);
      
      // Create new interaction record with the existing ticket serial using the selected status
      const { data: interactionData, error: interactionError } = await supabase
        .from("Interaction")
        .insert({
          customerCode: customerCode,
          timeStart: timeStart,
          nhuCauKH: requestType,
          chiTietNhuCau: ticketDetail,
          noteInput: notes,
          agentID: agent.id,
          status: status, // Changed from "Trùng" to use the selected status
          ticketSerial: selectedPendingTicket
        })
        .select()
        .single();
      
      if (interactionError) throw interactionError;
      
      // Update all interactions with this ticket serial to have the same status
      const { error: updateInteractionsError } = await supabase
        .from("Interaction")
        .update({ status: status })
        .eq("ticketSerial", selectedPendingTicket);
      
      if (updateInteractionsError) {
        console.error("Error updating interactions:", updateInteractionsError);
      }
      
      toast({
        title: "Đã cập nhật thành công",
        description: "Thông tin tương tác đã được cập nhật vào ticket hiện có",
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
      setShowPendingDialog(false);

      // Call parent onSave if provided
      if (onSave) onSave();
      
      // Call onClear to reset search and ticket history
      if (onClear) onClear();
    } catch (error) {
      console.error("Error updating existing ticket:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật thông tin, vui lòng thử lại sau",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNew = async () => {
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

  const handleSave = async () => {
    // Before saving, check if there are any pending tickets
    const hasPendingTickets = await fetchPendingTickets();
    
    if (hasPendingTickets) {
      // Show the dialog to choose between existing or new ticket
      setShowPendingDialog(true);
    } else {
      // No pending tickets, proceed with creating a new ticket
      handleSaveNew();
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

      {/* Dialog for pending tickets */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lựa chọn Ticket</DialogTitle>
            <DialogDescription>
              Đã có các ticket đang xử lý (PENDING) cho khách hàng này. Bạn có thể chọn cập nhật một ticket hiện có hoặc tạo ticket mới.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Chọn Ticket đang xử lý</label>
              <Select value={selectedPendingTicket} onValueChange={setSelectedPendingTicket}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn Mã Ticket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {pendingTickets.map((ticket) => (
                      <SelectItem key={ticket.ticketSerial} value={ticket.ticketSerial}>
                        {ticket.ticketSerial} - {ticket.nhuCauKH} - {ticket.chiTietNhuCau}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPendingDialog(false);
                handleSaveNew();
              }}
            >
              Tạo Ticket mới
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (selectedPendingTicket) {
                  handleSaveExisting();
                } else {
                  toast({
                    title: "Chưa chọn Ticket",
                    description: "Vui lòng chọn một Ticket để cập nhật hoặc tạo Ticket mới.",
                    variant: "destructive"
                  });
                }
              }}
              disabled={!selectedPendingTicket}
            >
              Cập nhật Ticket đã chọn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
