
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

interface CheckboxFilterProps {
  title: string;
  items: { id: string; name: string; count?: number }[];
  selectedItems: string[];
  onItemChange: (itemId: string, checked: boolean) => void;
  accordionValue: string;
  hideSearch?: boolean;
  onClearFilter?: () => void;
}

const CheckboxFilter = ({ 
  title, 
  items, 
  selectedItems, 
  onItemChange,
  accordionValue,
  hideSearch = false,
  onClearFilter
}: CheckboxFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCount = selectedItems.length;
  
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const normalizedQuery = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(normalizedQuery)
    );
  }, [items, searchQuery]);

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClearFilter) {
      onClearFilter();
    }
  };
  
  return (
    <AccordionItem value={accordionValue} className="border rounded-md bg-background shadow-sm">
      <div className="flex items-center justify-between w-full px-3 py-2">
        <AccordionTrigger className="hover:no-underline min-h-10 flex-1">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              {title}
            </span>
            {selectedCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs mr-2">
                {selectedCount}
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        {selectedCount > 0 && onClearFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearClick}
            className="h-7 w-7 p-0 hover:bg-muted"
            title={`Rensa ${title.toLowerCase()}`}
          >
            <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>
      <AccordionContent className="px-3 pb-3 border-t pt-3 bg-background">
        {!hideSearch && items.length > 6 && (
          <div className="mb-3 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={`Sök ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm pl-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
        <div className="space-y-1">
          {filteredItems.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 text-center bg-muted/30 rounded-md">
              Inga matchande {title.toLowerCase()} hittades
            </div>
          ) : (
            filteredItems.map((item) => (
              <div 
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-muted/30" 
                key={item.id}
              >
                <Checkbox 
                  id={`${accordionValue}-${item.id}`} 
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => 
                    onItemChange(item.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`${accordionValue}-${item.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {item.name}
                </Label>
                {item.count !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {item.count}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CheckboxFilter;
