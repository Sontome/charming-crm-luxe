
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CallHistory from "@/components/CallHistory";
import ContactDetails from "@/components/ContactDetails";
import TicketHistory from "@/components/TicketHistory";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  name: string;
  phoneNumber: string;
  customerId: string;
  email: string;
}

interface Call {
  id: string;
  date: string;
  time: string;
  phoneNumber: string;
  status: "tiếp nhận" | "nhỡ" | "mới";
  duration: string;
}

export default function Index() {
  const { toast } = useToast();
  const [contact, setContact] = useState<Contact | null>(null);

  const mockCalls: Call[] = [
    {
      id: "1",
      date: "20/03/2024",
      time: "10:45:23",
      phoneNumber: "0123456789",
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

  const handleSearch = (phoneNumber: string) => {
    // Mock API call - in a real app, this would call your backend
    setTimeout(() => {
      // Check if the phone number matches one of our mock data
      if (phoneNumber === "0123456789") {
        setContact({
          name: "Nguyễn Văn A",
          phoneNumber: "0123456789",
          customerId: "KH001",
          email: "nguyenvana@example.com",
        });
        toast({
          title: "Khách hàng được tìm thấy",
          description: "Thông tin khách hàng đã được hiển thị",
        });
      } else if (phoneNumber === "0987654321") {
        setContact({
          name: "Trần Thị B",
          phoneNumber: "0987654321",
          customerId: "KH002",
          email: "tranthib@example.com",
        });
        toast({
          title: "Khách hàng được tìm thấy",
          description: "Thông tin khách hàng đã được hiển thị",
        });
      } else {
        setContact(null);
        toast({
          variant: "destructive",
          title: "Không tìm thấy khách hàng",
          description: "Không có khách hàng nào với số điện thoại này",
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
          <div className="bg-card rounded-lg p-4 border shadow-sm">
            <h2 className="text-lg font-medium mb-4">Tìm kiếm khách hàng</h2>
            <SearchBar onSearch={handleSearch} />
          </div>
          {contact && <ContactDetails contact={contact} />}
        </div>
        
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <CallHistory calls={mockCalls} />
          {contact && <TicketHistory />}
        </div>
      </div>
    </div>
  );
}
