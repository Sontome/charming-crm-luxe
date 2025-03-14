
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CSVFileUploaderProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

export function CSVFileUploader({ onFileSelect, error }: CSVFileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if the file is a CSV
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
      } else {
        setFile(null);
        onFileSelect(null as unknown as File);
      }
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}
