// @ts-nocheck
"use client";

import { useState } from "react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (lat: number | null, lng: number | null) => void;
}

export function LocationInput({
  value,
  onChange,
  onCoordinatesChange,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch location suggestions from OpenStreetMap (Nominatim)
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5&accept-language=en`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "ShadowReport-App",
        },
      });

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    onChange(item.display_name);
    onCoordinatesChange?.(parseFloat(item.lat), parseFloat(item.lon));
    setSuggestions([]);
  };

  // Get current geolocation
  const getLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 7000,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      onCoordinatesChange?.(latitude, longitude);
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(
        error instanceof Error ? error.message : "Unable to get your location"
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-400">Location</label>

      <div className="relative">
        <input
          type="text"
          value={value}
          placeholder="Enter location or use pin"
          onChange={(e) => {
            onChange(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 pl-4 pr-12 py-3.5
            text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition"
        />

        {/* Get Current Location Button */}
        <button
          type="button"
          onClick={getLocation}
          disabled={isGettingLocation}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg 
            bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition"
          title="Get current location"
        >
          {isGettingLocation ? (
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                className="opacity-25"
                strokeWidth="4"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
          )}
        </button>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50">
            {suggestions.map((item: any) => (
              <div
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 cursor-pointer hover:bg-zinc-800 text-white"
              >
                {item.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {locationError && (
        <p className="text-red-400 text-sm">{locationError}</p>
      )}
    </div>
  );
}
