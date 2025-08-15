"use client";

import { useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import { Card } from '@ui/card';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [marker, setMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [address, setAddress] = useState('');

  const handleClick = useCallback(async ({ lat, lng }: { lat: number; lng: number }) => {
    setMarker({ lat, lng });

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
      );
      const data = await response.json();
      
      if (data.results[0]) {
        const newAddress = data.results[0].formatted_address;
        setAddress(newAddress);
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: newAddress
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }, [onLocationSelect]);

  return (
    <Card className="p-4">
      <div className="h-[400px] mb-4">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY! }}
          defaultCenter={{ lat: 48.8566, lng: 2.3522 }}
          defaultZoom={13}
          onClick={handleClick}
        >
          {marker && (
            <MapPin
              className="text-primary w-8 h-8"
            />
          )}
        </GoogleMapReact>
      </div>

      <div className="space-y-2">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Location address"
          readOnly
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  handleClick({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  });
                },
                (error) => {
                  console.error('Error getting location:', error);
                }
              );
            }
          }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Use My Location
        </Button>
      </div>
    </Card>
  );
}