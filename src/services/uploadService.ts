
import { supabase } from "@/integrations/supabase/client";
import { MissedCall } from "@/utils/misscallParser";

export const uploadService = {
  async clearMisscallData() {
    const { error } = await supabase
      .from('RawMissCall')
      .delete()
      .not('ani', 'is', null); // Workaround to delete all records
    
    if (error) {
      throw new Error(`Lỗi khi xóa dữ liệu cũ: ${error.message}`);
    }
  },
  
  async uploadMisscalls(missedCalls: MissedCall[], onProgress: (progress: number) => void) {
    // Insert records in batches to avoid timeouts
    const batchSize = 100;
    let processed = 0;
    
    for (let i = 0; i < missedCalls.length; i += batchSize) {
      const batch = missedCalls.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('RawMissCall')
        .insert(batch);
      
      if (insertError) {
        throw new Error(`Lỗi khi tải dữ liệu: ${insertError.message}`);
      }
      
      processed += batch.length;
      const progressPercentage = 50 + (processed / missedCalls.length) * 50;
      onProgress(Math.min(progressPercentage, 99));
    }
    
    return missedCalls.length;
  }
};
