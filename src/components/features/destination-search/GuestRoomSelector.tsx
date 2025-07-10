"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MAX_GUESTS, MAX_ROOMS } from "@/lib/constants";
import { MinusCircle, PlusCircle, Users, BedDouble } from "lucide-react";
import * as React from "react";

interface GuestRoomSelectorProps {
  guests: number;
  rooms: number;
  onGuestsChange: (guests: number) => void;
  onRoomsChange: (rooms: number) => void;
}

export function GuestRoomSelector({ guests, rooms, onGuestsChange, onRoomsChange }: GuestRoomSelectorProps) {
  const handleGuestChange = (amount: number) => {
    const newGuests = Math.max(1, Math.min(MAX_GUESTS, guests + amount));
    onGuestsChange(newGuests);
  };

  const handleRoomChange = (amount: number) => {
    const newRooms = Math.max(1, Math.min(MAX_ROOMS, rooms + amount));
    onRoomsChange(newRooms);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal h-12 text-base">
          <Users className="mr-2 h-5 w-5 text-primary" />
          {guests} Guest{guests > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4 bg-card shadow-lg rounded-lg border">
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-sm font-medium text-foreground">Guests</Label>
          <div className="flex items-center justify-between space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleGuestChange(-1)} disabled={guests <= 1} aria-label="Decrease guests">
              <MinusCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Button>
            <Input id="guests" type="number" value={guests} readOnly className="w-16 text-center text-lg font-semibold border-0 focus-visible:ring-0 bg-transparent" aria-live="polite" />
            <Button variant="ghost" size="icon" onClick={() => handleGuestChange(1)} disabled={guests >= MAX_GUESTS} aria-label="Increase guests">
              <PlusCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rooms" className="text-sm font-medium text-foreground">Rooms</Label>
          <div className="flex items-center justify-between space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleRoomChange(-1)} disabled={rooms <= 1} aria-label="Decrease rooms">
              <MinusCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Button>
            <Input id="rooms" type="number" value={rooms} readOnly className="w-16 text-center text-lg font-semibold border-0 focus-visible:ring-0 bg-transparent" aria-live="polite" />
            <Button variant="ghost" size="icon" onClick={() => handleRoomChange(1)} disabled={rooms >= MAX_ROOMS} aria-label="Increase rooms">
              <PlusCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
