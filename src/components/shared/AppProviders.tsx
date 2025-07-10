"use client";

import type { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    console.warn("Google Maps API key is not configured. Maps will not work.");
    // Potentially return children directly or with a notice if maps are crucial everywhere
  }
  
  // If key is available, wrap with APIProvider. Otherwise, just return children.
  // This allows the app to run without a key, but map features will be degraded/absent.
  return googleMapsApiKey ? (
    <APIProvider apiKey={googleMapsApiKey}>
      {children}
    </APIProvider>
  ) : (
    <>{children}</>
  );
}
