
import { useState, useEffect } from "react";
import { sv } from "date-fns/locale";
import { format } from "date-fns";
import { X } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type DateRangeValue = {
  from?: Date;
  to?: Date;
};

interface DateRangeFilterProps {
  dateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  hasActiveFilter?: boolean;
}

const DateRangeFilter = ({ dateRange, onDateRangeChange, hasActiveFilter = false }: DateRangeFilterProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(dateRange?.to);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  
  useEffect(() => {
    setFromDate(dateRange?.from);
    setToDate(dateRange?.to);
  }, [dateRange]);
  
  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date);
    updateDateRange(date, toDate);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date);
    updateDateRange(fromDate, date);
  };
  
  const updateDateRange = (from: Date | undefined, to: Date | undefined) => {
    if (!from && !to) {
      onDateRangeChange(undefined);
      return;
    }
    
    onDateRangeChange({ from, to });
  };

  const formatDate = (date?: Date): string => {
    if (!date) return "";
    return format(date, "d MMM yyyy", { locale: sv });
  };

  const clearDateRange = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateRangeChange(undefined);
    setFromDateOpen(false);
    setToDateOpen(false);
  };

  const activeFilterCount = (dateRange?.from ? 1 : 0) + (dateRange?.to ? 1 : 0);

  return (
    <AccordionItem value="date-range" defaultValue="date-range" className="border-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Datum
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-date">Från</Label>
              <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="from-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    {fromDate ? formatDate(fromDate) : "Välj datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromDateSelect}
                    locale={sv}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-date">Till</Label>
              <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="to-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    {toDate ? formatDate(toDate) : "Välj datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={handleToDateSelect}
                    locale={sv}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {hasActiveFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearDateRange}
              className="w-full text-sm justify-center"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Rensa datumval
            </Button>
          )}
        </div>
      </AccordionContent>
      <Separator className="mt-2" />
    </AccordionItem>
  );
};

export default DateRangeFilter;
