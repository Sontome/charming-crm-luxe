
import { supabase } from "@/integrations/supabase/client";
import { generateTicketSerial } from "@/utils/formatters";

interface PendingTicket {
  ticketSerial: string;
  timeStart: string;
  nhuCauKH: string;
  chiTietNhuCau: string;
}

export async function fetchPendingTickets(customerCode: number): Promise<PendingTicket[]> {
  try {
    // Only get PENDING tickets for this specific customer
    const { data: ticketData, error: ticketError } = await supabase
      .from("Ticket")
      .select("ticketSerial, timeStart")
      .eq("customerCode", customerCode)
      .eq("status", "PENDING");
    
    if (ticketError) throw ticketError;
    
    if (ticketData && ticketData.length > 0) {
      // For each ticket, get the interaction details
      const pendingTicketsWithDetails = await Promise.all(
        ticketData.map(async (ticket) => {
          const { data: interactionData, error: interactionError } = await supabase
            .from("Interaction")
            .select("nhuCauKH, chiTietNhuCau")
            .eq("ticketSerial", ticket.ticketSerial)
            .order("interactionCode", { ascending: false })
            .limit(1)
            .single();
          
          if (interactionError) {
            console.error("Error fetching interaction:", interactionError);
            return {
              ...ticket,
              nhuCauKH: "Không xác định",
              chiTietNhuCau: "Không xác định"
            };
          }
          
          return {
            ...ticket,
            nhuCauKH: interactionData.nhuCauKH,
            chiTietNhuCau: interactionData.chiTietNhuCau
          };
        })
      );
      
      return pendingTicketsWithDetails;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching pending tickets:", error);
    throw error;
  }
}

export async function updateExistingTicket({
  selectedTicketSerial,
  customerCode,
  timeStart,
  requestType,
  ticketDetail,
  notes,
  agentId,
  status
}: {
  selectedTicketSerial: string;
  customerCode: number;
  timeStart: string;
  requestType: string;
  ticketDetail: string;
  notes: string;
  agentId: string;
  status: string;
}) {
  const now = new Date().toISOString();
  
  // Update the existing ticket's timeEnd and status
  const { error: updateTicketError } = await supabase
    .from("Ticket")
    .update({ 
      timeEnd: now,
      status: status
    })
    .eq("ticketSerial", selectedTicketSerial);
  
  if (updateTicketError) {
    console.error("Error updating ticket:", updateTicketError);
    throw updateTicketError;
  }
  
  console.log("Successfully updated ticket with serial:", selectedTicketSerial, "New status:", status);
  
  // Create new interaction record with the existing ticket serial using the selected status
  const { data: interactionData, error: interactionError } = await supabase
    .from("Interaction")
    .insert({
      customerCode: customerCode,
      timeStart: timeStart,
      nhuCauKH: requestType,
      chiTietNhuCau: ticketDetail,
      noteInput: notes,
      agentID: agentId,
      status: status,
      ticketSerial: selectedTicketSerial
    })
    .select()
    .single();
  
  if (interactionError) throw interactionError;
  
  // Update all interactions with this ticket serial to have the same status
  const { error: updateInteractionsError } = await supabase
    .from("Interaction")
    .update({ status: status })
    .eq("ticketSerial", selectedTicketSerial);
  
  if (updateInteractionsError) {
    console.error("Error updating interactions:", updateInteractionsError);
  }
  
  return interactionData;
}

export async function createNewTicket({
  customerCode,
  timeStart,
  requestType,
  ticketDetail,
  notes,
  agentId,
  status,
  channel,
  departmentCollaboration
}: {
  customerCode: number;
  timeStart: string;
  requestType: string;
  ticketDetail: string;
  notes: string;
  agentId: string;
  status: string;
  channel: string;
  departmentCollaboration: string;
}) {
  const now = new Date().toISOString();
  
  // Get next ticket code
  const { data: maxTicketData } = await supabase
    .from("Ticket")
    .select("ticketCode")
    .order("ticketCode", { ascending: false })
    .limit(1)
    .single();
  
  const nextTicketCode = maxTicketData ? maxTicketData.ticketCode + 1 : 1;
  
  // Generate ticket serial with the updated format
  const ticketSerial = generateTicketSerial(
    channel, 
    agentId, 
    timeStart, 
    nextTicketCode
  );

  // Insert new interaction first
  const { data: interactionData, error: interactionError } = await supabase
    .from("Interaction")
    .insert({
      customerCode: customerCode,
      timeStart: timeStart,
      nhuCauKH: requestType,
      chiTietNhuCau: ticketDetail,
      noteInput: notes,
      agentID: agentId,
      status: status,
      ticketSerial: ticketSerial
    })
    .select()
    .single();
  
  if (interactionError) throw interactionError;
  
  // Insert new ticket with timeStart from lastActivity and timeEnd as now
  const { error: ticketError } = await supabase
    .from("Ticket")
    .insert({
      ticketSerial: ticketSerial,
      agent: agentId,
      kenhTiepNhan: channel,
      interactionCodeStart: interactionData.interactionCode,
      timeStart: timeStart,
      customerCode: customerCode,
      phoiHop: departmentCollaboration,
      status: status,
      interactionCodeEnd: interactionData.interactionCode,
      ticketCode: nextTicketCode,
      timeEnd: now
    });
  
  if (ticketError) throw ticketError;
  
  return interactionData;
}

export async function getCustomerLastActivity(customerCode: number): Promise<string> {
  const { data, error } = await supabase
    .from("Customer")
    .select("lastActivity")
    .eq("customerCode", customerCode)
    .single();
  
  if (error) throw error;
  return data.lastActivity;
}
