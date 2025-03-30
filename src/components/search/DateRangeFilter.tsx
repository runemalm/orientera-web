import { useState, useEffect } from "react";
import { sv } from "date-fns/locale";
import { format, isValid, isToday, isYesterday, isTomorrow, addDays, startOfMonth, endOfMonth, isSameDay, nextFriday, nextSunday, getDay, subDays } from "date-fns";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

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

const DateRangeFilter = ({ 
  dateRange, 
  onDateRangeChange, 
  hasActiveFilter = false,
  removeHeader = false
}: DateRangeFilterProps) => {
  const isMobile = useIsMobile();
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(dateRange?.to);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
  
  // Generate preset options with responsive labels
  const PRESET_OPTIONS = [
    { id: 'today', label: 'Idag' },
    { id: 'tomorrow', label: 'Imorgon' },
    { id: 'thisWeekend', label: 'Helgen' },
    { id: 'next7days', label: isMobile ? 'Kommande 7 dgr' : 'Kommande 7 dagar' },
    { id: 'next30days', label: isMobile ? 'Kommande 30 dgr' : 'Kommande 30 dagar' },
    { id: 'thisMonth', label: 'Denna månad' },
    { id: 'nextMonth', label: 'Nästa månad' },
  ];
  
  useEffect(() => {
    setFromDate(dateRange?.from);
    setToDate(dateRange?.to);
    
    if (dateRange?.from) {
      checkAndSetPreset(dateRange.from, dateRange.to);
    } else {
      setSelectedPreset(undefined);
    }
  }, [dateRange]);
  
  const checkAndSetPreset = (from: Date, to?: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isMatchingPreset = (presetId: string): boolean => {
      let presetFrom: Date | undefined;
      let presetTo: Date | undefined;
      
      switch (presetId) {
        case 'today':
          presetFrom = today;
          presetTo = today;
          break;
          
        case 'tomorrow':
          presetFrom = addDays(today, 1);
          presetTo = addDays(today, 1);
          break;
          
        case 'thisWeekend':
          const dayOfWeek = getDay(today);
          
          if (dayOfWeek === 0) { // Sunday
            presetFrom = subDays(today, 2); // Friday
            presetTo = today; // Sunday
          } else if (dayOfWeek === 6) { // Saturday
            presetFrom = subDays(today, 1); // Friday
            presetTo = addDays(today, 1); // Sunday
          } else if (dayOfWeek === 5) { // Friday
            presetFrom = today; // Friday
            presetTo = addDays(today, 2); // Sunday
          } else {
            const daysUntilFriday = 5 - dayOfWeek;
            presetFrom = addDays(today, daysUntilFriday);
            presetTo = addDays(presetFrom, 2);
          }
          break;
          
        case 'next7days':
          presetFrom = today;
          const dayOfWeek7 = getDay(today);
          
          if (dayOfWeek7 === 5) { // Friday
            presetTo = addDays(today, 9);
          } else if (dayOfWeek7 === 6) { // Saturday
            presetTo = addDays(today, 8);
          } else {
            presetTo = addDays(today, 7);
          }
          break;
          
        case 'next30days':
          presetFrom = today;
          presetTo = addDays(today, 29);
          break;
          
        case 'thisMonth':
          presetFrom = startOfMonth(today);
          presetTo = endOfMonth(today);
          break;
          
        case 'nextMonth':
          presetFrom = startOfMonth(addDays(endOfMonth(today), 1));
          presetTo = endOfMonth(presetFrom);
          break;
          
        default:
          return false;
      }
      
      const fromMatches = presetFrom && from && isSameDay(from, presetFrom);
      const toMatches = 
        (presetTo && to && isSameDay(to, presetTo)) || 
        (!presetTo && !to);
        
      return fromMatches && toMatches;
    };
    
    for (const preset of PRESET_OPTIONS) {
      if (isMatchingPreset(preset.id)) {
        setSelectedPreset(preset.id);
        return;
      }
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
    today.setHours(0, 0, 0, 0);
    
    let from: Date | undefined;
    let to: Date | undefined;
    
    switch (value) {
      case 'today':
        from = new Date(today);
        to = from;
        break;
        
      case 'tomorrow':
        from = addDays(today, 1);
        to = from;
        break;
        
      case 'thisWeekend':
        const dayOfWeek = getDay(today);
        
        if (dayOfWeek === 0) { // Sunday
          from = subDays(today, 2);
          to = today;
        } else if (dayOfWeek === 6) { // Saturday
          from = subDays(today, 1);
          to = addDays(today, 1);
        } else if (dayOfWeek === 5) { // Friday
          from = today;
          to = addDays(today, 2);
        } else {
          const daysUntilFriday = 5 - dayOfWeek;
          from = addDays(today, daysUntilFriday);
          to = addDays(from, 2);
        }
        break;
        
      case 'next7days':
        from = new Date(today);
        const dayOfWeek7 = getDay(today);
        
        if (dayOfWeek7 === 5) { // Friday
          to = addDays(today, 9);
        } else if (dayOfWeek7 === 6) { // Saturday
          to = addDays(today, 8);
        } else {
          to = addDays(today, 7);
        }
        break;
        
      case 'next30days':
        from = new Date(today);
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
        <div className="grid grid-cols-3 gap-1.5">
          {PRESET_OPTIONS.slice(0, 3).map(option => (
            <Button
              key={option.id}
              type="button"
              variant={selectedPreset === option.id ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 w-full px-2 truncate"
              onClick={() => handlePresetChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_OPTIONS.slice(3, 5).map(option => (
            <Button
              key={option.id}
              type="button"
              variant={selectedPreset === option.id ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 w-full px-2 truncate"
              onClick={() => handlePresetChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_OPTIONS.slice(5, 7).map(option => (
            <Button
              key={option.id}
              type="button"
              variant={selectedPreset === option.id ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 w-full px-2 truncate"
              onClick={() => handlePresetChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
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
    </div>
  );
};

export default DateRangeFilter;
