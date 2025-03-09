
import { useState } from "react";
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

interface TicketFormProps {
  onSave?: () => void;
}

export default function TicketForm({ onSave }: TicketFormProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [requestType, setRequestType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [departmentCollaboration, setDepartmentCollaboration] = useState("");
  const [ticketDetail, setTicketDetail] = useState("");

  // Mock data for dropdowns
  const requestTypes = [
    { id: "1", label: "Hỗ trợ hợp đồng cho KH doanh nghiệp" },
    { id: "2", label: "Khiếu nại dịch vụ" },
    { id: "3", label: "Hỗ trợ kỹ thuật" },
    { id: "4", label: "Thanh toán" },
    { id: "5", label: "Khác" },
  ];

  const serviceTypes = [
    { id: "1", label: "Tra cứu/Hỗ trợ thông tin" },
    { id: "2", label: "Dịch vụ CNTT" },
    { id: "3", label: "Dịch vụ viễn thông" },
    { id: "4", label: "Khác" },
  ];

  const statusOptions = [
    { id: "1", label: "Đã Xử Lý" },
    { id: "2", label: "Đang xử lý" },
    { id: "3", label: "Mới" },
    { id: "4", label: "Hủy" },
  ];

  const channelOptions = [
    { id: "1", label: "Inbound" },
    { id: "2", label: "Outbound" },
    { id: "3", label: "Email" },
    { id: "4", label: "Chat" },
  ];

  const departmentOptions = [
    { id: "1", label: "Không" },
    { id: "2", label: "Phòng CSKH" },
    { id: "3", label: "Phòng Kỹ Thuật" },
    { id: "4", label: "Phòng Kinh Doanh" },
  ];

  const detailOptions = [
    { id: "1", label: "Chi tiết 1" },
    { id: "2", label: "Chi tiết 2" },
    { id: "3", label: "Chi tiết 3" },
  ];

  const handleSave = () => {
    if (!notes || !requestType || !status || !channel) {
      toast({
        variant: "destructive",
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin trước khi lưu",
      });
      return;
    }

    toast({
      title: "Đã lưu thành công",
      description: "Thông tin tương tác đã được ghi nhận",
    });

    // Reset form after saving
    setNotes("");
    setRequestType("");
    setServiceType("");
    setStatus("");
    setChannel("");
    setDepartmentCollaboration("");
    setTicketDetail("");

    // Call parent onSave if provided
    if (onSave) onSave();
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
          <Select value={requestType} onValueChange={setRequestType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn nhu cầu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {requestTypes.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
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
                {serviceTypes.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
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
                  <SelectItem key={option.id} value={option.id}>
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
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
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
                {departmentOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
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
                {channelOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button className="bg-blue-800 hover:bg-blue-900" onClick={handleSave}>
          Lưu Lại
        </Button>
      </div>
    </div>
  );
}
