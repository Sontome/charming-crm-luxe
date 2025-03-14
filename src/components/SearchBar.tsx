
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SearchButton } from "./search/SearchButton";

interface SearchBarProps {
  onSearch: (phoneNumber: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
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
          disabled={isLoading}
          className="pr-12 py-6 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary"
        />
        <SearchButton isLoading={isLoading} />
      </div>
    </form>
  );
}
