"use server";

import type { BookingData, GuestInformation, PaymentInformation } from "@/types";
import { z } from "zod";

// Define combined schema for validation inside server action
const completeBookingSchema = z.object({
  destinationId: z.string(),
  hotelId: z.string(),
  roomId: z.string(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  guests: z.number(),
  rooms: z.number(),
  totalPrice: z.number(),
  hotelName: z.string(), // For confirmation display
  roomName: z.string(), // For confirmation display
  guestInfo: z.object({
    salutation: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    specialRequests: z.string().optional(),
  }),
  paymentInfo: z.object({ // Only non-sensitive parts would typically be passed or handled
    cardHolderName: z.string(),
    // cardNumber, expiryDate, cvv are handled by Stripe.js client-side and token is sent
    // For this mock, we assume they are validated client-side.
    // In a real app, only a payment token/ID from Stripe would be sent here.
    billingAddress: z.object({
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
  }),
});


type CompleteBookingPayload = Omit<z.infer<typeof completeBookingSchema>, 'paymentInfo'> & {
    paymentInfo: Omit<PaymentInformation, 'cardNumber' | 'expiryDate' | 'cvv'> & { paymentToken?: string } // Example with paymentToken
};


export async function createBookingAction(
  payload: z.infer<typeof completeBookingSchema> // Using full payload for mock
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    // Validate payload (though Zod already did on client, good practice for server actions)
    const validationResult = completeBookingSchema.safeParse(payload);
    if (!validationResult.success) {
      console.error("Server-side validation failed:", validationResult.error.flatten().fieldErrors);
      return { success: false, error: "Invalid booking data provided." };
    }

    const { guestInfo, paymentInfo, ...bookingDetails } = validationResult.data;

    // Simulate payment processing with Stripe (or other gateway)
    // In a real app, you'd use paymentInfo.paymentToken (if Stripe.js was used)
    // to charge the card via Stripe's API.
    // For this mock, we'll assume payment is successful.
    const paymentProcessorResponse = { success: true, paymentId: `pi_${Date.now()}` };

    if (!paymentProcessorResponse.success) {
      return { success: false, error: "Payment processing failed." };
    }

    // Simulate saving booking to database
    const bookingId = `bk_${Date.now()}`;
    console.log("Booking created successfully (simulated):", {
      bookingId,
      ...bookingDetails,
      guestFirstName: guestInfo.firstName,
      guestLastName: guestInfo.lastName,
      guestEmail: guestInfo.email,
      paymentId: paymentProcessorResponse.paymentId,
      // IMPORTANT: Do NOT log or store raw CC details.
      // Store only masked CC (e.g., last 4 digits) and payment processor reference.
      maskedCardNumber: "**** **** **** " + payload.paymentInfo.cardNumber.slice(-4), // Example masking
    });

    // This is where you would interact with your database (Mongo, MySQL as per user request)
    // e.g., await db.collection('bookings').insertOne({...});

    return { success: true, bookingId };

  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "An unexpected error occurred while creating the booking." };
  }
}
