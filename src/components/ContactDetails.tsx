
import { User } from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Contact {
  name: string;
  phoneNumber: string;
  customerId: string;
  email: string;
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
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-6 w-6" />
        </div>
        <div className="grid gap-0.5">
          <CardTitle className="text-lg md:text-xl">{contact.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="text-sm font-medium">Số Điện Thoại:</div>
            <div className="text-sm">{contact.phoneNumber}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="text-sm font-medium">Mã Khách Hàng:</div>
            <div className="text-sm">{contact.customerId}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="text-sm font-medium">Email:</div>
            <div className="text-sm">{contact.email}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
