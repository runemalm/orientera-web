
import { useState, useMemo } from "react";
import { format, addDays, isEqual, isBefore, isValid, endOfYear, endOfWeek, endOfMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SelectSeparator } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type DateRangeValue = {
  from: Date;
  to?: Date;
};

type QuickOptionType = {
  label: string;
  value: () => DateRangeValue | undefined;
};

interface DateRangeFilterProps {
  dateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
}

const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState<DateRangeValue | undefined>(dateRange);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const quickOptions: QuickOptionType[] = useMemo(() => [
    {
      label: "Alla",
      value: () => undefined
    },
    {
      label: "Idag",
      value: () => ({
        from: today,
        to: today
      })
    },
    {
      label: "Denna vecka",
      value: () => ({
        from: today,
        to: endOfWeek(today, { locale: sv })
      })
    },
    {
      label: "30 dagar",
      value: () => ({
        from: today,
        to: addDays(today, 30)
      })
    }
  ], [today]);

  const isDateRangeSelected = useMemo(() => {
    return !!dateRange?.from;
  }, [dateRange]);

  const isQuickOptionActive = (option: QuickOptionType): boolean => {
    // For "Alla" option
    if (option.label === "Alla" && !dateRange?.from) {
      return true;
    }
    
    if (!dateRange?.from) return false;
    
    const optionRange = option.value();
    
    if (!optionRange) return false;
    
    return isEqual(optionRange.from, dateRange.from) && 
           ((optionRange.to && dateRange.to && isEqual(optionRange.to, dateRange.to)) || 
           (!optionRange.to && !dateRange.to));
  };

  const handleQuickOptionSelect = (option: QuickOptionType) => {
    const newRange = option.value();
    setLocalDateRange(newRange);
    onDateRangeChange(newRange);
    setIsCalendarOpen(false);
  };

  const handleApplyDateRange = () => {
    if (localDateRange?.from) {
      onDateRangeChange(localDateRange);
      setIsCalendarOpen(false);
    }
  };

  const handleClearDateRange = () => {
    setLocalDateRange(undefined);
    onDateRangeChange(undefined);
    setIsCalendarOpen(false);
  };

  const formatDateRange = (range?: DateRangeValue): string => {
    if (!range?.from) return "Välj datum";
    
    const fromFormatted = format(range.from, "d MMM yyyy", { locale: sv });
    
    if (!range.to) {
      return `Från ${fromFormatted}`;
    }
    
    if (isEqual(range.from, range.to)) {
      return fromFormatted;
    }
    
    const toFormatted = format(range.to, "d MMM yyyy", { locale: sv });
    return `${fromFormatted} - ${toFormatted}`;
  };

  return (
    <AccordionItem value="date-range">
      <AccordionTrigger className="py-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>Datum</span>
          {isDateRangeSelected && (
            <Badge variant="secondary" className="ml-2">
              {formatDateRange(dateRange)}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-3 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option, index) => (
              <Button
                key={index}
                size="sm"
                variant={isQuickOptionActive(option) ? "default" : "outline"}
                className="text-xs w-full"
                onClick={() => handleQuickOptionSelect(option)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <SelectSeparator className="my-2" />
          
          <div>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isDateRangeSelected ? "Anpassat datumintervall" : "Välj datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={localDateRange}
                  onSelect={setLocalDateRange}
                  defaultMonth={localDateRange?.from || new Date()}
                  numberOfMonths={2}
                  disabled={(date) => isBefore(date, new Date()) && !isEqual(date, new Date())}
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="flex items-center gap-2 p-3 border-t">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleApplyDateRange}
                    disabled={!localDateRange?.from}
                  >
                    Tillämpa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={handleClearDateRange}
                    disabled={!isDateRangeSelected}
                  >
                    Rensa
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DateRangeFilter;
