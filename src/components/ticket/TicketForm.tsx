
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

interface TicketFormProps {
  customerCode: number;
  configData: ConfigData;
  onSave?: () => void;
}

export default function TicketForm({ customerCode, configData, onSave }: TicketFormProps) {
  const { toast } = useToast();
  const { agent } = useAuth();
  const [notes, setNotes] = useState("");
  const [requestType, setRequestType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [detailOptions, setDetailOptions] = useState<{id: string, label: string}[]>([]);
  const [ticketDetail, setTicketDetail] = useState("");
  const [status, setStatus] = useState("DONE"); // Default to DONE
  const [channel, setChannel] = useState("Inbound"); // Default to Inbound
  const [departmentCollaboration, setDepartmentCollaboration] = useState("Không"); // Default to Không
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // Get customer's lastActivity
      const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .select("lastActivity")
        .eq("customerCode", customerCode)
        .single();
      
      if (customerError) throw customerError;
      
      const timeStart = customerData.lastActivity;
      
      // Insert new interaction
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
          // ticketSerial will be updated after ticket creation
          ticketSerial: "temp"
        })
        .select()
        .single();
      
      if (interactionError) throw interactionError;
      
      // Get next ticket code
      const { data: maxTicketData } = await supabase
        .from("Ticket")
        .select("ticketCode")
        .order("ticketCode", { ascending: false })
        .limit(1)
        .single();
      
      const nextTicketCode = maxTicketData ? maxTicketData.ticketCode + 1 : 1;
      
      // Generate ticket serial
      const ticketSerial = generateTicketSerial(
        serviceType, 
        agent.id, 
        timeStart, 
        nextTicketCode
      );
      
      // Insert new ticket
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
      
      // Update the interaction with the correct ticketSerial
      const { error: updateError } = await supabase
        .from("Interaction")
        .update({ ticketSerial: ticketSerial })
        .eq("interactionCode", interactionData.interactionCode);
      
      if (updateError) throw updateError;
      
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
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea 
          placeholder="Nhập ghi chú tại đây..." 
          className="min-h-[120px] w-full border" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nhu Cầu Khách Hàng</label>
          <Select value={requestType} onValueChange={(value) => setRequestType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn nhu cầu" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại dịch vụ" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn chi tiết" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="DONE" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Không" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Inbound" />
            </SelectTrigger>
            <SelectContent>
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
          className="bg-blue-800 hover:bg-blue-900" 
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu Lại"}
        </Button>
      </div>
    </div>
  );
}
