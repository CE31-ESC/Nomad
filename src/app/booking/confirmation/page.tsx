"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";

import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, CalendarDays, BedDouble, Users, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");
  const hotelName = searchParams.get("hotelName");
  const roomName = searchParams.get("roomName");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const totalPrice = searchParams.get("totalPrice");

  if (!bookingId || !hotelName || !roomName || !checkIn || !checkOut || !guests || !totalPrice) {
    // Optional: Redirect to home or error page if essential params are missing
    React.useEffect(() => {
        //router.push('/'); // Or an error page
    }, [router]);
    return (
         <div className="flex flex-col min-h-screen">
            <Header />
            <PageContainer className="text-center">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl text-destructive">Booking Information Missing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>We couldn't display your booking confirmation. Please check your bookings or contact support.</p>
                        <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
                    </CardContent>
                </Card>
            </PageContainer>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContainer>
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center bg-primary/10 p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-headline text-primary">Booking Confirmed!</CardTitle>
            <CardDescription className="text-lg text-foreground/80 mt-2">
              Thank you for booking with Nomad Navigator. Your adventure awaits!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Booking Reference</h3>
              <p className="text-2xl font-mono text-accent bg-accent/10 px-3 py-1 rounded-md inline-block">{bookingId}</p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Stay Details</h3>
              <div className="space-y-3 text-md">
                <div className="flex items-center">
                  <Home size={20} className="mr-3 text-primary" />
                  <div>
                    <span className="font-medium">{hotelName}</span><br/>
                    <span className="text-sm text-muted-foreground">{roomName}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDays size={20} className="mr-3 text-primary" />
                  <span>{format(parseISO(checkIn), "EEE, MMM dd, yyyy")} - {format(parseISO(checkOut), "EEE, MMM dd, yyyy")}</span>
                </div>
                 <div className="flex items-center">
                  <Users size={20} className="mr-3 text-primary" />
                  <span>{guests} Guest{parseInt(guests) > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Price</h3>
                <p className="text-3xl font-bold text-primary flex items-center">
                    <DollarSign size={28} className="mr-1"/>{parseFloat(totalPrice).toFixed(2)}
                </p>
            </div>
            
            <Separator />

            <div className="text-sm text-muted-foreground">
              <p>You will receive an email confirmation shortly with all your booking details.</p>
              <p className="mt-1">If you have any questions, please contact our support team.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/profile" passHref className="flex-1">
                <Button variant="outline" className="w-full" size="lg">View My Bookings</Button>
              </Link>
              <Link href="/" passHref className="flex-1">
                <Button className="w-full" size="lg">Explore More Hotels</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
      <Footer />
    </div>
  );
}
