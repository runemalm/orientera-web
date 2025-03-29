
import React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchInput = ({ value, onChange, onClear, onSubmit }: SearchInputProps) => {
  return (
    <div className="rounded-lg border bg-card mb-4 p-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Sök efter tävlingsnamn eller plats..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Rensa sökning"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="icon">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default SearchInput;
