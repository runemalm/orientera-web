
import { useState } from "react";
import { sv } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DateRangeValue = {
  from: Date;
  to?: Date;
};

interface DateRangeFilterProps {
  dateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
}

const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const [date, setDate] = useState<DateRangeValue | undefined>(dateRange);
  
  const handleSelect = (value: DateRangeValue | undefined) => {
    setDate(value);
    
    if (value?.from) {
      // If a complete range is selected (both from and to dates), update the parent component
      if (!value.to || value.from.getTime() <= value.to.getTime()) {
        onDateRangeChange(value);
      }
    } else {
      // If selection is cleared
      onDateRangeChange(undefined);
    }
  };

  const formatDateRange = (range?: DateRangeValue): string => {
    if (!range?.from) return "";
    
    const fromFormatted = format(range.from, "d MMM yyyy", { locale: sv });
    
    if (!range.to) {
      return `Från ${fromFormatted}`;
    }
    
    const toFormatted = format(range.to, "d MMM yyyy", { locale: sv });
    return `${fromFormatted} - ${toFormatted}`;
  };

  const clearDateRange = () => {
    setDate(undefined);
    onDateRangeChange(undefined);
  };

  return (
    <AccordionItem value="date-range">
      <AccordionTrigger className="py-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          <span>Datum</span>
          {dateRange && (
            <Badge variant="secondary" className="ml-2">
              {formatDateRange(dateRange)}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {date ? formatDateRange(date) : <span>Välj datumperiod</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={handleSelect}
                locale={sv}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {dateRange && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearDateRange} 
              className="mt-2 w-full"
            >
              Rensa datumfilter
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DateRangeFilter;
