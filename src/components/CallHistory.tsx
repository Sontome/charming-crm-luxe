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
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface RecentCall {
  timeStart: string;
  customerCode: number;
  status: string;
  interactionCodeStart: number;
  ticketSerial: string;
}

interface CallHistoryProps {
  onSearch?: (phoneNumber: string) => void;
}

export default function CallHistory({ onSearch }: CallHistoryProps) {
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchingCustomer, setSearchingCustomer] = useState<number | null>(null);
  const navigate = useNavigate();

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

  const handleCheckCustomer = async (customerCode: number) => {
    setSearchingCustomer(customerCode);
    
    try {
      // Get the customer's phone number from the Customer table
      const { data, error } = await supabase
        .from("Customer")
        .select("customerPhone")
        .eq("customerCode", customerCode)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data && data.customerPhone) {
        // If we have onSearch prop, call it directly
        if (onSearch) {
          onSearch(data.customerPhone);
        } else {
          // Otherwise, navigate to the search page with the phone number
          navigate(`/?phone=${data.customerPhone}`);
        }
        
        toast({
          title: "Khách hàng được tìm thấy",
          description: `Đã tìm thấy khách hàng với số điện thoại ${data.customerPhone}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Không tìm thấy",
          description: "Không tìm thấy số điện thoại của khách hàng này",
        });
      }
    } catch (error) {
      console.error("Error searching for customer:", error);
      toast({
        variant: "destructive",
        title: "Lỗi tìm kiếm",
        description: "Không thể tìm kiếm khách hàng, vui lòng thử lại sau",
      });
    } finally {
      setSearchingCustomer(null);
    }
  };

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
              <TableHead>Tác vụ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : recentCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không có cuộc gọi nào gần đây
                </TableCell>
              </TableRow>
            ) : (
              recentCalls.map((call) => {
                const formattedTime = formatDate(call.timeStart);
                const [date, time] = formattedTime.split(' ');
                const isSearching = searchingCustomer === call.customerCode;
                
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
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-8 h-8 p-0"
                        onClick={() => handleCheckCustomer(call.customerCode)}
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">Kiểm tra khách hàng</span>
                      </Button>
                    </TableCell>
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
