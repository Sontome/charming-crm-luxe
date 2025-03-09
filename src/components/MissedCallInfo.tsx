
import { PhoneOff } from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

interface MissedCallInfoProps {
  phoneNumber: string;
}

export default function MissedCallInfo({ phoneNumber }: MissedCallInfoProps) {
  return (
    <Card className="animate-fade-in bg-gray-900 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <PhoneOff className="h-5 w-5" />
          MissCall
        </CardTitle>
        <span className="bg-white text-black rounded-lg px-2 py-0.5 text-sm font-medium">0</span>
      </CardHeader>
      <CardContent className="pt-2 pb-4 space-y-1 text-sm">
        <div>Last time update misscall: 23/11/2024 18:17:59</div>
        <div>Last call: 24/11/2024 14:08:15</div>
      </CardContent>
    </Card>
  );
}
