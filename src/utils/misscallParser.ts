
export interface MissedCall {
  ani: string | null;
  loanBriefId: string | null;
  userName: string | null;
  start_stamp: string | null;
  duration: number;
  billsec: string | null;
  trangThai: string | null;
  trangThaiChung: string | null;
  GhiAm: string | null;
}

export const parseCSV = async (text: string): Promise<MissedCall[]> => {
  const rows = text.split('\n');
  
  // Skip header row and empty rows
  const data = rows
    .filter((row) => row.trim().length > 0)
    .slice(1)
    .map((row) => {
      const values = row.split(',');
      return {
        ani: values[0]?.trim() || null,
        loanBriefId: values[1]?.trim() || null,
        userName: values[2]?.trim() || null,
        start_stamp: values[3]?.trim() || null,
        duration: isNaN(parseInt(values[4]?.trim() || '0')) ? 0 : parseInt(values[4]?.trim() || '0'),
        billsec: values[5]?.trim() || null,
        trangThai: values[6]?.trim() || null,
        trangThaiChung: values[7]?.trim() || null,
        GhiAm: values[8]?.trim() || null,
      };
    });
  
  return data;
};
