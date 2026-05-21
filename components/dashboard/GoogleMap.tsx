'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

interface GoogleMapProps {
  junctions: any[];
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

export function GoogleMap({ junctions }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  const onMapLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (isLoaded && mapRef.current && window.google && !mapInstance.current) {
      const delhi = { lat: 28.6139, lng: 77.209 };
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: delhi,
        zoom: 12,
        // Ensure no mapId is present to allow 'styles'
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        ],
      });
    }

    if (isLoaded && mapInstance.current && junctions.length > 0) {
      // Clear existing markers
      markers.current.forEach(m => m.setMap(null));
      markers.current = [];

      junctions.forEach((junction) => {
        const lat = parseFloat(junction.latitude);
        const lng = parseFloat(junction.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        const color = junction.trafficLevel === 'severe' ? '#ef4444' : 
                      junction.trafficLevel === 'heavy' ? '#f97316' : 
                      junction.trafficLevel === 'moderate' ? '#eab308' : '#22c55e';

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance.current,
          title: junction.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 10,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #1e293b; padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${junction.name}</h3>
              <p style="font-size: 12px; margin: 0;">Status: <strong>${junction.trafficLevel.toUpperCase()}</strong></p>
              <p style="font-size: 12px; margin: 0;">Vehicles: ${junction.currentVehicles}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstance.current, marker);
        });

        markers.current.push(marker);
      });
    }
  }, [isLoaded, junctions]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=geometry,drawing,places&loading=async`}
        onLoad={onMapLoad}
      />
      
      <Card className="border-sidebar-border overflow-hidden relative">
        <CardHeader className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg border border-sidebar-border p-2 px-3 shadow-xl">
          <CardTitle className="text-xs font-bold flex items-center gap-2">
            <MapIcon className="w-3 h-3 text-primary" />
            Real-Time Traffic Map (New Delhi)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[450px]">
          {!isLoaded ? (
            <div className="w-full h-full bg-sidebar flex items-center justify-center text-muted-foreground text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading Google Maps...
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </CardContent>
      </Card>
    </>
  );
}
