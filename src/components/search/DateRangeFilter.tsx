import { useState, useEffect } from "react";
import { sv } from "date-fns/locale";
import { format, isValid, isToday, isYesterday, isTomorrow, addDays, startOfMonth, endOfMonth, isSameDay, nextFriday, nextSunday, getDay, subDays } from "date-fns";
import { X, Calendar as CalendarIcon, XCircle } from "lucide-react";
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
  onClearFilter?: () => void;
}

const DateRangeFilter = ({ 
  dateRange, 
  onDateRangeChange, 
  hasActiveFilter = false,
  removeHeader = false,
  onClearFilter
}: DateRangeFilterProps) => {
  const isMobile = useIsMobile();
  const [fromDate, setFromDate] = useState<Date | undefined>(dateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(dateRange?.to);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
  
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
            presetFrom = subDays(today, 2);
            presetTo = today;
          } else if (dayOfWeek === 6) { // Saturday
            presetFrom = subDays(today, 1);
            presetTo = addDays(today, 1);
          } else if (dayOfWeek === 5) { // Friday
            presetFrom = today;
            presetTo = addDays(today, 2);
          } else {
            const daysUntilFriday = 5 - dayOfWeek;
            presetFrom = addDays(today, daysUntilFriday);
            presetTo = addDays(presetFrom, 2);
          }
          break;
          
        case 'next7days':
          presetFrom = addDays(today, 1);
          const dayOfWeek7 = getDay(today);
          
          if (dayOfWeek7 === 5) { // Friday
            presetTo = addDays(today, 8);
          } else if (dayOfWeek7 === 6) { // Saturday
            presetTo = addDays(today, 7);
          } else {
            presetTo = addDays(today, 6);
          }
          break;
          
        case 'next30days':
          presetFrom = addDays(today, 1);
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
  
  const formatDateRange = (): string => {
    if (!fromDate && !toDate) return "Välj datumintervall";
    
    if (fromDate && toDate && isSameDay(fromDate, toDate)) {
      return formatDate(fromDate);
    }
    
    return `${formatDate(fromDate)} — ${formatDate(toDate) || '...'}`;
  };

  const clearDateRange = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateRangeChange(undefined);
    setCalendarOpen(false);
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
        from = addDays(today, 1);
        const dayOfWeek7 = getDay(today);
        
        if (dayOfWeek7 === 5) { // Friday
          to = addDays(today, 8);
        } else if (dayOfWeek7 === 6) { // Saturday
          to = addDays(today, 7);
        } else {
          to = addDays(from, 6);
        }
        break;
        
      case 'next30days':
        from = addDays(today, 1);
        to = addDays(from, 29);
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
      {!removeHeader && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Tävlingsperiod</h3>
          {hasActiveFilter && onClearFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilter}
              className="h-7 w-7 p-0 hover:bg-muted"
              title="Rensa datumfilter"
            >
              <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>
      )}
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
        
        <div className="space-y-1.5">
          <Label htmlFor="date-range" className="text-xs">Välj intervall</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date-range"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-sm h-9",
                  !fromDate && !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
                {(fromDate || toDate) && (
                  <X 
                    className="ml-auto h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateRange();
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: fromDate, to: toDate }}
                onSelect={(range) => {
                  if (!range) {
                    setFromDate(undefined);
                    setToDate(undefined);
                    updateDateRange(undefined, undefined);
                  } else {
                    setFromDate(range.from);
                    setToDate(range.to);
                    updateDateRange(range.from, range.to);
                  }
                  setSelectedPreset(undefined);
                }}
                locale={sv}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
