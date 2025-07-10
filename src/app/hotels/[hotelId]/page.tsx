
"use client";

import * as React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO, differenceInDays } from "date-fns";

import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/features/hotel-search/MapView";
import type { Hotel, Room, HotelReview, SearchParams as AppSearchParams } from "@/types";
import { MOCK_HOTELS, MOCK_ROOMS, MOCK_REVIEWS } from "@/lib/constants";
import { Star, MapPinIcon, Users, BedDouble, Wifi, Utensils, ParkingCircle, Tv, ChevronRight, MessageSquare, CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Added ScrollBar

// Mock API calls
const fetchHotelDetails = async (hotelId: string): Promise<Hotel | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const hotel = MOCK_HOTELS.find(h => h.id === hotelId);
  if (hotel) {
    const rooms = MOCK_ROOMS.filter(r => r.hotelId === hotelId).map(r => ({...r, dataAiHint: "hotel room interior"}));
    const reviews = MOCK_REVIEWS.filter(r => r.comment.toLowerCase().includes(hotel.name.split(' ')[1].toLowerCase())); // Simple match
    return { ...hotel, rooms, reviews, dataAiHint: "hotel building" };
  }
  return null;
};

const RoomCard = ({ room, hotelId, searchParamsForBooking }: { room: Room & { dataAiHint?: string }, hotelId: string, searchParamsForBooking: URLSearchParams }) => {
  const router = useRouter();

  const handleBookNow = () => {
    const bookingParams = new URLSearchParams(searchParamsForBooking);
    bookingParams.set('hotelId', hotelId);
    bookingParams.set('roomId', room.id);
    bookingParams.set('pricePerNight', room.pricePerNight.toString());
    router.push(`/booking?${bookingParams.toString()}`);
  };
  
  return (
  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row">
    <div className="sm:w-1/3 relative">
      <Image
        src={room.images[0] || 'https://placehold.co/400x300.png?text=Room'}
        alt={`Image of ${room.name}`}
        width={300}
        height={200}
        className="object-cover w-full h-48 sm:h-full"
        data-ai-hint={room.dataAiHint || "hotel room"}
      />
    </div>
    <div className="sm:w-2/3 flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-headline text-primary">{room.name}</CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{room.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow space-y-2">
        <div className="flex items-center text-sm">
          <Users size={16} className="mr-2 text-muted-foreground" /> Capacity: {room.capacity.adults} Adult{room.capacity.adults > 1 ? 's' : ''}
          {room.capacity.children > 0 && `, ${room.capacity.children} Child${room.capacity.children > 1 ? 'ren' : ''}`}
        </div>
        <div className="flex items-center text-sm">
          <BedDouble size={16} className="mr-2 text-muted-foreground" /> Beds: {room.beds.count} {room.beds.type}
        </div>
        {room.amenities.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mt-1">Key Amenities</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {room.amenities.slice(0, 4).map(amenity => (
                <Badge variant="secondary" key={amenity} className="text-xs">{amenity}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30">
        <div className="mb-2 sm:mb-0">
          <p className="text-2xl font-bold text-accent">
            ${room.pricePerNight}
            <span className="text-sm font-normal text-muted-foreground">/night</span>
          </p>
        </div>
        <Button size="lg" className="font-semibold w-full sm:w-auto" onClick={handleBookNow}>
          Book Now <ChevronRight size={18} className="ml-1" />
        </Button>
      </CardFooter>
    </div>
  </Card>
  );
};

const HotelAmenityIcon = ({ amenity }: { amenity: string }) => {
  const lowerAmenity = amenity.toLowerCase();
  if (lowerAmenity.includes('wifi')) return <Wifi size={18} className="mr-2 text-primary" />;
  if (lowerAmenity.includes('pool')) return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M12 14v8"></path><path d="M12 2a10 10 0 00-3.95 19.08"></path><path d="M12 2a10 10 0 013.95 19.08"></path><path d="M12 2v8"></path><path d="m4.22 10.22 1.42 1.42"></path><path d="m18.36 11.64 1.42-1.42"></path></svg>; // Pool icon
  if (lowerAmenity.includes('restaurant') || lowerAmenity.includes('dining')) return <Utensils size={18} className="mr-2 text-primary" />;
  if (lowerAmenity.includes('parking')) return <ParkingCircle size={18} className="mr-2 text-primary" />;
  if (lowerAmenity.includes('gym') || lowerAmenity.includes('fitness')) return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M5 8C5.55228 8 6 7.55228 6 7C6 6.44772 5.55228 6 5 6C4.44772 6 4 6.44772 4 7C4 7.55228 4.44772 8 5 8Z"></path><path d="M19 8C19.5523 8 20 7.55228 20 7C20 6.44772 19.5523 6 19 6C18.4477 6 18 6.44772 18 7C18 7.55228 18.4477 8 19 8Z"></path><path d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path><path d="M5 17C5.55228 17 6 16.5523 6 16C6 15.4477 5.55228 15 5 15C4.44772 15 4 15.4477 4 16C4 16.5523 4.44772 17 5 17Z"></path><path d="M19 17C19.5523 17 20 16.5523 20 16C20 15.4477 19.5523 15 19 15C18.4477 15 18 15.4477 18 16C18 16.5523 18.4477 17 19 17Z"></path><path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"></path><path d="M2 8H4"></path><path d="M6 8H11"></path><path d="M13 8H18"></path><path d="M20 8H22"></path><path d="M2 16H4"></path><path d="M6 16H11"></path><path d="M13 16H18"></path><path d="M20 16H22"></path></svg>; // Dumbbell for gym
  if (lowerAmenity.includes('tv')) return <Tv size={18} className="mr-2 text-primary" />;
  if (lowerAmenity.includes('spa')) return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M14 10h.01"></path><path d="M10 10h.01"></path><path d="M12 2a8 8 0 00-8 8c0 1.42.5 2.73 1.33 3.76L4 18.82V20h1.18l3.08-3.08A7.97 7.97 0 0012 18a8 8 0 008-8 8 8 0 00-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path><path d="M7.5 12.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5z"></path><path d="M15 12.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5z"></path></svg>; // Spa icon
  return <CheckCircle size={18} className="mr-2 text-primary" />;
};


export default function HotelDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // For checkIn, checkOut, guests, rooms
  const hotelId = params.hotelId as string;

  const [hotel, setHotel] = React.useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  // Extract search params for booking links
  const bookingSearchParams = React.useMemo(() => {
    const bookingParams = new URLSearchParams();
    if (searchParams.get('destinationId')) bookingParams.set('destinationId', searchParams.get('destinationId')!);
    if (searchParams.get('checkIn')) bookingParams.set('checkIn', searchParams.get('checkIn')!);
    if (searchParams.get('checkOut')) bookingParams.set('checkOut', searchParams.get('checkOut')!);
    if (searchParams.get('guests')) bookingParams.set('guests', searchParams.get('guests')!);
    if (searchParams.get('rooms')) bookingParams.set('rooms', searchParams.get('rooms')!);
    return bookingParams;
  }, [searchParams]);


  React.useEffect(() => {
    if (hotelId) {
      setIsLoading(true);
      fetchHotelDetails(hotelId).then(data => {
        setHotel(data);
        setIsLoading(false);
      });
    }
  }, [hotelId]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <PageContainer>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="w-full h-96 rounded-lg" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        </PageContainer>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
       <div className="flex flex-col min-h-screen">
        <Header />
        <PageContainer className="text-center">
          <h1 className="text-2xl font-bold">Hotel Not Found</h1>
          <p className="mt-2 text-muted-foreground">The hotel you are looking for does not exist or is unavailable.</p>
          <Link href="/" passHref>
            <Button className="mt-4">Go to Homepage</Button>
          </Link>
        </PageContainer>
        <Footer />
      </div>
    );
  }
  
  const currentImage = hotel.images[activeImageIndex] || 'https://placehold.co/800x600.png?text=Hotel+Image';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContainer>
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{hotel.name}</h1>
          <div className="flex items-center text-md text-muted-foreground mt-2">
            <MapPinIcon size={18} className="mr-2" /> {hotel.address}
            <Separator orientation="vertical" className="h-5 mx-3" />
            <div className="flex items-center">
             {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className={i < hotel.starRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
              ))}
              <span className="ml-2">({hotel.starRating} Stars)</span>
            </div>
            {hotel.guestRating && (
               <><Separator orientation="vertical" className="h-5 mx-3" /> <Badge variant="outline" className="text-base py-1 px-3 border-primary text-primary">{hotel.guestRating.toFixed(1)} Guest Rating</Badge></>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-8 shadow-lg">
              <CardContent className="p-0">
                <Image
                  src={currentImage}
                  alt={`Image ${activeImageIndex + 1} of ${hotel.name}`}
                  width={800}
                  height={500}
                  className="object-cover w-full h-[300px] md:h-[500px] rounded-t-lg"
                  data-ai-hint={hotel.dataAiHint || "hotel building"}
                />
                {hotel.images.length > 1 && (
                  <div className="p-2 bg-background/50 rounded-b-lg">
                    <ScrollArea className="w-full whitespace-nowrap">
                      <div className="flex space-x-2">
                      {hotel.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`block w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary/50'}`}
                        >
                          <Image src={img} alt={`Thumbnail ${index + 1}`} width={80} height={64} className="object-cover w-full h-full" data-ai-hint="hotel thumbnail" />
                        </button>
                      ))}
                      </div>
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({hotel.reviews?.length || 0})</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="prose max-w-none p-4 bg-card rounded-lg shadow border">
                <h2 className="text-2xl font-semibold mb-3">About {hotel.name}</h2>
                <p>{hotel.description}</p>
                {hotel.policies && (
                  <>
                    <h3 className="text-xl font-semibold mt-4 mb-2">Hotel Policies</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Check-in: {hotel.policies.checkIn}</li>
                      <li>Check-out: {hotel.policies.checkOut}</li>
                    </ul>
                  </>
                )}
              </TabsContent>
              <TabsContent value="amenities" className="p-4 bg-card rounded-lg shadow border">
                 <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center text-foreground">
                        <HotelAmenityIcon amenity={amenity} />
                        <span>{amenity}</span>
                      </div>
                    ))}
                 </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4 bg-card rounded-lg shadow border">
                <h2 className="text-2xl font-semibold mb-4">Guest Reviews</h2>
                {hotel.reviews && hotel.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {hotel.reviews.map(review => (
                      <Card key={review.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-md">{review.title || "Review"}</CardTitle>
                            <CardDescription className="text-xs">By {review.author} on {format(parseISO(review.date), "MMM dd, yyyy")}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-foreground/80">{review.comment}</p>
                      </Card>
                    ))}
                  </div>
                ) : <p>No reviews yet for this hotel.</p>}
              </TabsContent>
              <TabsContent value="location" className="p-4 bg-card rounded-lg shadow border">
                <h2 className="text-2xl font-semibold mb-4">Hotel Location</h2>
                <p className="mb-4 text-muted-foreground">{hotel.address}</p>
                <MapView hotels={[hotel]} selectedHotelId={hotel.id} />
                 {hotel.contact && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                    {hotel.contact.phone && <p className="flex items-center mb-1"><Phone size={16} className="mr-2 text-primary" /> {hotel.contact.phone}</p>}
                    {hotel.contact.email && <p className="flex items-center"><Mail size={16} className="mr-2 text-primary" /> {hotel.contact.email}</p>}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-headline">Available Rooms</CardTitle>
                <CardDescription>Select your preferred room type.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.rooms && hotel.rooms.length > 0 ? (
                  hotel.rooms.map(room => <RoomCard key={room.id} room={room} hotelId={hotel.id} searchParamsForBooking={bookingSearchParams} />)
                ) : (
                  <p className="text-muted-foreground p-4 text-center">No rooms available for the selected criteria or this hotel.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
}

    
