
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  isUploading: boolean;
}

export function ProgressIndicator({ progress, isUploading }: ProgressIndicatorProps) {
  if (!isUploading) return null;
  
  return (
    <Progress value={progress} className="w-full h-2.5" />
  );
}
