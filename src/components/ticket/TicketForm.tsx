
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ConfigData } from "@/pages/Index";
import { Loader2 } from "lucide-react";
import TicketFormFields from "./TicketFormFields";
import PendingTicketDialog from "./PendingTicketDialog";
import { 
  fetchPendingTickets, 
  updateExistingTicket, 
  createNewTicket,
  getCustomerLastActivity
} from "./ticketService";

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
  const [ticketDetail, setTicketDetail] = useState("");
  const [status, setStatus] = useState("DONE");
  const [channel, setChannel] = useState("Inbound");
  const [departmentCollaboration, setDepartmentCollaboration] = useState("Không");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [pendingTickets, setPendingTickets] = useState<PendingTicket[]>([]);

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

  const validateForm = () => {
    if (!agent) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Bạn chưa đăng nhập",
      });
      return false;
    }

    if (!notes || !requestType || !serviceType || !ticketDetail || !status || !channel) {
      toast({
        variant: "destructive",
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin trước khi lưu",
      });
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setNotes("");
    setRequestType("");
    setServiceType("");
    setTicketDetail("");
    setStatus("DONE");
    setChannel("Inbound");
    setDepartmentCollaboration("Không");
    setShowPendingDialog(false);

    // Call parent callbacks
    if (onSave) onSave();
    if (onClear) onClear();
  };

  const handleSaveExisting = async (selectedTicketSerial: string) => {
    if (!validateForm() || !agent) return;
    setIsSubmitting(true);

    try {
      // Get customer's lastActivity for timeStart
      const timeStart = await getCustomerLastActivity(customerCode);
      
      // Update the existing ticket
      await updateExistingTicket({
        selectedTicketSerial,
        customerCode,
        timeStart,
        requestType,
        ticketDetail,
        notes,
        agentId: agent.id,
        status
      });
      
      toast({
        title: "Đã cập nhật thành công",
        description: "Thông tin tương tác đã được cập nhật vào ticket hiện có",
      });

      resetForm();
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
    if (!validateForm() || !agent) return;
    setIsSubmitting(true);

    try {
      // Get customer's lastActivity for timeStart
      const timeStart = await getCustomerLastActivity(customerCode);
      
      // Create a new ticket
      await createNewTicket({
        customerCode,
        timeStart,
        requestType,
        ticketDetail,
        notes,
        agentId: agent.id,
        status,
        channel,
        departmentCollaboration
      });
      
      toast({
        title: "Đã lưu thành công",
        description: "Thông tin tương tác đã được ghi nhận",
      });

      resetForm();
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
    try {
      // Check if there are any pending tickets
      const pendingTicketsData = await fetchPendingTickets(customerCode);
      
      if (pendingTicketsData.length > 0) {
        // Store the pending tickets and show the dialog
        setPendingTickets(pendingTicketsData);
        setShowPendingDialog(true);
      } else {
        // No pending tickets, proceed with creating a new ticket
        handleSaveNew();
      }
    } catch (error) {
      console.error("Error checking for pending tickets:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách ticket đang chờ xử lý"
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in shadow-md p-6 rounded-lg bg-card">
      <TicketFormFields
        configData={configData}
        notes={notes}
        setNotes={setNotes}
        requestType={requestType}
        setRequestType={setRequestType}
        serviceType={serviceType}
        setServiceType={setServiceType}
        ticketDetail={ticketDetail}
        setTicketDetail={setTicketDetail}
        status={status}
        setStatus={setStatus}
        channel={channel}
        setChannel={setChannel}
        departmentCollaboration={departmentCollaboration}
        setDepartmentCollaboration={setDepartmentCollaboration}
      />

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

      <PendingTicketDialog
        open={showPendingDialog}
        onOpenChange={setShowPendingDialog}
        pendingTickets={pendingTickets}
        onSelectExisting={handleSaveExisting}
        onCreateNew={handleSaveNew}
      />
    </div>
  );
}
