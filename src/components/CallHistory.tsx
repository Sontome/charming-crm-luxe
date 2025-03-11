
import { useEffect, useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";

interface RecentCall {
  timeStart: string;
  customerCode: number;
  status: string;
  interactionCodeStart: number;
  ticketSerial: string;
}

export default function CallHistory() {
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCalls = async () => {
      try {
        // Fetch recent calls with status PENDING from Ticket table
        const { data, error } = await supabase
          .from("Ticket")
          .select(`
            timeStart,
            customerCode,
            status,
            interactionCodeStart,
            ticketSerial
          `)
          .eq("status", "PENDING")
          .order("timeStart", { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data) {
          setRecentCalls(data);
        }
      } catch (error) {
        console.error("Error fetching recent calls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentCalls();
  }, []);

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
              <TableHead>Mã khách hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Mã tương tác</TableHead>
              <TableHead>Mã Ticket</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : recentCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không có cuộc gọi nào gần đây
                </TableCell>
              </TableRow>
            ) : (
              recentCalls.map((call) => {
                const formattedTime = formatDate(call.timeStart);
                const [date, time] = formattedTime.split(' ');
                
                return (
                  <TableRow key={call.ticketSerial} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{`${date} ${time}`}</TableCell>
                    <TableCell>{call.customerCode}</TableCell>
                    <TableCell>
                      <span 
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
                        )}
                      >
                        {call.status}
                      </span>
                    </TableCell>
                    <TableCell>{call.interactionCodeStart}</TableCell>
                    <TableCell>{call.ticketSerial}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
