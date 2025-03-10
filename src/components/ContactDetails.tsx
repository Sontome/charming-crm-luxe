
import { User } from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { formatDate } from "@/utils/formatters";

interface Contact {
  customerName?: string;
  customerPhone: string;
  customerID?: string;
  customerEmail?: string;
  lastActivity?: string;
  customerCode?: number;
}

interface ContactDetailsProps {
  contact: Contact | null;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  if (!contact) {
    return null;
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
          <User className="h-6 w-6" />
        </div>
        <div className="grid gap-0.5">
          <CardTitle className="text-lg md:text-xl">Contact</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="text-sm text-red-500 font-medium">Name:</div>
            <div className="font-medium">{contact.customerName || "Unname"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-red-500 font-medium">Số Điện Thoại:</div>
            <div className="font-medium">{contact.customerPhone}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-red-500 font-medium">Mã Khách Hàng:</div>
            <div className="font-medium">{contact.customerID || "N/A"}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-red-500 font-medium">Email:</div>
            <div className="font-medium">{contact.customerEmail || "N/A"}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="text-sm text-red-500 font-medium">Hoạt động gần nhất:</div>
            <div className="font-medium">
              {contact.lastActivity ? formatDate(contact.lastActivity) : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
