"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO, addDays } from "date-fns";

import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox }
from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapView } from "@/components/features/hotel-search/MapView"; // To be created
import type { Hotel, HotelFiltersType, HotelSortOptionType, SearchParams as AppSearchParams } from "@/types";
import { MOCK_HOTELS, STAR_RATINGS, GUEST_RATING_THRESHOLDS, PRICE_RANGE_MIN, PRICE_RANGE_MAX, DEFAULT_HOTEL_SORT } from "@/lib/constants";
import { Star, ChevronRight, ListFilter, MapPinIcon, Users, CalendarDays, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

// Mock API call
const fetchHotels = async (params: AppSearchParams): Promise<Hotel[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  let hotels = MOCK_HOTELS;
  if (params.destinationId) {
    hotels = hotels.filter(hotel => hotel.destinationId === params.destinationId);
  }
  // In a real API, date, guests, rooms would filter availability
  // For mock, we just return hotels in the destination
  return hotels.map(h => ({...h, dataAiHint: "hotel building exterior"}));
};


const HotelCard = ({ hotel }: { hotel: Hotel & { dataAiHint?: string} }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
    <div className="md:w-1/3 relative">
      <Image
        src={hotel.images[0]}
        alt={`Exterior of ${hotel.name}`}
        width={400}
        height={300}
        className="object-cover w-full h-48 md:h-full"
        data-ai-hint={hotel.dataAiHint || "hotel building"}
      />
    </div>
    <div className="md:w-2/3 flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-headline text-primary">{hotel.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPinIcon size={14} className="mr-1" /> {hotel.address}
        </div>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < hotel.starRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">({hotel.starRating} Stars)</span>
          {hotel.guestRating && (
            <span className="ml-3 text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {hotel.guestRating.toFixed(1)} Guest Rating
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-foreground/80 line-clamp-2">{hotel.description}</p>
        <div className="mt-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Amenities</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {hotel.amenities.slice(0, 3).map(amenity => (
              <span key={amenity} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{amenity}</span>
            ))}
            {hotel.amenities.length > 3 && <span className="text-xs text-muted-foreground">+{hotel.amenities.length - 3} more</span>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/30">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="text-2xl font-bold text-accent">
            ${hotel.cheapestRoomPrice}
            <span className="text-sm font-normal text-muted-foreground">/night</span>
          </p>
        </div>
        <Link href={`/hotels/${hotel.id}?destinationId=${hotel.destinationId}&checkIn=${format(parseISO(String(new Date().toISOString())), 'yyyy-MM-dd')}&checkOut=${format(addDays(parseISO(String(new Date().toISOString())),2), 'yyyy-MM-dd')}&guests=2&rooms=1`} passHref>
           <Button size="lg" className="font-semibold">
            View Details <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </div>
  </Card>
);

const HotelFilters = ({ filters, onFilterChange }: { filters: HotelFiltersType, onFilterChange: (newFilters: HotelFiltersType) => void}) => {
  const handleStarRatingChange = (rating: number) => {
    const newRatings = filters.starRatings.includes(rating)
      ? filters.starRatings.filter(r => r !== rating)
      : [...filters.starRatings, rating];
    onFilterChange({ ...filters, starRatings: newRatings.sort() });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center"><ListFilter size={20} className="mr-2"/> Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={["starRating", "priceRange", "guestRating"]} className="w-full">
          <AccordionItem value="starRating">
            <AccordionTrigger className="text-base font-semibold">Star Rating</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {STAR_RATINGS.map(rating => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`star-${rating}`}
                    checked={filters.starRatings.includes(rating)}
                    onCheckedChange={() => handleStarRatingChange(rating)}
                  />
                  <Label htmlFor={`star-${rating}`} className="flex items-center cursor-pointer">
                    {Array.from({ length: rating }).map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400 mr-0.5" />)}
                    {Array.from({ length: 5 - rating }).map((_, i) => <Star key={i} size={16} className="text-gray-300 mr-0.5" />)}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="priceRange">
            <AccordionTrigger className="text-base font-semibold">Price Range (per night)</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-2">
              <Slider
                defaultValue={[filters.priceRange.min, filters.priceRange.max]}
                min={PRICE_RANGE_MIN}
                max={PRICE_RANGE_MAX}
                step={10}
                minStepsBetweenThumbs={1}
                onValueCommit={(value) => onFilterChange({ ...filters, priceRange: { min: value[0], max: value[1] }})}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange.min}</span>
                <span>${filters.priceRange.max}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="guestRating">
            <AccordionTrigger className="text-base font-semibold">Guest Rating</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {GUEST_RATING_THRESHOLDS.map(threshold => (
                <div key={threshold.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`guest-rating-${threshold.value}`}
                    checked={filters.guestRatingMin === threshold.value}
                    onCheckedChange={() => onFilterChange({ ...filters, guestRatingMin: threshold.value })}
                  />
                  <Label htmlFor={`guest-rating-${threshold.value}`} className="cursor-pointer">{threshold.label}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};


export default function HotelSearchPage() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = React.useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = React.useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const [filters, setFilters] = React.useState<HotelFiltersType>({
    starRatings: [],
    guestRatingMin: 0,
    priceRange: { min: PRICE_RANGE_MIN, max: PRICE_RANGE_MAX },
  });
  const [sortOption, setSortOption] = React.useState<HotelSortOptionType>(DEFAULT_HOTEL_SORT);

  const destinationName = searchParams.get("destinationName") || "Selected Destination";
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const rooms = searchParams.get("rooms");

  React.useEffect(() => {
    const destinationId = searchParams.get("destinationId");
    if (destinationId && checkIn && checkOut && guests && rooms) {
      setIsLoading(true);
      const params: AppSearchParams = {
        destinationId,
        checkInDate: parseISO(checkIn),
        checkOutDate: parseISO(checkOut),
        guests: parseInt(guests),
        rooms: parseInt(rooms),
      };
      fetchHotels(params).then(data => {
        setHotels(data);
        setIsLoading(false);
      });
    } else {
      // Handle missing params, maybe redirect or show error
      setHotels([]);
      setIsLoading(false);
    }
  }, [searchParams]);

  React.useEffect(() => {
    let processedHotels = [...hotels];

    // Apply filters
    if (filters.starRatings.length > 0) {
      processedHotels = processedHotels.filter(hotel => filters.starRatings.includes(hotel.starRating));
    }
    processedHotels = processedHotels.filter(hotel => (hotel.guestRating || 0) >= filters.guestRatingMin);
    processedHotels = processedHotels.filter(hotel => 
      (hotel.cheapestRoomPrice || 0) >= filters.priceRange.min && 
      (hotel.cheapestRoomPrice || Infinity) <= filters.priceRange.max
    );

    // Apply sorting
    processedHotels.sort((a, b) => {
      let valA, valB;
      switch (sortOption.sortBy) {
        case 'price':
          valA = a.cheapestRoomPrice || 0;
          valB = b.cheapestRoomPrice || 0;
          break;
        case 'starRating':
          valA = a.starRating;
          valB = b.starRating;
          break;
        case 'guestRating':
          valA = a.guestRating || 0;
          valB = b.guestRating || 0;
          break;
        default:
          return 0;
      }
      return sortOption.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredHotels(processedHotels);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [hotels, filters, sortOption]);

  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredHotels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [HotelSortOptionType['sortBy'], HotelSortOptionType['sortOrder']];
    setSortOption({ sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContainer>
        <div className="mb-8 p-4 bg-primary/10 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-primary mb-2">Hotels in {destinationName}</h1>
          {checkIn && checkOut && (
            <p className="text-md text-foreground/80 flex items-center gap-2">
              <CalendarDays size={18}/> {format(parseISO(checkIn), "MMM dd, yyyy")} - {format(parseISO(checkOut), "MMM dd, yyyy")}
              <span className="mx-2">|</span>
              <Users size={18}/> {guests} Guest{parseInt(guests || '1') > 1 ? 's' : ''}, {rooms} Room{parseInt(rooms || '1') > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <HotelFilters filters={filters} onFilterChange={setFilters} />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map View</CardTitle>
              </CardHeader>
              <CardContent>
                 <MapView hotels={filteredHotels.filter(h => h.latitude && h.longitude)} />
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center p-4 bg-card rounded-lg shadow-sm border">
              <p className="text-muted-foreground">{filteredHotels.length} hotels found</p>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-hotels" className="text-sm font-medium">Sort by:</Label>
                 <Select
                    value={`${sortOption.sortBy}-${sortOption.sortOrder}`}
                    onValueChange={handleSortChange}
                  >
                  <SelectTrigger className="w-[180px]" id="sort-hotels">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="starRating-desc">Star Rating: High to Low</SelectItem>
                    <SelectItem value="starRating-asc">Star Rating: Low to High</SelectItem>
                    <SelectItem value="guestRating-desc">Guest Rating: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden shadow-lg flex flex-col md:flex-row">
                  <Skeleton className="md:w-1/3 w-full h-48 md:h-auto" />
                  <div className="md:w-2/3 p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between items-end pt-4">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-10 w-1/3" />
                    </div>
                  </div>
                </Card>
              ))
            ) : paginatedHotels.length > 0 ? (
              paginatedHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)
            ) : (
              <Card className="text-center p-10">
                <CardTitle>No Hotels Found</CardTitle>
                <CardContent>
                  <p className="mt-2 text-muted-foreground">Try adjusting your search criteria or filters.</p>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
}
