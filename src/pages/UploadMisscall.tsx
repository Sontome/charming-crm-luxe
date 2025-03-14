
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CSVFileUploader } from "@/components/upload/CSVFileUploader";
import { ProgressIndicator } from "@/components/upload/ProgressIndicator";
import { parseCSV } from "@/utils/misscallParser";
import { uploadService } from "@/services/uploadService";

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

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Vui lòng chọn file CSV');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file CSV để tải lên');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Clear existing data
      await uploadService.clearMisscallData();
      setUploadProgress(20);
      
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
            
            // Upload data
            const recordCount = await uploadService.uploadMisscalls(
              missedCalls, 
              (progress) => setUploadProgress(progress)
            );
            
            setUploadProgress(100);
            toast({
              title: "Tải lên thành công",
              description: `Đã xóa dữ liệu cũ và tải lên ${recordCount} bản ghi cuộc gọi nhỡ mới`,
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
          <CSVFileUploader 
            onFileSelect={handleFileChange}
            error={error}
          />
          
          <ProgressIndicator 
            isUploading={isUploading} 
            progress={uploadProgress} 
          />
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
