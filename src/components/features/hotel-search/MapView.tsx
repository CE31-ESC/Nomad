
"use client";

import * as React from 'react';
import { Map, Marker, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Hotel } from '@/types';
import { HotelIcon, MapPinIcon } from 'lucide-react'; // Added MapPinIcon import

interface MapViewProps {
  hotels: Hotel[];
  selectedHotelId?: string;
  onMarkerClick?: (hotelId: string) => void;
}

export function MapView({ hotels, selectedHotelId, onMarkerClick }: MapViewProps) {
  const [mapCenter, setMapCenter] = React.useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = React.useState(2); // Default zoom

  React.useEffect(() => {
    if (hotels.length > 0) {
      // Calculate average lat/lng for centering, or use first hotel
      const validHotels = hotels.filter(h => h.latitude != null && h.longitude != null);
      if (validHotels.length > 0) {
        const avgLat = validHotels.reduce((sum, h) => sum + h.latitude, 0) / validHotels.length;
        const avgLng = validHotels.reduce((sum, h) => sum + h.longitude, 0) / validHotels.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
        setZoom(validHotels.length === 1 ? 12 : 6); // Zoom in more if only one hotel
      }
    } else {
      // Default to a central location if no hotels or no valid coordinates
      setMapCenter({ lat: 20, lng: 0 }); // A general world view
      setZoom(2);
    }
  }, [hotels]);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div 
        className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-center p-4"
        data-ai-hint="map placeholder"
      >
        <div className="text-muted-foreground">
          <MapPinIcon className="mx-auto h-12 w-12 mb-2" />
          <p className="font-semibold">Map View Unavailable</p>
          <p className="text-xs">Google Maps API key not configured.</p>
        </div>
      </div>
    );
  }
  
  if (hotels.length === 0) {
     return (
      <div 
        className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-center p-4"
        data-ai-hint="empty map"
      >
        <div className="text-muted-foreground">
          <MapPinIcon className="mx-auto h-12 w-12 mb-2" />
          <p className="font-semibold">No hotels to display on map.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }} className="rounded-lg overflow-hidden border">
      <Map
        defaultCenter={mapCenter}
        defaultZoom={zoom}
        center={mapCenter}
        zoom={zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="nomadNavigatorMap" // Optional: for custom styling in Google Cloud Console
      >
        {hotels.map((hotel) => {
          if (hotel.latitude == null || hotel.longitude == null) return null;
          return (
            <AdvancedMarker
              key={hotel.id}
              position={{ lat: hotel.latitude, lng: hotel.longitude }}
              title={hotel.name}
              onClick={() => onMarkerClick?.(hotel.id)}
            >
              <div className={`p-1.5 rounded-full shadow-md transition-all
                ${selectedHotelId === hotel.id ? 'bg-accent scale-125' : 'bg-primary'}`}>
                <HotelIcon size={18} className={selectedHotelId === hotel.id ? "text-accent-foreground" : "text-primary-foreground"} />
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </div>
  );
}
