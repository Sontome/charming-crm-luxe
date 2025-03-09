
export interface TicketOption {
  id: string;
  label: string;
}

export interface Ticket {
  id: string;
  date: string;
  time: string;
  requestType: string;
  content: string;
  notes: string;
  agent: string;
  status: string;
}

// Mock data for dropdowns and history
export const recentTickets: Ticket[] = [
  {
    id: "Yêu Cầu",
    date: "04/08/2024",
    time: "09:59:13",
    requestType: "Hỗ trợ hợp đồng cho KH doanh nghiệp",
    content: "Tra cứu/Hỗ trợ thông tin",
    notes: "cúp ngang",
    agent: "SONTX",
    status: "Đã Xử Lý",
  },
  {
    id: "Yêu Cầu",
    date: "04/08/2024",
    time: "11:00:35",
    requestType: "Hỗ trợ hợp đồng cho KH doanh nghiệp",
    content: "Tra cứu/Hỗ trợ thông tin",
    notes: "tốt toàn",
    agent: "SONTX",
    status: "Đã Xử Lý",
  },
];
