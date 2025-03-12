import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import CallHistory from "@/components/CallHistory";
import ContactDetails from "@/components/ContactDetails";
import TicketHistory, { PendingTicket } from "@/components/TicketHistory";
import MissedCallInfo from "@/components/MissedCallInfo";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatPhoneNumber } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";

interface Customer {
  customerCode: number;
  customerName: string;
  customerPhone: string;
  customerID: string;
  customerEmail: string;
  lastActivity: string;
}

interface Call {
  id: string;
  date: string;
  time: string;
  phoneNumber: string;
  status: "tiếp nhận" | "nhỡ" | "mới";
  duration: string;
}

interface DropdownOption {
  id: string;
  label: string;
}

export interface ConfigData {
  serviceTypes: DropdownOption[];
  requestTypes: DropdownOption[];
  statusOptions: DropdownOption[];
  departmentOptions: DropdownOption[];
  channelOptions: DropdownOption[];
  detailOptionsMap: Record<string, DropdownOption[]>;
}

export default function Index() {
  const { toast } = useToast();
  const { agent } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchedPhoneNumber, setSearchedPhoneNumber] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [pendingTickets, setPendingTickets] = useState<PendingTicket[]>([]);
  const [configData, setConfigData] = useState<ConfigData>({
    serviceTypes: [],
    requestTypes: [],
    statusOptions: [],
    departmentOptions: [],
    channelOptions: [],
    detailOptionsMap: {}
  });
  
  const mockCalls: Call[] = [
    {
      id: "1",
      date: "20/03/2024",
      time: "10:45:23",
      phoneNumber: "0978264656",
      status: "tiếp nhận",
      duration: "05:23",
    },
    {
      id: "2",
      date: "20/03/2024",
      time: "10:30:15",
      phoneNumber: "0987654321",
      status: "nhỡ",
      duration: "00:00",
    },
    {
      id: "3",
      date: "20/03/2024",
      time: "10:15:45",
      phoneNumber: "0369852147",
      status: "tiếp nhận",
      duration: "03:45",
    },
  ];

  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const { data: serviceTypesData } = await supabase
          .from("Config")
          .select("Value1")
          .eq("DropdownName", "loaiDv");
        
        const { data: requestTypesData } = await supabase
          .from("Config")
          .select("Value2")
          .eq("DropdownName", "chiTietNhuCau");
        
        const { data: statusData } = await supabase
          .from("Config")
          .select("Value1")
          .eq("DropdownName", "trangThai");
        
        const { data: departmentData } = await supabase
          .from("Config")
          .select("Value1")
          .eq("DropdownName", "phoiHop");
        
        const { data: channelData } = await supabase
          .from("Config")
          .select("Value1")
          .eq("DropdownName", "kenhTiepNhan");
        
        const { data: allDetailOptions } = await supabase
          .from("Config")
          .select("Value1, Value2")
          .eq("DropdownName", "chiTietNhuCau");
        
        const serviceTypes = serviceTypesData?.map((item, index) => ({
          id: index.toString(),
          label: item.Value1
        })) || [];
        
        const uniqueRequestTypes = Array.from(
          new Set(requestTypesData?.map(item => item.Value2).filter(Boolean))
        );
        
        const requestTypes = uniqueRequestTypes.map((item, index) => ({
          id: index.toString(),
          label: item
        }));
        
        const statusOptions = statusData?.map((item, index) => ({
          id: index.toString(),
          label: item.Value1
        })) || [];
        
        const departmentOptions = departmentData?.map((item, index) => ({
          id: index.toString(),
          label: item.Value1
        })) || [];
        
        const channelOptions = channelData?.map((item, index) => ({
          id: index.toString(),
          label: item.Value1
        })) || [];
        
        const detailOptionsMap: Record<string, DropdownOption[]> = {};
        
        allDetailOptions?.forEach((item) => {
          if (item.Value2) {
            if (!detailOptionsMap[item.Value2]) {
              detailOptionsMap[item.Value2] = [];
            }
            
            detailOptionsMap[item.Value2].push({
              id: detailOptionsMap[item.Value2].length.toString(),
              label: item.Value1
            });
          }
        });
        
        setConfigData({
          serviceTypes,
          requestTypes,
          statusOptions,
          departmentOptions,
          channelOptions,
          detailOptionsMap
        });
      } catch (error) {
        console.error("Error fetching config data:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải cấu hình từ máy chủ",
        });
      }
    };
    
    fetchConfigData();
  }, [toast]);

  useEffect(() => {
    const phoneParam = searchParams.get('phone');
    if (phoneParam && !searchedPhoneNumber) {
      handleSearch(phoneParam);
      searchParams.delete('phone');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const handlePendingTicketsFound = (tickets: PendingTicket[]) => {
    setPendingTickets(tickets);
  };

  const handleClearAll = () => {
    setCustomer(null);
    setSearchedPhoneNumber("");
    setPendingTickets([]);
  };

  const handleSearch = async (phoneNumber: string) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    setSearchedPhoneNumber(formattedPhone);
    setIsSearching(true);
    
    try {
      const { data: customerData, error } = await supabase
        .from("Customer")
        .select("*")
        .eq("customerPhone", formattedPhone)
        .single();
      
      const now = new Date().toISOString();
      
      if (error) {
        if (error.code === "PGRST116") {
          const { data: newCustomer, error: createError } = await supabase
            .from("Customer")
            .insert({
              customerPhone: formattedPhone,
              lastActivity: now,
              firstActivity: now
            })
            .select()
            .single();
          
          if (createError) {
            throw createError;
          }
          
          setCustomer(newCustomer);
          toast({
            title: "Khách hàng mới",
            description: "Đã tạo hồ sơ cho khách hàng mới",
          });
        } else {
          throw error;
        }
      } else {
        const { error: updateError } = await supabase
          .from("Customer")
          .update({ lastActivity: now })
          .eq("customerCode", customerData.customerCode);
        
        if (updateError) {
          console.error("Error updating lastActivity:", updateError);
          toast({
            variant: "destructive",
            title: "Lỗi cập nhật",
            description: "Không thể cập nhật thời gian hoạt động mới nhất của khách hàng",
          });
        } else {
          console.log("Successfully updated lastActivity for customer:", customerData.customerCode);
        }
        
        setCustomer({
          ...customerData,
          lastActivity: now
        });
        
        toast({
          title: "Khách hàng được tìm thấy",
          description: "Thông tin khách hàng đã được hiển thị",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: "Lỗi tìm kiếm",
        description: "Không thể tìm kiếm khách hàng, vui lòng thử lại sau",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
          {searchedPhoneNumber === "0978264656" && (
            <MissedCallInfo phoneNumber={searchedPhoneNumber} />
          )}
          
          <div className="bg-card rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-medium mb-4">Tìm kiếm khách hàng</h2>
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>
          
          {customer && (
            <ContactDetails 
              contact={customer} 
              className="hover:shadow-md transition-shadow duration-300" 
            />
          )}
        </div>
        
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <CallHistory onSearch={handleSearch} />
          {customer && (
            <TicketHistory 
              customerCode={customer.customerCode} 
              configData={configData} 
              onClear={handleClearAll}
              onPendingTicketsFound={handlePendingTicketsFound}
            />
          )}
        </div>
      </div>
    </div>
  );
}
