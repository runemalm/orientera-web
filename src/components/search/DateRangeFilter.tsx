
import { useState, useMemo } from "react";
import { format, addDays, endOfWeek, endOfMonth } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type DateRangeValue = {
  from: Date;
  to?: Date;
};

interface DateRangeFilterProps {
  dateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
}

const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const quickOptions = useMemo(() => [
    {
      label: "Alla",
      value: () => undefined
    },
    {
      label: "7 dagar",
      value: () => ({
        from: today,
        to: addDays(today, 7)
      })
    },
    {
      label: "30 dagar",
      value: () => ({
        from: today,
        to: addDays(today, 30)
      })
    },
    {
      label: "3 månader",
      value: () => ({
        from: today,
        to: addDays(today, 90)
      })
    }
  ], [today]);

  const isDateRangeSelected = useMemo(() => {
    return !!dateRange?.from;
  }, [dateRange]);

  const handleQuickOptionSelect = (option: any) => {
    const newRange = option.value();
    onDateRangeChange(newRange);
  };

  const formatDateRange = (range?: DateRangeValue): string => {
    if (!range?.from) return "";
    
    const fromFormatted = format(range.from, "d MMM", { locale: sv });
    
    if (!range.to) {
      return `Från ${fromFormatted}`;
    }
    
    const toFormatted = format(range.to, "d MMM", { locale: sv });
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
        <div className="grid grid-cols-4 gap-2 pt-2">
          {quickOptions.map((option, index) => (
            <Button
              key={index}
              size="sm"
              variant={dateRange === option.value() ? "default" : "outline"}
              className="w-full"
              onClick={() => handleQuickOptionSelect(option)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DateRangeFilter;
