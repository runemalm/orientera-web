
import { useMemo } from "react";
import { addDays } from "date-fns";
import { sv } from "date-fns/locale";
import { format } from "date-fns";
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
  
  const periods = useMemo(() => [
    {
      label: "Alla datum",
      value: undefined
    },
    {
      label: "Nästa 7 dagar",
      value: {
        from: today,
        to: addDays(today, 7)
      }
    },
    {
      label: "Nästa 30 dagar",
      value: {
        from: today,
        to: addDays(today, 30)
      }
    },
    {
      label: "Nästa 3 månader",
      value: {
        from: today,
        to: addDays(today, 90)
      }
    }
  ], [today]);

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
          {dateRange && (
            <Badge variant="secondary" className="ml-2">
              {formatDateRange(dateRange)}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {periods.map((period, index) => (
            <Button
              key={index}
              size="sm"
              variant={
                !dateRange && period.value === undefined
                  ? "default"
                  : dateRange && period.value && 
                    dateRange.from.getTime() === period.value.from.getTime() && 
                    (!dateRange.to || !period.value.to || dateRange.to.getTime() === period.value.to.getTime())
                    ? "default"
                    : "outline"
              }
              className="w-full"
              onClick={() => onDateRangeChange(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DateRangeFilter;
