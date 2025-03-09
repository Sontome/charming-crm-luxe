
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

interface TicketOption {
  id: string;
  label: string;
}

export default function TicketHistory() {
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
      requestType: "Thông tin sản phẩm",
      notes: "Khách hàng có yêu cầu về thông tin sản phẩm mới",
      agent: "Nguyễn Văn A",
      status: "Hoàn thành",
    },
    {
      id: "T-1002",
      date: "18/03/2024",
      requestType: "Khiếu nại dịch vụ",
      notes: "Khách hàng phàn nàn về dịch vụ giao hàng chậm",
      agent: "Trần Thị B",
      status: "Đang xử lý",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <h3 className="font-semibold">Lịch Sử TICKET</h3>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời Gian</TableHead>
                <TableHead>Nhu Cầu KH</TableHead>
                <TableHead>Nội Dung Trao Đổi</TableHead>
                <TableHead>Nhân Viên</TableHead>
                <TableHead>Mã Ticket</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>{ticket.date}</TableCell>
                  <TableCell>{ticket.requestType}</TableCell>
                  <TableCell className="max-w-xs truncate">{ticket.notes}</TableCell>
                  <TableCell>{ticket.agent}</TableCell>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <h3 className="font-semibold">Ghi chú</h3>
        </div>
        <div className="p-4 space-y-4">
          <Textarea 
            placeholder="Nhập ghi chú tại đây..." 
            className="min-h-[120px]" 
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nhu Cầu Khách Hàng</label>
          <Select>
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
          <Select>
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
          <Select>
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

        <div className="flex items-end">
          <Button className="w-full">Lưu Lại</Button>
        </div>
      </div>
    </div>
  );
}
