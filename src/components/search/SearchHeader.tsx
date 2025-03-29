
import React from "react";

interface SearchHeaderProps {
  resultCount: number;
}

const SearchHeader = ({ resultCount }: SearchHeaderProps) => {
  return (
    <div className="bg-card rounded-lg border p-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">
          {resultCount} {resultCount === 1 ? 'tävling' : 'tävlingar'} hittades
        </h2>
        <div className="text-sm text-muted-foreground">
          Visar alla kommande tävlingar
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
