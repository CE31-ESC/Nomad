export const MAX_GUESTS = 10;
export const MAX_ROOMS = 5;

export const STAR_RATINGS = [1, 2, 3, 4, 5];

export const GUEST_RATING_THRESHOLDS = [
  { label: "Any", value: 0 },
  { label: "Wonderful 9+", value: 9 },
  { label: "Very Good 8+", value: 8 },
  { label: "Good 7+", value: 7 },
];

export const PRICE_RANGE_MIN = 0;
export const PRICE_RANGE_MAX = 1000; // Per night

export const DEFAULT_HOTEL_SORT: { sortBy: 'price', sortOrder: 'asc' } = {
  sortBy: 'price',
  sortOrder: 'asc',
};

export const MOCK_DESTINATIONS = [
  { id: 'paris', name: 'Paris', country: 'France', description: 'The city of lights and romance.' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', description: 'A bustling metropolis with a rich culture.' },
  { id: 'new-york', name: 'New York', country: 'USA', description: 'The city that never sleeps.' },
  { id: 'london', name: 'London', country: 'UK', description: 'Historic city with iconic landmarks.' },
  { id: 'rome', name: 'Rome', country: 'Italy', description: 'Ancient ruins and delicious cuisine.' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', description: 'Art, architecture, and beaches.' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', description: 'A vibrant garden city.' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', description: 'Tropical paradise with stunning beaches.' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', description: 'Famous for its opera house and harbor.' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', description: 'Canals, bicycles, and art.' },
];

export const MOCK_HOTELS: import('@/types').Hotel[] = [
  {
    id: 'hotel-paris-1',
    name: 'Grand Parisian Hotel',
    destinationId: 'paris',
    destinationName: 'Paris',
    description: 'A luxurious hotel in the heart of Paris, offering stunning views of the Eiffel Tower.',
    address: '1 Champs-Élysées, 75008 Paris, France',
    latitude: 48.8699,
    longitude: 2.3073,
    starRating: 5,
    guestRating: 9.2,
    amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Gym', 'Spa'],
    images: ['https://placehold.co/600x400.png?text=Grand+Parisian+Hotel+Exterior', 'https://placehold.co/600x400.png?text=Grand+Parisian+Hotel+Lobby', 'https://placehold.co/600x400.png?text=Grand+Parisian+Hotel+Room'],
    cheapestRoomPrice: 350,
    policies: { checkIn: '15:00', checkOut: '12:00' },
    contact: { phone: '+33 1 23 45 67 89', email: 'info@grandparisian.fr'}
  },
  {
    id: 'hotel-paris-2',
    name: 'Chic Montmartre Boutique',
    destinationId: 'paris',
    destinationName: 'Paris',
    description: 'A charming boutique hotel located in the artistic Montmartre district.',
    address: '10 Rue Lepic, 75018 Paris, France',
    latitude: 48.8867,
    longitude: 2.3394,
    starRating: 4,
    guestRating: 8.8,
    amenities: ['Free WiFi', 'Bar', 'Pet-friendly', 'Air Conditioning'],
    images: ['https://placehold.co/600x400.png?text=Chic+Montmartre+Exterior', 'https://placehold.co/600x400.png?text=Chic+Montmartre+Room'],
    cheapestRoomPrice: 180,
    policies: { checkIn: '14:00', checkOut: '11:00' },
    contact: { phone: '+33 1 98 76 54 32', email: 'contact@chicmontmartre.fr'}
  },
  {
    id: 'hotel-tokyo-1',
    name: 'Tokyo Imperial Palace View',
    destinationId: 'tokyo',
    destinationName: 'Tokyo',
    description: 'Elegant hotel with breathtaking views of the Imperial Palace gardens.',
    address: '1-1 Chiyoda, Chiyoda City, Tokyo 100-0001, Japan',
    latitude: 35.6852,
    longitude: 139.7528,
    starRating: 5,
    guestRating: 9.5,
    amenities: ['Free WiFi', 'Fine Dining', 'Indoor Pool', 'Fitness Center', 'Concierge'],
    images: ['https://placehold.co/600x400.png?text=Tokyo+Imperial+Hotel', 'https://placehold.co/600x400.png?text=Tokyo+Imperial+View'],
    cheapestRoomPrice: 500,
    policies: { checkIn: '15:00', checkOut: '12:00' },
    contact: { phone: '+81 3-1234-5678', email: 'reservations@tokyoimperial.jp'}
  },
  {
    id: 'hotel-tokyo-2',
    name: 'Shinjuku Modern Stay',
    destinationId: 'tokyo',
    destinationName: 'Tokyo',
    description: 'Sleek and contemporary hotel in the vibrant Shinjuku area, close to transport and entertainment.',
    address: '2-2-1 Nishi-Shinjuku, Shinjuku City, Tokyo 160-0023, Japan',
    latitude: 35.6895,
    longitude: 139.6917,
    starRating: 4,
    guestRating: 8.5,
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Laundry Service'],
    images: ['https://placehold.co/600x400.png?text=Shinjuku+Modern+Exterior', 'https://placehold.co/600x400.png?text=Shinjuku+Modern+Room'],
    cheapestRoomPrice: 220,
    policies: { checkIn: '15:00', checkOut: '11:00' },
    contact: { phone: '+81 3-8765-4321', email: 'stay@shinjukumodern.jp'}
  },
   {
    id: 'hotel-singapore-1',
    name: 'Marina Bay Sands',
    destinationId: 'singapore',
    destinationName: 'Singapore',
    description: 'Iconic hotel with a stunning rooftop infinity pool and panoramic city views.',
    address: '10 Bayfront Ave, Singapore 018956',
    latitude: 1.2839,
    longitude: 103.8606,
    starRating: 5,
    guestRating: 9.1,
    amenities: ['Rooftop Pool', 'Casino', 'Multiple Restaurants', 'Shopping Mall', 'Museum'],
    images: ['https://placehold.co/600x400.png?text=Marina+Bay+Sands+Exterior', 'https://placehold.co/600x400.png?text=Marina+Bay+Sands+Pool'],
    cheapestRoomPrice: 600,
    policies: { checkIn: '15:00', checkOut: '11:00' },
    contact: { phone: '+65 6688 8888', email: 'room.reservations@marinabaysands.com'}
  },
  {
    id: 'hotel-singapore-2',
    name: 'The Fullerton Hotel Singapore',
    destinationId: 'singapore',
    destinationName: 'Singapore',
    description: 'A grand heritage hotel located in a beautifully restored neoclassical building by the Singapore River.',
    address: '1 Fullerton Square, Singapore 049178',
    latitude: 1.2862,
    longitude: 103.8538,
    starRating: 5,
    guestRating: 9.3,
    amenities: ['Free WiFi', 'Outdoor Pool', 'Heritage Tours', 'Spa', 'Fine Dining'],
    images: ['https://placehold.co/600x400.png?text=Fullerton+Hotel+Exterior', 'https://placehold.co/600x400.png?text=Fullerton+Hotel+Lobby'],
    cheapestRoomPrice: 450,
    policies: { checkIn: '15:00', checkOut: '12:00' },
    contact: { phone: '+65 6733 8388', email: 'tfs.reservations@fullertonhotels.com'}
  },
];

export const MOCK_ROOMS: import('@/types').Room[] = [
  // Grand Parisian Hotel Rooms
  {
    id: 'room-paris-1-std',
    hotelId: 'hotel-paris-1',
    name: 'Standard Double Room',
    description: 'A comfortable room with a queen-sized bed, perfect for couples.',
    capacity: { adults: 2, children: 0 },
    beds: { type: 'Queen', count: 1 },
    amenities: ['Ensuite Bathroom', 'TV', 'Mini-fridge', 'City View'],
    pricePerNight: 350,
    images: ['https://placehold.co/400x300.png?text=Standard+Double+Room', 'https://placehold.co/400x300.png?text=Standard+Room+View'],
    availability: 5,
  },
  {
    id: 'room-paris-1-deluxe',
    hotelId: 'hotel-paris-1',
    name: 'Deluxe Suite with Eiffel Tower View',
    description: 'Spacious suite with a separate living area and a balcony overlooking the Eiffel Tower.',
    capacity: { adults: 2, children: 1 },
    beds: { type: 'King', count: 1 },
    amenities: ['Ensuite Bathroom', 'Jacuzzi Tub', 'TV', 'Nespresso Machine', 'Balcony'],
    pricePerNight: 700,
    images: ['https://placehold.co/400x300.png?text=Deluxe+Suite', 'https://placehold.co/400x300.png?text=Eiffel+Tower+View'],
    availability: 2,
  },
  // Chic Montmartre Boutique Rooms
  {
    id: 'room-paris-2-cozy',
    hotelId: 'hotel-paris-2',
    name: 'Cozy Single Room',
    description: 'A small, charming room ideal for solo travelers.',
    capacity: { adults: 1, children: 0 },
    beds: { type: 'Single', count: 1 },
    amenities: ['Ensuite Bathroom', 'TV', 'Desk'],
    pricePerNight: 180,
    images: ['https://placehold.co/400x300.png?text=Cozy+Single+Room'],
    availability: 3,
  },
  {
    id: 'room-paris-2-artistic',
    hotelId: 'hotel-paris-2',
    name: 'Artistic Double Room',
    description: 'Uniquely decorated double room with local art.',
    capacity: { adults: 2, children: 0 },
    beds: { type: 'Double', count: 1 },
    amenities: ['Ensuite Bathroom', 'TV', 'Air Conditioning', 'Unique Decor'],
    pricePerNight: 250,
    images: ['https://placehold.co/400x300.png?text=Artistic+Double+Room'],
    availability: 4,
  },
  // Tokyo Imperial Palace View Rooms
  {
    id: 'room-tokyo-1-garden',
    hotelId: 'hotel-tokyo-1',
    name: 'Garden View Twin Room',
    description: 'Elegant twin room with serene views of the Imperial Palace gardens.',
    capacity: { adults: 2, children: 0 },
    beds: { type: 'Twin', count: 2 },
    amenities: ['Ensuite Bathroom', 'TV', 'Seating Area', 'Minibar'],
    pricePerNight: 500,
    images: ['https://placehold.co/400x300.png?text=Garden+View+Twin', 'https://placehold.co/400x300.png?text=Imperial+Garden+View'],
    availability: 6,
  },
  // Shinjuku Modern Stay Rooms
  {
    id: 'room-tokyo-2-city',
    hotelId: 'hotel-tokyo-2',
    name: 'City View Queen Room',
    description: 'Modern queen room with expansive views of the Shinjuku cityscape.',
    capacity: { adults: 2, children: 0 },
    beds: { type: 'Queen', count: 1 },
    amenities: ['Ensuite Bathroom', 'TV', 'Work Desk', 'High-speed Internet'],
    pricePerNight: 220,
    images: ['https://placehold.co/400x300.png?text=City+View+Queen', 'https://placehold.co/400x300.png?text=Shinjuku+Cityscape'],
    availability: 8,
  },
  // Marina Bay Sands Rooms
  {
    id: 'room-singapore-1-deluxe',
    hotelId: 'hotel-singapore-1',
    name: 'Deluxe Room City View',
    description: 'Luxurious room offering stunning views of the Singapore skyline.',
    capacity: { adults: 2, children: 1 },
    beds: { type: 'King', count: 1 },
    amenities: ['Ensuite Bathroom', 'Large TV', 'Minibar', 'Floor-to-ceiling windows'],
    pricePerNight: 600,
    images: ['https://placehold.co/400x300.png?text=MBS+Deluxe+Room', 'https://placehold.co/400x300.png?text=MBS+City+View'],
    availability: 10,
  },
  // The Fullerton Hotel Singapore Rooms
  {
    id: 'room-singapore-2-heritage',
    hotelId: 'hotel-singapore-2',
    name: 'Heritage Courtyard Room',
    description: 'Elegantly appointed room overlooking the hotel’s sunlit atrium courtyard.',
    capacity: { adults: 2, children: 0 },
    beds: { type: 'Queen', count: 1 },
    amenities: ['Ensuite Bathroom', 'TV', 'Heritage decor', 'Complimentary snacks'],
    pricePerNight: 450,
    images: ['https://placehold.co/400x300.png?text=Fullerton+Courtyard+Room'],
    availability: 7,
  },
];

export const MOCK_REVIEWS: import('@/types').HotelReview[] = [
  // Reviews for Grand Parisian Hotel
  {
    id: 'review-paris-1-1',
    author: 'John Doe',
    rating: 5,
    title: 'Absolutely magnificent!',
    comment: 'The views were breathtaking and the service was top-notch. Worth every penny.',
    date: '2023-10-15T10:00:00Z',
  },
  {
    id: 'review-paris-1-2',
    author: 'Jane Smith',
    rating: 4,
    title: 'Wonderful stay',
    comment: 'Loved the location and the amenities. The pool was fantastic. Room was a bit smaller than expected for the price.',
    date: '2023-09-20T14:30:00Z',
  },
  // Reviews for Chic Montmartre Boutique
  {
    id: 'review-paris-2-1',
    author: 'Alice Brown',
    rating: 5,
    title: 'Charming and perfectly located',
    comment: 'Fell in love with this hotel and the Montmartre area. Staff were incredibly friendly.',
    date: '2023-11-01T09:15:00Z',
  },
  // Reviews for Tokyo Imperial Palace View
  {
    id: 'review-tokyo-1-1',
    author: 'Ken Tanaka',
    rating: 5,
    title: 'Unforgettable Experience',
    comment: 'The service and views are unparalleled. Truly a 5-star experience in Tokyo.',
    date: '2023-08-05T12:00:00Z',
  },
];

// Assign reviews and rooms to hotels
MOCK_HOTELS.forEach(hotel => {
  hotel.rooms = MOCK_ROOMS.filter(room => room.hotelId === hotel.id);
  hotel.reviews = MOCK_REVIEWS.filter(review => review.comment.toLowerCase().includes(hotel.name.split(' ')[1].toLowerCase())); // Simple match for demo
});
