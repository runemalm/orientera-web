import { useState, useEffect } from "react";
import { sv } from "date-fns/locale";
import { format, isValid, isToday, isYesterday, isTomorrow, addDays, startOfMonth, endOfMonth, isSameDay, nextFriday, nextSunday, getDay, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toggle } from "@/components/ui/toggle";

type DateRangeValue = {
  from?: Date;
  to?: Date;
  presetId?: string;
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
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(dateRange?.presetId);
  const [lastClickedPreset, setLastClickedPreset] = useState<string | undefined>(dateRange?.presetId);
  
  const PRESET_OPTIONS = [
    { id: 'today', label: 'Idag', priority: 1 },
    { id: 'tomorrow', label: 'Imorgon', priority: 2 },
    { id: 'thisWeekend', label: 'Helgen', priority: 3 },
    { id: 'next7days', label: 'Kommande 7 dgr', priority: 4 },
    { id: 'next30days', label: 'Kommande 30 dgr', priority: 5 },
    { id: 'thisMonth', label: 'Denna månad', priority: 6 },
    { id: 'nextMonth', label: 'Nästa månad', priority: 7 },
  ];
  
  useEffect(() => {
    setFromDate(dateRange?.from);
    setToDate(dateRange?.to);
    setSelectedPreset(dateRange?.presetId);
    
    if (!dateRange || (!dateRange.from && !dateRange.to)) {
      setSelectedPreset(undefined);
      setLastClickedPreset(undefined);
      return;
    }
    
    if (dateRange?.from && !dateRange.presetId) {
      // Only check for matching presets if no preset was clicked directly
      if (!lastClickedPreset) {
        const detectedPreset = checkAndSetPreset(dateRange.from, dateRange.to);
        setSelectedPreset(detectedPreset);
      }
    }
  }, [dateRange, lastClickedPreset]);
  
  const checkAndSetPreset = (from: Date, to?: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const datesMatch = (date1: Date | undefined, date2: Date | undefined): boolean => {
      if (!date1 && !date2) return true;
      if (!date1 || !date2) return false;
      return isSameDay(date1, date2);
    };
    
    const matchingPresets: string[] = [];
    
    for (const preset of PRESET_OPTIONS) {
      const presetRange = getPresetDateRange(preset.id);
      if (datesMatch(from, presetRange.from) && datesMatch(to, presetRange.to)) {
        matchingPresets.push(preset.id);
      }
    }
    
    if (matchingPresets.length === 0) {
      return undefined;
    }
    
    if (matchingPresets.length > 1) {
      let highestPriorityPreset = matchingPresets[0];
      let highestPriority = PRESET_OPTIONS.find(p => p.id === highestPriorityPreset)?.priority || 999;
      
      for (const presetId of matchingPresets) {
        const currentPriority = PRESET_OPTIONS.find(p => p.id === presetId)?.priority || 999;
        if (currentPriority < highestPriority) {
          highestPriority = currentPriority;
          highestPriorityPreset = presetId;
        }
      }
      
      return highestPriorityPreset;
    }
    
    return matchingPresets[0];
  };
  
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
    
    return { from, to, presetId };
  };
  
  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date);
    updateDateRange(date, toDate);
    setSelectedPreset(undefined);
    setLastClickedPreset(undefined);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date);
    updateDateRange(fromDate, date);
    setSelectedPreset(undefined);
    setLastClickedPreset(undefined);
  };
  
  const updateDateRange = (from: Date | undefined, to: Date | undefined, presetId?: string) => {
    if (!from && !to) {
      onDateRangeChange(undefined);
      return;
    }
    
    onDateRangeChange({ from, to, presetId });
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
    setLastClickedPreset(undefined);
    
    if (onClearFilter) {
      onClearFilter();
    }
  };
  
  const handlePresetChange = (value: string) => {
    if (selectedPreset === value) {
      setSelectedPreset(undefined);
      setLastClickedPreset(undefined);
      clearDateRange();
      return;
    }
    
    setSelectedPreset(value);
    setLastClickedPreset(value); // Track which preset was clicked directly
    const dateRange = getPresetDateRange(value);
    
    setFromDate(dateRange.from);
    setToDate(dateRange.to);
    updateDateRange(dateRange.from, dateRange.to, value);
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
  );
};

export default DateRangeFilter;
