
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
import { Toggle } from "@/components/ui/toggle";

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
    { id: 'next7days', label: 'Kommande 7 dgr' },
    { id: 'next30days', label: 'Kommande 30 dgr' },
    { id: 'thisMonth', label: 'Denna månad' },
    { id: 'nextMonth', label: 'Nästa månad' },
  ];
  
  useEffect(() => {
    setFromDate(dateRange?.from);
    setToDate(dateRange?.to);
    
    // Only try to match a preset if we don't already have one selected
    // or if the dates have changed from outside this component
    if (dateRange?.from && !selectedPreset) {
      const detectedPreset = checkAndSetPreset(dateRange.from, dateRange.to);
      setSelectedPreset(detectedPreset);
    }
  }, [dateRange]);
  
  const checkAndSetPreset = (from: Date, to?: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Helper function to compare dates for preset matching
    const datesMatch = (date1: Date | undefined, date2: Date | undefined): boolean => {
      if (!date1 && !date2) return true;
      if (!date1 || !date2) return false;
      return isSameDay(date1, date2);
    };
    
    // We'll match but not set a preset here - this is just for detection
    for (const preset of PRESET_OPTIONS) {
      const presetRange = getPresetDateRange(preset.id);
      if (datesMatch(from, presetRange.from) && datesMatch(to, presetRange.to)) {
        return preset.id;
      }
    }
    
    return undefined;
  };
  
  // Get date range for a specific preset
  const getPresetDateRange = (presetId: string): DateRangeValue => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let from: Date | undefined;
    let to: Date | undefined;
    
    switch (presetId) {
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
        to = addDays(today, 7);
        break;
        
      case 'next30days':
        from = addDays(today, 1);
        to = addDays(today, 30);
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
    
    return { from, to };
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
    if (selectedPreset === value) {
      setSelectedPreset(undefined);
      clearDateRange();
      return;
    }
    
    setSelectedPreset(value);
    const dateRange = getPresetDateRange(value);
    
    setFromDate(dateRange.from);
    setToDate(dateRange.to);
    updateDateRange(dateRange.from, dateRange.to);
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
            <Toggle
              key={option.id}
              pressed={selectedPreset === option.id}
              onPressedChange={() => handlePresetChange(option.id)}
              variant="outline"
              className={cn(
                "text-xs h-7 w-full px-2 truncate border-input hover:bg-muted/60",
                selectedPreset === option.id && 
                "bg-orienteering-green hover:bg-orienteering-green/90 text-white border-orienteering-green data-[state=on]:bg-orienteering-green data-[state=on]:text-white data-[state=on]:border-orienteering-green"
              )}
            >
              {option.label}
            </Toggle>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_OPTIONS.slice(3, 5).map(option => (
            <Toggle
              key={option.id}
              pressed={selectedPreset === option.id}
              onPressedChange={() => handlePresetChange(option.id)}
              variant="outline"
              className={cn(
                "text-xs h-7 w-full px-2 truncate border-input hover:bg-muted/60",
                selectedPreset === option.id && 
                "bg-orienteering-green hover:bg-orienteering-green/90 text-white border-orienteering-green data-[state=on]:bg-orienteering-green data-[state=on]:text-white data-[state=on]:border-orienteering-green"
              )}
            >
              {option.label}
            </Toggle>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_OPTIONS.slice(5, 7).map(option => (
            <Toggle
              key={option.id}
              pressed={selectedPreset === option.id}
              onPressedChange={() => handlePresetChange(option.id)}
              variant="outline"
              className={cn(
                "text-xs h-7 w-full px-2 truncate border-input hover:bg-muted/60",
                selectedPreset === option.id && 
                "bg-orienteering-green hover:bg-orienteering-green/90 text-white border-orienteering-green data-[state=on]:bg-orienteering-green data-[state=on]:text-white data-[state=on]:border-orienteering-green"
              )}
            >
              {option.label}
            </Toggle>
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
                  !fromDate && !toDate && "text-muted-foreground",
                  (fromDate || toDate) && "border-orienteering-green focus:ring-orienteering-green"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
                {(fromDate || toDate) && (
                  <X 
                    className="ml-auto h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
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
