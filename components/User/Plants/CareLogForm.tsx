"use client";

import { useState } from "react";
import { CareLogEntry } from "@/types/garden";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface CareLogFormProps {
  plantId: string;
  onSave: (log: CareLogEntry) => void;
  onCancel: () => void;
}

const CareLogForm = ({ onSave, onCancel }: CareLogFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<
    "water" | "fertilize" | "prune" | "treatment"
  >("water");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      return;
    }

    const careLog: CareLogEntry = {
      date,
      type,
      notes,
      images: [],
    };

    onSave(careLog);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="care-type">Care Type</Label>
        <Select
          value={type}
          onValueChange={(value) =>
            setType(value as "water" | "fertilize" | "prune" | "treatment")
          }
        >
          <SelectTrigger id="care-type">
            <SelectValue placeholder="Select care type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="fertilize">Fertilize</SelectItem>
            <SelectItem value="prune">Prune</SelectItem>
            <SelectItem value="treatment">Treatment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="care-date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="care-date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter care notes here..."
          className="min-h-[120px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!notes.trim()}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default CareLogForm;
