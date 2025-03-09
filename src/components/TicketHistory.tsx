
import { useState } from "react";
import TicketTable from "./ticket/TicketTable";
import TicketForm from "./ticket/TicketForm";
import { recentTickets } from "./ticket/ticketData";

export default function TicketHistory() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Ticket history table */}
      <TicketTable tickets={recentTickets} />
      
      {/* Notes and new interaction form */}
      <TicketForm />
    </div>
  );
}
