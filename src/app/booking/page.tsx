
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { format, parseISO, differenceInDays } from "date-fns";

import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MOCK_HOTELS, MOCK_ROOMS } from "@/lib/constants";
import type { Hotel, Room, GuestInformation, PaymentInformation, BookingData } from "@/types";
import { ChevronLeft, ChevronRight, Lock, User, CreditCard, CalendarDays, BedDouble, Users as UsersIcon, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createBookingAction } from "./actions"; // Server action
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


const guestInfoSchema = z.object({
  salutation: z.enum(["Mr", "Ms", "Mrs", "Dr", "Other"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(7, "Phone number is required"), // Basic validation
  specialRequests: z.string().optional(),
});

const paymentInfoSchema = z.object({
  cardHolderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().length(16, "Card number must be 16 digits").regex(/^\d+$/, "Card number must be digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be MM/YY"),
  cvv: z.string().min(3).max(4).regex(/^\d+$/, "CVV must be digits"),
  billingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

type GuestInfoValues = z.infer<typeof guestInfoSchema>;
type PaymentInfoValues = z.infer<typeof paymentInfoSchema>;

const steps = ["Details", "Review", "Payment"];

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [bookingData, setBookingData] = React.useState<BookingData | null>(null);
  const [hotel, setHotel] = React.useState<Hotel | null>(null);
  const [room, setRoom] = React.useState<Room | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const guestForm = useForm<GuestInfoValues>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: { salutation: "Mr", specialRequests: "" },
  });

  const paymentForm = useForm<PaymentInfoValues>({
    resolver: zodResolver(paymentInfoSchema),
  });

  React.useEffect(() => {
    const hotelId = searchParams.get("hotelId");
    const roomId = searchParams.get("roomId");
    const checkInStr = searchParams.get("checkIn");
    const checkOutStr = searchParams.get("checkOut");
    const guestsStr = searchParams.get("guests");
    const roomsStr = searchParams.get("rooms");
    const pricePerNightStr = searchParams.get("pricePerNight");

    if (hotelId && roomId && checkInStr && checkOutStr && guestsStr && roomsStr && pricePerNightStr) {
      const foundHotel = MOCK_HOTELS.find(h => h.id === hotelId);
      const foundRoom = MOCK_ROOMS.find(r => r.id === roomId && r.hotelId === hotelId);
      
      if (foundHotel && foundRoom) {
        setHotel(foundHotel);
        setRoom(foundRoom);
        const checkInDate = parseISO(checkInStr);
        const checkOutDate = parseISO(checkOutStr);
        const nights = differenceInDays(checkOutDate, checkInDate);
        const totalPrice = nights * parseFloat(pricePerNightStr) * parseInt(roomsStr);

        setBookingData({
          hotelId,
          roomId,
          destinationId: foundHotel.destinationId,
          checkInDate,
          checkOutDate,
          guests: parseInt(guestsStr),
          rooms: parseInt(roomsStr),
          totalPrice,
        });
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(s => Math.max(s - 0, 0));

  const handleGuestInfoSubmit = (data: GuestInfoValues) => {
    guestForm.trigger(); // Ensure validation runs
    if(guestForm.formState.isValid) {
       nextStep();
    } else {
      toast({ variant: "destructive", title: "Validation Error", description: "Please check your details."})
    }
  };

  const handlePaymentSubmit = async (data: PaymentInfoValues) => {
    paymentForm.trigger();
    if (!paymentForm.formState.isValid || !bookingData || !hotel || !room) {
       toast({ variant: "destructive", title: "Validation Error", description: "Please check your payment details."})
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Combine all data for server action
      const completeBookingData = {
        ...bookingData,
        guestInfo: guestForm.getValues(),
        paymentInfo: data,
        hotelName: hotel.name,
        roomName: room.name,
      };

      const result = await createBookingAction(completeBookingData);

      if (result.success && result.bookingId) {
        toast({ title: "Booking Successful!", description: `Your booking ID: ${result.bookingId}` });
        // Pass necessary info to confirmation page
        const confirmationParams = new URLSearchParams({
            bookingId: result.bookingId,
            hotelName: hotel.name,
            roomName: room.name,
            checkIn: format(bookingData.checkInDate, "yyyy-MM-dd"),
            checkOut: format(bookingData.checkOutDate, "yyyy-MM-dd"),
            guests: bookingData.guests.toString(),
            totalPrice: bookingData.totalPrice.toString(),
        }).toString();
        router.push(`/booking/confirmation?${confirmationParams}`);
      } else {
        toast({ variant: "destructive", title: "Booking Failed", description: result.error || "An unexpected error occurred." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Booking Error", description: "Could not process your booking. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex flex-col min-h-screen"><Header /><PageContainer><Card><CardContent className="p-8"><Skeleton className="h-8 w-1/2 mb-4" /><Skeleton className="h-96 w-full" /></CardContent></Card></PageContainer><Footer/></div>;
  }

  if (!bookingData || !hotel || !room) {
    return <div className="flex flex-col min-h-screen"><Header /><PageContainer className="text-center"><Card><CardHeader><CardTitle>Booking Error</CardTitle></CardHeader><CardContent><p>Missing booking information. Please select a room again.</p><Button onClick={() => router.push('/')} className="mt-4">Go Home</Button></CardContent></Card></PageContainer><Footer/></div>;
  }
  
  const nights = differenceInDays(bookingData.checkOutDate, bookingData.checkInDate);

  return (
    <div className="flex flex-col min-h-screen">
    <Header />
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <CardTitle className="text-2xl md:text-3xl font-headline text-primary">Complete Your Booking</CardTitle>
            <div className="flex items-center justify-center space-x-2 md:space-x-4 mt-4">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2",
                        currentStep > index ? "bg-primary border-primary text-primary-foreground" :
                        currentStep === index ? "bg-primary/20 border-primary text-primary font-semibold" :
                        "bg-muted border-border text-muted-foreground"
                      )}
                    >
                      {currentStep > index ? <CheckCircle size={20}/> : index + 1}
                    </div>
                    <p className={cn("text-xs md:text-sm mt-1", currentStep >= index ? "text-primary font-medium" : "text-muted-foreground")}>{step}</p>
                  </div>
                  {index < steps.length - 1 && <Separator className={cn("flex-1 h-0.5 max-w-16 md:max-w-24", currentStep > index ? "bg-primary" : "bg-border")} />}
                </React.Fragment>
              ))}
            </div>
          </CardHeader>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{hotel.address}</p>
                    <Image src={room.images[0]} alt={room.name} width={400} height={250} className="rounded-lg object-cover w-full aspect-[16/9] mb-3" data-ai-hint="hotel room interior detail"/>
                    <p className="font-medium">{room.name}</p>
                </div>
                <Card className="p-4 bg-secondary/50">
                    <h4 className="text-lg font-semibold mb-3 text-primary">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Check-in:</span> <span className="font-medium">{format(bookingData.checkInDate, "MMM dd, yyyy")}</span></div>
                        <div className="flex justify-between"><span>Check-out:</span> <span className="font-medium">{format(bookingData.checkOutDate, "MMM dd, yyyy")}</span></div>
                        <div className="flex justify-between"><span>Duration:</span> <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span></div>
                        <div className="flex justify-between"><span>Guests:</span> <span className="font-medium">{bookingData.guests}</span></div>
                        <div className="flex justify-between"><span>Rooms:</span> <span className="font-medium">{bookingData.rooms}</span></div>
                        <Separator className="my-2"/>
                        <div className="flex justify-between text-lg">
                            <span className="font-semibold">Total Price:</span> 
                            <span className="font-bold text-accent">${bookingData.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>
            </div>
            <Separator className="my-6 md:my-8" />

            {currentStep === 0 && ( // Details Step
              <form onSubmit={guestForm.handleSubmit(handleGuestInfoSubmit)} className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center"><User className="mr-2 text-primary"/> Guest Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salutation">Salutation</Label>
                    <Controller name="salutation" control={guestForm.control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="salutation"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr">Mr.</SelectItem>
                          <SelectItem value="Ms">Ms.</SelectItem>
                          <SelectItem value="Mrs">Mrs.</SelectItem>
                          <SelectItem value="Dr">Dr.</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )} />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...guestForm.register("firstName")} />
                    {guestForm.formState.errors.firstName && <p className="text-xs text-destructive mt-1">{guestForm.formState.errors.firstName.message}</p>}
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...guestForm.register("lastName")} />
                    {guestForm.formState.errors.lastName && <p className="text-xs text-destructive mt-1">{guestForm.formState.errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...guestForm.register("email")} />
                    {guestForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{guestForm.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" {...guestForm.register("phoneNumber")} />
                    {guestForm.formState.errors.phoneNumber && <p className="text-xs text-destructive mt-1">{guestForm.formState.errors.phoneNumber.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea id="specialRequests" {...guestForm.register("specialRequests")} placeholder="e.g., late check-in, feather-free room" />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" size="lg">Next: Review <ChevronRight/></Button>
                </div>
              </form>
            )}

            {currentStep === 1 && ( // Review Step
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Review Your Booking</h2>
                <Card className="bg-secondary/30 p-4">
                    <CardTitle className="text-lg mb-2">Guest Information</CardTitle>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <p><strong>Name:</strong> {guestForm.getValues("salutation")} {guestForm.getValues("firstName")} {guestForm.getValues("lastName")}</p>
                        <p><strong>Email:</strong> {guestForm.getValues("email")}</p>
                        <p><strong>Phone:</strong> {guestForm.getValues("phoneNumber")}</p>
                        {guestForm.getValues("specialRequests") && <p className="col-span-2"><strong>Requests:</strong> {guestForm.getValues("specialRequests")}</p>}
                    </div>
                </Card>
                 <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={prevStep} size="lg"><ChevronLeft/> Back to Details</Button>
                  <Button onClick={nextStep} size="lg">Next: Payment <ChevronRight/></Button>
                </div>
              </div>
            )}

            {currentStep === 2 && ( // Payment Step
              <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center"><CreditCard className="mr-2 text-primary"/> Payment Details</h2>
                <p className="text-sm text-muted-foreground flex items-center"><Lock size={14} className="mr-1"/> Your payment information is securely processed.</p>
                <div>
                  <Label htmlFor="cardHolderName">Cardholder Name</Label>
                  <Input id="cardHolderName" {...paymentForm.register("cardHolderName")} />
                  {paymentForm.formState.errors.cardHolderName && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.cardHolderName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" {...paymentForm.register("cardNumber")} />
                   {paymentForm.formState.errors.cardNumber && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                    <Input id="expiryDate" placeholder="MM/YY" {...paymentForm.register("expiryDate")} />
                    {paymentForm.formState.errors.expiryDate && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.expiryDate.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV/CVC</Label>
                    <Input id="cvv" placeholder="123" {...paymentForm.register("cvv")} />
                    {paymentForm.formState.errors.cvv && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.cvv.message}</p>}
                  </div>
                </div>
                <h3 className="text-lg font-semibold pt-2">Billing Address</h3>
                 <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" {...paymentForm.register("billingAddress.street")} />
                    {paymentForm.formState.errors.billingAddress?.street && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.billingAddress.street.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...paymentForm.register("billingAddress.city")} />
                        {paymentForm.formState.errors.billingAddress?.city && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.billingAddress.city.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...paymentForm.register("billingAddress.postalCode")} />
                        {paymentForm.formState.errors.billingAddress?.postalCode && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.billingAddress.postalCode.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...paymentForm.register("billingAddress.country")} />
                        {paymentForm.formState.errors.billingAddress?.country && <p className="text-xs text-destructive mt-1">{paymentForm.formState.errors.billingAddress.country.message}</p>}
                    </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={prevStep} size="lg" disabled={isSubmitting}><ChevronLeft/> Back to Review</Button>
                  <Button type="submit" size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : `Pay $${bookingData.totalPrice.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
    <Footer />
    </div>
  );
}


