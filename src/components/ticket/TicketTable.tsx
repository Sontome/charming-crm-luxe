
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface Ticket {
  id: string;
  date: string;
  time: string;
  requestType: string;
  content: string;
  notes: string;
  agent: string;
  status: string;
}

interface TicketTableProps {
  tickets: Ticket[];
}

export default function TicketTable({ tickets }: TicketTableProps) {
  return (
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
            {tickets.map((ticket, index) => (
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
  );
}
