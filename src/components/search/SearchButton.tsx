
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  isLoading: boolean;
}

export function SearchButton({ isLoading }: SearchButtonProps) {
  return (
    <Button 
      type="submit" 
      size="icon" 
      disabled={isLoading}
      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
      ) : (
        <Search className="h-5 w-5" />
      )}
      <span className="sr-only">Search</span>
    </Button>
  );
}
