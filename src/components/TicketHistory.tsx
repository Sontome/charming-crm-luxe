
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Save, Clock } from "lucide-react";

interface TicketOption {
  id: string;
  label: string;
}

export default function TicketHistory() {
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
  
  // Mock ticket history data for 0978264656
  const recentTickets = [
    {
      id: "Yêu Cầu",
      date: "04/08/2024",
      time: "09:59:13",
      requestType: "Hỗ trợ hợp đồng cho KH doanh nghiệp",
      content: "Tra cứu/Hỗ trợ thông tin",
      notes: "cúp ngang",
      agent: "SONTX",
      status: "Đã Xử Lý",
    },
    {
      id: "Yêu Cầu",
      date: "04/08/2024",
      time: "11:00:35",
      requestType: "Hỗ trợ hợp đồng cho KH doanh nghiệp",
      content: "Tra cứu/Hỗ trợ thông tin",
      notes: "tốt toàn",
      agent: "SONTX",
      status: "Đã Xử Lý",
    },
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Ticket history table */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
          <h3 className="font-semibold text-lg">Lịch Sử TICKET</h3>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-medium text-black">Thời Gian</TableHead>
                <TableHead className="font-medium text-black">Nhu Cầu KH</TableHead>
                <TableHead className="font-medium text-black">Nội Dung Trao Đổi</TableHead>
                <TableHead className="font-medium text-black">Note</TableHead>
                <TableHead className="font-medium text-black">Nhân Viên</TableHead>
                <TableHead className="font-medium text-black">Mã Ticket</TableHead>
                <TableHead className="font-medium text-black">Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTickets.map((ticket, index) => (
                <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                  <TableCell>{ticket.date} {ticket.time}</TableCell>
                  <TableCell>{ticket.requestType}</TableCell>
                  <TableCell>{ticket.content}</TableCell>
                  <TableCell>{ticket.notes}</TableCell>
                  <TableCell>{ticket.agent}</TableCell>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-sm text-white bg-blue-600">
                      {ticket.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Notes and new interaction form */}
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
    </div>
  );
}
