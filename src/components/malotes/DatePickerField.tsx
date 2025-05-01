
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  name: string;
  value: string;
  onChange: (date: string) => void;
}

export const DatePickerField = ({ name, value, onChange }: DatePickerFieldProps) => {
  const getDateValue = () => {
    try {
      if (!value) return undefined;
      
      if (value.includes("T")) {
        return new Date(value);
      }
      
      return parse(value, "dd/MM/yyyy", new Date());
    } catch (error) {
      return undefined;
    }
  };
  
  const [date, setDate] = useState<Date | undefined>(getDateValue());
  
  useEffect(() => {
    setDate(getDateValue());
  }, [value]);
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const formattedDate = format(newDate, "dd/MM/yyyy");
      onChange(formattedDate);
    }
  };
  
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
