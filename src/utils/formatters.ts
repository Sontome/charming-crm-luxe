
export const formatPhoneNumber = (phone: string): string => {
  // Remove all spaces
  let formattedPhone = phone.replace(/\s+/g, '');
  
  // Add leading zero if not present
  if (formattedPhone.length > 0 && !formattedPhone.startsWith('0')) {
    formattedPhone = '0' + formattedPhone;
  }
  
  return formattedPhone;
};

export const generateTicketSerial = (
  serviceType: string, 
  agentId: string, 
  timeStart: string, 
  ticketCode: number
): string => {
  // Get first 2 chars of service type (uppercase)
  const servicePrefix = serviceType.substring(0, 2).toUpperCase();
  
  // Format date as DDMMYYYY
  const date = new Date(timeStart);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // Format: XXAGENTDDMMYYYY-N
  return `${servicePrefix}${agentId}${day}${month}${year}-${ticketCode}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN') + ' ' + 
         date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
};
