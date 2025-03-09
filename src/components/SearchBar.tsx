
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (phoneNumber: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onSearch(phoneNumber);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative animate-fade-in">
      <div className="relative">
        <Input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="pr-12 py-6 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
