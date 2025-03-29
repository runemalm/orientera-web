
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

interface CheckboxFilterProps {
  title: string;
  items: { id: string; name: string; count?: number }[];
  selectedItems: string[];
  onItemChange: (itemId: string, checked: boolean) => void;
  accordionValue: string;
}

const CheckboxFilter = ({ 
  title, 
  items, 
  selectedItems, 
  onItemChange,
  accordionValue 
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
  
  const clearAllSelected = () => {
    selectedItems.forEach(itemId => {
      onItemChange(itemId, false);
    });
  };
  
  return (
    <AccordionItem value={accordionValue} className="border rounded-md bg-background overflow-hidden">
      <AccordionTrigger className="px-3 py-2 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium">
            {title}
          </span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {selectedCount}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3 border-t pt-3">
        {items.length > 6 && (
          <div className="mb-3">
            <Input
              placeholder="Sök..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        )}
        
        {selectedCount > 0 && (
          <div className="flex justify-end mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllSelected}
              className="h-7 text-xs px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Rensa {title.toLowerCase()}
            </Button>
          </div>
        )}
        
        <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
          {filteredItems.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2 text-center">
              Inga matchande alternativ
            </p>
          ) : (
            filteredItems.map((item) => (
              <div 
                className={`flex items-center gap-2 px-2 py-1.5 rounded-sm ${
                  selectedItems.includes(item.id) ? 'bg-muted/50' : ''
                }`} 
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
