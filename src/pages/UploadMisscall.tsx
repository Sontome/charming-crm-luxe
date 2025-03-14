
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UploadMisscall() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { agent } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin, if not redirect
  if (agent?.user_role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if the file is a CSV
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError('Vui lòng chọn file CSV');
      }
    }
  };

  const parseCSV = async (text: string) => {
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

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file CSV để tải lên');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // First, delete all existing records from RawMissCall table
      setUploadProgress(20);
      const { error: deleteError } = await supabase
        .from('RawMissCall')
        .delete()
        .not('ani', 'is', null); // This is a workaround to delete all records, as .delete() without filters is not supported
      
      if (deleteError) {
        throw new Error(`Lỗi khi xóa dữ liệu cũ: ${deleteError.message}`);
      }
      
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (e.target?.result) {
            const csvText = e.target.result.toString();
            setUploadProgress(30);
            
            // Parse the CSV
            const missedCalls = await parseCSV(csvText);
            setUploadProgress(50);
            
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
              setUploadProgress(Math.min(progressPercentage, 99));
            }
            
            setUploadProgress(100);
            toast({
              title: "Tải lên thành công",
              description: `Đã xóa dữ liệu cũ và tải lên ${missedCalls.length} bản ghi cuộc gọi nhỡ mới`,
            });
            
            // Reset form
            setFile(null);
            if (document.getElementById('file-upload') as HTMLInputElement) {
              (document.getElementById('file-upload') as HTMLInputElement).value = '';
            }
          }
        } catch (err) {
          setError(`Lỗi xử lý file: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
          console.error("Error processing CSV:", err);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };
      
      reader.onerror = () => {
        setError('Lỗi khi đọc file. Vui lòng thử lại.');
        setIsUploading(false);
      };
      
      reader.readAsText(file);
      
    } catch (err) {
      setError(`Lỗi: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      setIsUploading(false);
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Misscall</CardTitle>
          <CardDescription>
            Tải lên file CSV chứa dữ liệu cuộc gọi nhỡ để cập nhật vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Chọn file CSV
            </label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Kéo thả file CSV vào đây hoặc nhấn chọn file</p>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="max-w-sm"
              />
            </div>
          </div>
          
          {file && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>File đã chọn</AlertTitle>
              <AlertDescription>{file.name} ({Math.round(file.size / 1024)} KB)</AlertDescription>
            </Alert>
          )}
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${uploadProgress}%` }} 
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
