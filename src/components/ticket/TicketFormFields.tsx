
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfigData } from "@/pages/Index";

interface TicketFormFieldsProps {
  configData: ConfigData;
  notes: string;
  setNotes: (notes: string) => void;
  requestType: string;
  setRequestType: (requestType: string) => void;
  serviceType: string;
  setServiceType: (serviceType: string) => void;
  ticketDetail: string;
  setTicketDetail: (ticketDetail: string) => void;
  status: string;
  setStatus: (status: string) => void;
  channel: string;
  setChannel: (channel: string) => void;
  departmentCollaboration: string;
  setDepartmentCollaboration: (departmentCollaboration: string) => void;
}

export default function TicketFormFields({
  configData,
  notes,
  setNotes,
  requestType,
  setRequestType,
  serviceType,
  setServiceType,
  ticketDetail,
  setTicketDetail,
  status,
  setStatus,
  channel,
  setChannel,
  departmentCollaboration,
  setDepartmentCollaboration
}: TicketFormFieldsProps) {
  const [detailOptions, setDetailOptions] = useState<{id: string, label: string}[]>([]);

  // Update detail options when request type changes
  useEffect(() => {
    if (requestType && configData.detailOptionsMap[requestType]) {
      setDetailOptions(configData.detailOptionsMap[requestType]);
      setTicketDetail("");
    } else {
      setDetailOptions([]);
      setTicketDetail("");
    }
  }, [requestType, configData.detailOptionsMap, setTicketDetail]);

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea 
          placeholder="Nhập ghi chú tại đây..." 
          className="min-h-[120px] w-full border transition-shadow focus:shadow-md" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nhu Cầu Khách Hàng</label>
          <Select value={requestType} onValueChange={(value) => setRequestType(value)}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn nhu cầu" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.requestTypes.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Loại DV</label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn loại dịch vụ" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.serviceTypes.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Chi Tiết Nhu Cầu</label>
          <Select value={ticketDetail} onValueChange={setTicketDetail}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Chọn chi tiết" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {detailOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trạng thái Xử Lý</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="DONE" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phối Hợp Liên Phòng Ban</label>
          <Select value={departmentCollaboration} onValueChange={setDepartmentCollaboration}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Không" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.departmentOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kênh Tiếp Nhận</label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-full transition-all hover:shadow-sm focus:shadow-md">
              <SelectValue placeholder="Inbound" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectGroup>
                {configData.channelOptions.map((option) => (
                  <SelectItem key={option.id} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
