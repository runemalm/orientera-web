
import { useState, useEffect } from "react";
import { sv } from "date-fns/locale";
import { format, isValid, isToday, isYesterday, isTomorrow, addDays, startOfMonth, endOfMonth } from "date-fns";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type DateRangeValue = {
  from?: Date;
  to?: Date;
};

interface DateRangeFilterProps {
  dateRange?: DateRangeValue;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  hasActiveFilter?: boolean;
  removeHeader?: boolean;
}

const PRESET_OPTIONS = [
  { id: 'today', label: 'Idag' },
  { id: 'tomorrow', label: 'Imorgon' },
  { id: 'thisWeekend', label: 'Helgen' },
  { id: 'next7days', label: 'Kommande 7 dagar' },
  { id: 'next30days', label: 'Kommande 30 dagar' },
  { id: 'thisMonth', label: 'Denna månad' },
  { id: 'nextMonth', label: 'Nästa månad' },
];

const DateRangeFilter = ({ 
  dateRange, 
  onDateRangeChange, 
  hasActiveFilter = false,
  removeHeader = false
}: DateRangeFilterProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(dateRange?.to);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    setFromDate(dateRange?.from);
    setToDate(dateRange?.to);
    
    // Check if the current date range matches any preset
    if (dateRange?.from) {
      checkAndSetPreset(dateRange.from, dateRange.to);
    } else {
      setSelectedPreset(undefined);
    }
  }, [dateRange]);
  
  const checkAndSetPreset = (from: Date, to?: Date) => {
    // Check if the current range matches any preset
    const today = new Date();
    
    if (isToday(from) && (!to || isToday(to))) {
      setSelectedPreset('today');
      return;
    }
    
    if (isTomorrow(from) && (!to || isTomorrow(to))) {
      setSelectedPreset('tomorrow');
      return;
    }
    
    // Check for this weekend
    const fridayOfWeek = addDays(today, (5 - today.getDay() + 7) % 7);
    const sundayOfWeek = addDays(fridayOfWeek, 2);
    
    if (from.getTime() === fridayOfWeek.getTime() && 
        to && to.getTime() === sundayOfWeek.getTime()) {
      setSelectedPreset('thisWeekend');
      return;
    }
    
    // Check for next 7 days
    const next7Days = addDays(today, 6);
    if (isToday(from) && to && to.getTime() === next7Days.getTime()) {
      setSelectedPreset('next7days');
      return;
    }
    
    // Check for next 30 days
    const next30Days = addDays(today, 29);
    if (isToday(from) && to && to.getTime() === next30Days.getTime()) {
      setSelectedPreset('next30days');
      return;
    }
    
    // Check for this month
    const thisMonthStart = startOfMonth(today);
    const thisMonthEnd = endOfMonth(today);
    if (from.getTime() === thisMonthStart.getTime() && 
        to && to.getTime() === thisMonthEnd.getTime()) {
      setSelectedPreset('thisMonth');
      return;
    }
    
    // Check for next month
    const nextMonthStart = startOfMonth(addDays(thisMonthEnd, 1));
    const nextMonthEnd = endOfMonth(nextMonthStart);
    if (from.getTime() === nextMonthStart.getTime() && 
        to && to.getTime() === nextMonthEnd.getTime()) {
      setSelectedPreset('nextMonth');
      return;
    }
    
    setSelectedPreset(undefined);
  };
  
  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date);
    updateDateRange(date, toDate);
    setSelectedPreset(undefined);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date);
    updateDateRange(fromDate, date);
    setSelectedPreset(undefined);
  };
  
  const updateDateRange = (from: Date | undefined, to: Date | undefined) => {
    if (!from && !to) {
      onDateRangeChange(undefined);
      return;
    }
    
    onDateRangeChange({ from, to });
  };

  const formatDate = (date?: Date): string => {
    if (!date || !isValid(date)) return "";
    
    if (isToday(date)) return "Idag";
    if (isYesterday(date)) return "Igår";
    if (isTomorrow(date)) return "Imorgon";
    
    return format(date, "d MMM yyyy", { locale: sv });
  };

  const clearDateRange = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateRangeChange(undefined);
    setFromDateOpen(false);
    setToDateOpen(false);
    setSelectedPreset(undefined);
  };
  
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;
    
    switch (value) {
      case 'today':
        from = today;
        to = today;
        break;
        
      case 'tomorrow':
        from = addDays(today, 1);
        to = from;
        break;
        
      case 'thisWeekend':
        // Calculate the coming weekend (Fri-Sun)
        from = addDays(today, (5 - today.getDay() + 7) % 7); // Next Friday
        to = addDays(from, 2); // Sunday
        break;
        
      case 'next7days':
        from = today;
        to = addDays(today, 6);
        break;
        
      case 'next30days':
        from = today;
        to = addDays(today, 29);
        break;
        
      case 'thisMonth':
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
        
      case 'nextMonth':
        from = startOfMonth(addDays(endOfMonth(today), 1));
        to = endOfMonth(from);
        break;
    }
    
    setFromDate(from);
    setToDate(to);
    updateDateRange(from, to);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {PRESET_OPTIONS.map(option => (
            <Button
              key={option.id}
              type="button"
              variant={selectedPreset === option.id ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => handlePresetChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="text-center text-sm">
          eller
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="from-date" className="text-xs">Från</Label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="from-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-sm h-9",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? formatDate(fromDate) : "Välj datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    handleFromDateSelect(date);
                    setFromDateOpen(false);
                  }}
                  locale={sv}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="to-date" className="text-xs">Till</Label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="to-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-sm h-9",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? formatDate(toDate) : "Välj datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    handleToDateSelect(date);
                    setToDateOpen(false);
                  }}
                  locale={sv}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => fromDate ? date < fromDate : date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {hasActiveFilter && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearDateRange}
          className="w-full text-sm justify-center h-8"
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Rensa datumval
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
