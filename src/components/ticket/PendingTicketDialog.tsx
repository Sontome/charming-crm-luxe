
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface PendingTicket {
  ticketSerial: string;
  timeStart: string;
  nhuCauKH: string;
  chiTietNhuCau: string;
}

interface PendingTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingTickets: PendingTicket[];
  onSelectExisting: (ticketSerial: string) => void;
  onCreateNew: () => void;
}

export default function PendingTicketDialog({
  open,
  onOpenChange,
  pendingTickets,
  onSelectExisting,
  onCreateNew
}: PendingTicketDialogProps) {
  const { toast } = useToast();
  const [selectedPendingTicket, setSelectedPendingTicket] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lựa chọn Ticket</DialogTitle>
          <DialogDescription>
            Đã có các ticket đang xử lý (PENDING) cho khách hàng này. Bạn có thể chọn cập nhật một ticket hiện có hoặc tạo ticket mới.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Chọn Ticket đang xử lý</label>
            <Select value={selectedPendingTicket} onValueChange={setSelectedPendingTicket}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn Mã Ticket" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {pendingTickets.map((ticket) => (
                    <SelectItem key={ticket.ticketSerial} value={ticket.ticketSerial}>
                      {ticket.ticketSerial} - {ticket.nhuCauKH} - {ticket.chiTietNhuCau}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onCreateNew();
            }}
          >
            Tạo Ticket mới
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (selectedPendingTicket) {
                onSelectExisting(selectedPendingTicket);
              } else {
                toast({
                  title: "Chưa chọn Ticket",
                  description: "Vui lòng chọn một Ticket để cập nhật hoặc tạo Ticket mới.",
                  variant: "destructive"
                });
              }
            }}
            disabled={!selectedPendingTicket}
          >
            Cập nhật Ticket đã chọn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
