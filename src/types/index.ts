export interface Destination {
  id: string;
  name: string;
  country?: string; // Optional as per mock data
  description?: string; // For autocomplete display
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  destinationName?: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  starRating: number;
  guestRating?: number; // Make optional to match some mock APIs
  amenities: string[];
  images: string[]; // URLs
  cheapestRoomPrice?: number;
  rooms?: Room[];
  reviews?: HotelReview[];
  policies?: {
    checkIn: string;
    checkOut: string;
  };
  contact?: {
    phone: string;
    email: string;
  };
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
  };
  beds: {
    type: string;
    count: number;
  };
  amenities: string[];
  pricePerNight: number;
  images: string[]; // URLs
  availability?: number; // Number of such rooms available
}

export interface HotelReview {
  id: string;
  author: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  date: string; // ISO string
}

export interface SearchParams {
  destinationId?: string;
  destinationQuery?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  guests: number; // Total guests for simplicity in query, backend can split
  rooms: number;
}

export interface BookingData {
  destinationId: string;
  hotelId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  rooms: number;
  totalPrice: number;
}

export interface GuestInformation {
  salutation: 'Mr' | 'Ms' | 'Mrs' | 'Dr' | 'Other';
  firstName: string;
  lastName:string;
  email: string;
  phoneNumber: string;
  specialRequests?: string;
}

export interface PaymentInformation {
  cardNumber: string;
  expiryDate: string; // MM/YY
  cvv: string;
  cardHolderName: string;
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface BookingConfirmationDetails extends BookingData, GuestInformation {
  bookingId: string; // System's booking ID
  hotelName: string;
  roomName: string;
  paymentConfirmationId?: string; // from payment processor
}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface HotelFiltersType {
  starRatings: number[];
  guestRatingMin: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export type HotelSortByType = 'price' | 'starRating' | 'guestRating';
export type HotelSortOrderType = 'asc' | 'desc';

export interface HotelSortOptionType {
  sortBy: HotelSortByType;
  sortOrder: HotelSortOrderType;
}
