
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Call {
  id: string;
  date: string;
  time: string;
  phoneNumber: string;
  status: "tiếp nhận" | "nhỡ" | "mới";
  duration: string;
}

interface CallHistoryProps {
  calls: Call[];
}

export default function CallHistory({ calls }: CallHistoryProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
        <h3 className="font-semibold">Cuộc gọi gần đây</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời lượng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{`${call.date} ${call.time}`}</TableCell>
                <TableCell>{call.phoneNumber}</TableCell>
                <TableCell>
                  <span 
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      call.status === "tiếp nhận" ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300" :
                      call.status === "nhỡ" ? "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
                    )}
                  >
                    Đã {call.status}
                  </span>
                </TableCell>
                <TableCell>{call.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
