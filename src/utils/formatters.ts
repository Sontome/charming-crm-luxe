
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
  // Extract the first letters of each word in serviceType
  const words = serviceType.split(' ');
  let servicePrefix = '';
  
  if (words.length >= 2) {
    // Take first letter of first word and first letter of second word
    servicePrefix = (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  } else {
    // If only one word, take first two letters
    servicePrefix = serviceType.substring(0, 2).toUpperCase();
  }
  
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
