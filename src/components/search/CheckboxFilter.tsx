
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface CheckboxFilterProps {
  title: string;
  items: { id: string; name: string }[];
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
  return (
    <AccordionItem value={accordionValue} className="border-b-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div className="flex items-center space-x-2" key={item.id}>
              <Checkbox 
                id={`${accordionValue}-${item.id}`} 
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) => 
                  onItemChange(item.id, checked as boolean)
                }
              />
              <Label 
                htmlFor={`${accordionValue}-${item.id}`}
                className="text-sm cursor-pointer"
              >
                {item.name}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CheckboxFilter;
