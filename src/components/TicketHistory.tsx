
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Save, Plus, Clock } from "lucide-react";

interface TicketOption {
  id: string;
  label: string;
}

export default function TicketHistory() {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [requestType, setRequestType] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");

  const requestTypes: TicketOption[] = [
    { id: "1", label: "Thông tin sản phẩm" },
    { id: "2", label: "Khiếu nại dịch vụ" },
    { id: "3", label: "Hỗ trợ kỹ thuật" },
    { id: "4", label: "Thanh toán" },
    { id: "5", label: "Khác" },
  ];

  const statusOptions: TicketOption[] = [
    { id: "1", label: "Mới" },
    { id: "2", label: "Đang xử lý" },
    { id: "3", label: "Hoàn thành" },
    { id: "4", label: "Hủy" },
  ];

  const channelOptions: TicketOption[] = [
    { id: "1", label: "Inbound" },
    { id: "2", label: "Outbound" },
    { id: "3", label: "Email" },
    { id: "4", label: "Chat" },
  ];
  
  const recentTickets = [
    {
      id: "T-1001",
      date: "20/03/2024",
      time: "15:30",
      requestType: "Thông tin sản phẩm",
      notes: "Khách hàng có yêu cầu về thông tin sản phẩm mới",
      agent: "Nguyễn Văn Chuyên",
      status: "Hoàn thành",
      channel: "Inbound",
    },
    {
      id: "T-1002",
      date: "18/03/2024",
      time: "10:15",
      requestType: "Khiếu nại dịch vụ",
      notes: "Khách hàng phàn nàn về dịch vụ giao hàng chậm",
      agent: "Trần Thị B",
      status: "Đang xử lý",
      channel: "Email",
    },
    {
      id: "T-1003",
      date: "15/03/2024",
      time: "09:45",
      requestType: "Hỗ trợ kỹ thuật",
      notes: "Khách hàng cần hướng dẫn cài đặt phần mềm",
      agent: "Lê Văn C",
      status: "Hoàn thành",
      channel: "Chat",
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
    setStatus("");
    setChannel("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* New interaction form */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tương tác mới
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhu Cầu Khách Hàng</label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhu cầu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nhu cầu</SelectLabel>
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
              <label className="text-sm font-medium">Trạng thái Xử Lý</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trạng thái</SelectLabel>
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
              <label className="text-sm font-medium">Kênh Tiếp Nhận</label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn kênh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kênh tiếp nhận</SelectLabel>
                    {channelOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian tương tác</label>
              <div className="flex items-center gap-2 h-10">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ghi chú</label>
            <Textarea 
              placeholder="Nhập ghi chú tại đây..." 
              className="min-h-[120px]" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setNotes("");
              setRequestType("");
              setStatus("");
              setChannel("");
            }}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Lưu Lại
            </Button>
          </div>
        </div>
      </div>

      {/* Ticket history */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lịch Sử TICKET
          </h3>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Tìm kiếm ticket..." 
              className="h-8 w-[180px] text-xs"
            />
          </div>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Ticket</TableHead>
                <TableHead>Thời Gian</TableHead>
                <TableHead>Nhu Cầu KH</TableHead>
                <TableHead>Nội Dung</TableHead>
                <TableHead>Nhân Viên</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Kênh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.date} {ticket.time}</TableCell>
                  <TableCell>{ticket.requestType}</TableCell>
                  <TableCell className="max-w-xs truncate">{ticket.notes}</TableCell>
                  <TableCell>{ticket.agent}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === "Hoàn thành" 
                        ? "bg-green-100 text-green-800" 
                        : ticket.status === "Đang xử lý" 
                          ? "bg-blue-100 text-blue-800" 
                          : ticket.status === "Mới" 
                            ? "bg-purple-100 text-purple-800" 
                            : "bg-gray-100 text-gray-800"
                    }`}>
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.channel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
