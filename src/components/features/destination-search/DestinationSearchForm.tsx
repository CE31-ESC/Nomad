
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { format, addDays, differenceInDays, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_DESTINATIONS } from "@/lib/constants";
import type { Destination, SearchParams } from "@/types";
import { GuestRoomSelector } from "./GuestRoomSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

const searchFormSchema = z.object({
  destinationQuery: z.string().min(1, "Please enter a destination"),
  destinationId: z.string().optional(),
  dates: z.object({
    from: z.date({ required_error: "Check-in date is required." }),
    to: z.date({ required_error: "Check-out date is required." }),
  }).refine(data => data.from < data.to, {
    message: "Check-out date must be after check-in date.",
    path: ["to"],
  }).refine(data => differenceInDays(data.to, data.from) >= 1, {
    message: "Minimum stay is 1 night.",
    path: ["to"],
  }),
  guests: z.number().min(1, "At least 1 guest is required.").max(10, "Max 10 guests."),
  rooms: z.number().min(1, "At least 1 room is required.").max(5, "Max 5 rooms."),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const defaultValues: Partial<SearchFormValues> = {
  destinationQuery: "",
  dates: {
    from: new Date(),
    to: addDays(new Date(), 3),
  },
  guests: 2,
  rooms: 1,
};

export function DestinationSearchForm() {
  const router = useRouter();
  const [suggestedDestinations, setSuggestedDestinations] = React.useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const destinationInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues,
  });

  const handleDestinationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentQueryValue = event.target.value;
    form.setValue("destinationQuery", currentQueryValue);
    form.setValue("destinationId", undefined); // Clear selected ID if typing

    if (currentQueryValue.length > 1) {
      const filtered = MOCK_DESTINATIONS.filter(dest =>
        dest.name.toLowerCase().includes(currentQueryValue.toLowerCase()) ||
        (dest.country && dest.country.toLowerCase().includes(currentQueryValue.toLowerCase()))
      );
      setSuggestedDestinations(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestedDestinations([]);
      setShowSuggestions(false);
    }
  };

  const handleDestinationSelect = (destination: Destination) => {
    form.setValue("destinationQuery", `${destination.name}${destination.country ? `, ${destination.country}` : ''}`);
    form.setValue("destinationId", destination.id);
    setSuggestedDestinations([]);
    setShowSuggestions(false);
    destinationInputRef.current?.focus();
  };
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationInputRef.current && !destinationInputRef.current.contains(event.target as Node) &&
          !document.getElementById('destination-suggestions')?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  function onSubmit(data: SearchFormValues) {
    if (!data.destinationId && suggestedDestinations.length > 0) {
      // If user typed something that matches but didn't select, try to pick first one
      handleDestinationSelect(suggestedDestinations[0]);
      // Re-submit logic might be needed or just let user click search again
      toast({ title: "Destination auto-selected", description: "Please verify and search again if needed."});
      return;
    }
    
    if (!data.destinationId) {
      toast({ variant: "destructive", title: "Invalid Destination", description: "Please select a destination from the suggestions." });
      return;
    }

    const params: SearchParams = {
      destinationId: data.destinationId,
      destinationQuery: data.destinationQuery,
      checkInDate: data.dates.from,
      checkOutDate: data.dates.to,
      guests: data.guests,
      rooms: data.rooms,
    };
    
    const queryParams = new URLSearchParams({
      destinationId: params.destinationId!,
      destinationName: params.destinationQuery!, // Using the query as name for display on next page
      checkIn: format(params.checkInDate!, "yyyy-MM-dd"),
      checkOut: format(params.checkOutDate!, "yyyy-MM-dd"),
      guests: params.guests.toString(),
      rooms: params.rooms.toString(),
    }).toString();

    router.push(`/hotels/search?${queryParams}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 md:p-10 bg-card shadow-xl rounded-xl border max-w-3xl mx-auto">
      <div className="relative">
        <Label htmlFor="destination" className="text-lg font-semibold text-foreground">Where to?</Label>
        <div className="relative mt-2">
           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="destination"
            placeholder="e.g., Paris, Singapore, Tokyo"
            {...form.register("destinationQuery")}
            onChange={handleDestinationChange}
            onFocus={() => {
              const currentQueryValue = form.getValues("destinationQuery");
              if (currentQueryValue && currentQueryValue.length > 1) {
                setShowSuggestions(true);
              }
            }}
            className="h-12 text-base pl-10"
            ref={destinationInputRef}
            autoComplete="off"
            aria-invalid={form.formState.errors.destinationQuery ? "true" : "false"}
          />
        </div>
        {form.formState.errors.destinationQuery && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.destinationQuery.message}</p>
        )}
        {showSuggestions && suggestedDestinations.length > 0 && (
          <div id="destination-suggestions" className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60">
            <ScrollArea className="max-h-60">
              <ul>
                {suggestedDestinations.map(dest => (
                  <li key={dest.id}>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
                      onClick={() => handleDestinationSelect(dest)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{dest.name}{dest.country ? `, ${dest.country}`: ''}</span>
                        {dest.description && <span className="text-xs text-muted-foreground">{dest.description}</span>}
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dates" className="text-lg font-semibold text-foreground">Dates</Label>
          <Controller
            name="dates"
            control={form.control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dates"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 text-base mt-2",
                      !field.value.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                    {field.value.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} -{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card shadow-lg rounded-lg border" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from}
                    selected={{ from: field.value.from, to: field.value.to }}
                    onSelect={(range) => field.onChange(range || { from: undefined, to: undefined })}
                    numberOfMonths={1}
                    fromDate={new Date()}
                    disabled={(date) => date < addDays(new Date(), -1)}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {form.formState.errors.dates?.to && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.dates.to.message}</p>
          )}
           {form.formState.errors.dates?.from && !form.formState.errors.dates?.to && ( // Show 'from' error if 'to' error isn't more specific
            <p className="text-sm text-destructive mt-1">{form.formState.errors.dates.from.message}</p>
          )}
        </div>

        <div>
          <Label className="text-lg font-semibold text-foreground">Guests & Rooms</Label>
          <div className="mt-2">
            <GuestRoomSelector
              guests={form.watch("guests")}
              rooms={form.watch("rooms")}
              onGuestsChange={(val) => form.setValue("guests", val, { shouldValidate: true })}
              onRoomsChange={(val) => form.setValue("rooms", val, { shouldValidate: true })}
            />
          </div>
           {form.formState.errors.guests && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.guests.message}</p>
          )}
           {form.formState.errors.rooms && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.rooms.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full h-14 text-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md" disabled={form.formState.isSubmitting}>
        <Search className="mr-2 h-6 w-6" /> Search Hotels
      </Button>
    </form>
  );
}
