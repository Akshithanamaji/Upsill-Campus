'use client';

import { useState } from 'react';
import { Search, Filter, Calendar as CalendarIcon, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  junctions: any[];
}

export function FilterBar({ onFilterChange, junctions }: FilterBarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('all');
  const [level, setLevel] = useState<string>('all');
  const [selectedJunction, setSelectedJunction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApply = () => {
    onFilterChange({
      date,
      time,
      level,
      junctionId: selectedJunction === 'all' ? null : parseInt(selectedJunction),
      searchQuery
    });
  };

  const handleReset = () => {
    setDate(new Date());
    setTime('all');
    setLevel('all');
    setSelectedJunction('all');
    setSearchQuery('');
    onFilterChange({
      date: new Date(),
      time: 'all',
      level: 'all',
      junctionId: null,
      searchQuery: ''
    });
  };

  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-4 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search junction name..." 
            className="pl-9 bg-background border-sidebar-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Junction Select */}
        <div className="w-[200px]">
          <Select value={selectedJunction} onValueChange={setSelectedJunction}>
            <SelectTrigger className="bg-background border-sidebar-border">
              <SelectValue placeholder="All Junctions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Junctions</SelectItem>
              {junctions.map((j) => (
                <SelectItem key={j.id} value={j.id.toString()}>
                  {j.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Traffic Level */}
        <div className="w-[140px]">
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="bg-background border-sidebar-border">
              <SelectValue placeholder="Traffic Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Select */}
        <div className="w-[140px]">
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="bg-background border-sidebar-border">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Times</SelectItem>
              <SelectItem value="08:00">Morning Peak</SelectItem>
              <SelectItem value="13:00">Midday</SelectItem>
              <SelectItem value="18:00">Evening Peak</SelectItem>
              <SelectItem value="22:00">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[180px] justify-start text-left font-normal bg-background border-sidebar-border ${!date && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Apply/Reset */}
        <div className="flex items-center gap-2">
          <Button onClick={handleApply} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Apply Filters
          </Button>
          <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
