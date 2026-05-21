'use client';

import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';

export function FreeMap({ junctions }: { junctions: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any>(null);
  const [mapType, setMapType] = useState<'m' | 'y'>('m');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Directions States
  const [directionsMode, setDirectionsMode] = useState(false);
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const [navigationInstructions, setNavigationInstructions] = useState<any[]>([]);
  const [viewingLocation, setViewingLocation] = useState<string>('');
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const mapInstance = useRef<any>(null);
  const layerInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routingControlRef = useRef<any>(null);
  const searchMarkerRef = useRef<any>(null);
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoStartRef = useRef<boolean>(false);
  // Callback ref — the moveend listener always calls the LATEST version of this function
  const geocodeCallbackRef = useRef<(lat: number, lng: number) => void>(() => {});

  // Robust initialization triggered by the Script's onLoad event or manual check
  const initMap = () => {
    if (isLoaded || !mapRef.current || !(window as any).L) return;
    try {
      const L = (window as any).L;
      setLeafletLoaded(true);

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          minZoom: 2,
          maxZoom: 20
        }).setView([20, 0], 2);
      }
      
      syncLayer(L);
      syncMarkers(L);
      
      // Use ref so Fast Refresh never creates a stale closure here
      mapInstance.current.on('moveend', () => {
        const center = mapInstance.current.getCenter();
        geocodeCallbackRef.current(center.lat, center.lng);
      });

      setIsLoaded(true);
    } catch (err) {
      console.error("Map init error:", err);
    }
  };

  // Keep geocodeCallbackRef pointing to latest function on every render
  const updateViewingLocation = (lat: number, lng: number) => {
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    geocodeTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lng}`);
        if (!response.ok) return;
        const data = await response.json();
        const feature = data.features?.[0]?.properties;
        if (feature) {
          setViewingLocation(feature.name || feature.city || feature.state || '');
        }
      } catch { /* silently ignore network errors */ }
    }, 1200);
  };
  // Update ref every render so the moveend listener is never stale
  geocodeCallbackRef.current = updateViewingLocation;

  useEffect(() => {
    if ((window as any).L && !isLoaded) {
      initMap();
    }
    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, []);

  const syncLayer = (L: any) => {
    if (layerInstance.current) layerInstance.current.remove();
    layerInstance.current = L.tileLayer(`https://{s}.google.com/vt/lyrs=${mapType}&x={x}&y={y}&z={z}`, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mapInstance.current);
  };

  const syncMarkers = (L: any) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    (junctions || []).forEach((j) => {
      const color = j.trafficLevel === 'severe' ? '#ef4444' : '#22c55e';
      const icon = L.divIcon({
        className: 'gm-marker',
        html: `<div style="width:32px;height:32px;position:relative;">
          <svg viewBox="0 0 24 24" fill="${color}" style="width:32px;height:32px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.3))">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" stroke="white" stroke-width="0.3"/>
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      const m = L.marker([j.latitude || 17.3850, j.longitude || 78.4867], { icon }).addTo(mapInstance.current);
      m.on('click', () => {
        setSelected(j);
        mapInstance.current.setView([j.latitude || 17.3850, j.longitude || 78.4867], 15, { animate: true });
      });
      markersRef.current.push(m);
    });
  };

  // Search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const localResults = (junctions || [])
        .filter(j => (j.name || '').toLowerCase().includes(query.toLowerCase()) || (j.junctionName || '').toLowerCase().includes(query.toLowerCase()))
        .map(j => ({ ...j, display_name: j.name || j.junctionName, type: 'junction' }));

      // Use server-side proxy to avoid CORS
      const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const remoteResults = (data.features || []).map((f: any) => ({
        display_name: [f.properties.name, f.properties.city, f.properties.state, f.properties.country].filter(Boolean).join(', '),
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        type: f.properties.type,
        address: f.properties,
        boundingbox: null,
      }));

      setSearchResults([...localResults, ...remoteResults]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchResults.length > 0 && !(e.target as HTMLElement).closest('.search-container')) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchResults]);

  const selectResult = (result: any) => {
    const L = (window as any).L;
    const lat = parseFloat(result.lat || result.latitude);
    const lon = parseFloat(result.lon || result.longitude);

    if (mapInstance.current) {
      if (result.boundingbox) {
        const bb = result.boundingbox;
        mapInstance.current.fitBounds([
          [parseFloat(bb[0]), parseFloat(bb[2])],
          [parseFloat(bb[1]), parseFloat(bb[3])]
        ], { animate: true, padding: [20, 20] });
      } else {
        mapInstance.current.setView([lat, lon], 16, { animate: true });
      }
      if (searchMarkerRef.current) searchMarkerRef.current.remove();
      searchMarkerRef.current = L.marker([lat, lon], {
        icon: L.divIcon({
          className: 'search-marker',
          html: `<div style="width:12px;height:12px;background:#4285F4;border:2px solid white;border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(mapInstance.current);
    }

    if (directionsMode) {
      // Assign to whichever field is focused/active
      if (activeField === 'origin') {
        setOrigin(result);
        setOriginInput(result.display_name);
      } else {
        // Default: fill destination
        setDestination(result);
        setDestInput(result.display_name);
      }
    } else {
      setSelected({
        ...result,
        name: result.display_name,
        trafficLevel: 'moderate',
        avgSpeed: 45
      });
      setDestination(result);
      setDestInput(result.display_name);
    }
    setActiveField(null);
    setSearchResults([]);
    setSearchQuery('');
  };

  const calculateRoute = () => {
    if (!origin || !destination || !mapInstance.current) return;
    const L = (window as any).L;

    if (routingControlRef.current) {
      mapInstance.current.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      waypoints: [
        L.latLng(parseFloat(origin.lat || origin.latitude), parseFloat(origin.lon || origin.longitude)),
        L.latLng(parseFloat(destination.lat || destination.latitude), parseFloat(destination.lon || destination.longitude))
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ 
          color: emergencyMode ? '#ff0000' : '#4285F4', 
          weight: 8, 
          opacity: 0.9,
          dashArray: emergencyMode ? '10, 10' : undefined 
        }]
      }
    }).on('routesfound', (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      setRouteInfo({
        distance: (summary.totalDistance / 1000).toFixed(1),
        duration: Math.round(summary.totalTime / 60)
      });
      setNavigationInstructions(routes[0].instructions);

      // Auto-start navigation if triggered by "Start" button
      if (autoStartRef.current) {
        setNavigationActive(true);
        autoStartRef.current = false;
        if (mapInstance.current && e.routes[0]?.coordinates?.[0]) {
          const originLatLng = e.routes[0].coordinates[0];
          mapInstance.current.setView([originLatLng.lat, originLatLng.lng], 18, { animate: true });
        }
      }
    }).addTo(mapInstance.current);
  };

  const startNavigation = () => {
    if (!routeInfo) return;
    setNavigationActive(true);
    if (mapInstance.current && origin) {
      mapInstance.current.setView([parseFloat(origin.lat || origin.latitude), parseFloat(origin.lon || origin.longitude)], 18, { animate: true });
    }
  };

  useEffect(() => {
    if (origin && destination) {
      calculateRoute();
    }
  }, [origin, destination]);

  const handleStartDirectNavigation = (destinationItem?: any) => {
    // Determine destination (from param or currently selected)
    const dest = (destinationItem && (destinationItem.display_name || destinationItem.name || destinationItem.junctionName)) ? destinationItem : selected;
    if (!dest) return;
    
    setDirectionsMode(true);
    setDestination(dest);
    setDestInput(dest.display_name || dest.junctionName || dest.name);
    setSelected(null);
    setOriginInput("Locating...");
    autoStartRef.current = true; // Auto-start once route is calculated

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loc = { lat, lon, display_name: "My Location" };
          setOrigin(loc);
          setOriginInput("My Location");
        },
        (error) => {
          console.error("Error getting location:", error);
          setOriginInput(""); // Reset so user can type it manually
        }
      );
    } else {
      setOriginInput("");
    }
  };

  const clearDirections = () => {
    setDirectionsMode(false);
    setOrigin(null);
    setDestination(null);
    setRouteInfo(null);
    setOriginInput('');
    setDestInput('');
    setNavigationActive(false);
    setNavigationInstructions([]);
    if (routingControlRef.current && mapInstance.current) {
      mapInstance.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  };

  // Helper for type switching without useEffect
  const toggleMapType = () => {
    const nextType = mapType === 'm' ? 'y' : 'm';
    setMapType(nextType);
    if (mapInstance.current) {
      const L = (window as any).L;
      if (layerInstance.current) layerInstance.current.remove();
      layerInstance.current = L.tileLayer(`https://{s}.google.com/vt/lyrs=${nextType}&x={x}&y={y}&z={z}`, {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(mapInstance.current);
    }
  };

  return (
    <div className="w-full relative h-[700px] bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-2xl border border-sidebar-border">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onLoad={initMap} strategy="afterInteractive" />
      {leafletLoaded && (
        <Script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js" strategy="afterInteractive" />
      )}
      
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Navigation Header (Google Style) */}
      {navigationActive && navigationInstructions.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-[2000] animate-in slide-in-from-top duration-500">
          <div className="bg-[#007b83] p-5 text-white shadow-2xl flex items-center gap-5">
            <div className="w-14 h-14 bg-[#358d92] rounded-2xl flex items-center justify-center shadow-inner border border-white/10">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-white"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold tracking-tight leading-tight">{navigationInstructions[0]?.text || "Head north"}</div>
              <div className="text-sm font-medium opacity-90 mt-1">Continue for 500 meters then turn right</div>
            </div>
            <button 
              onClick={() => {
                setNavigationActive(false);
                setRouteInfo(null);
              }} 
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Google Maps Style Search Bar */}
      <div className={`absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none transition-opacity duration-300 ${navigationActive ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-start gap-3 w-full max-w-[400px] pointer-events-auto search-container">
          {!directionsMode ? (
            <div className="flex-1 relative">
              <div className="bg-white rounded-full shadow-lg p-1.5 pl-5 flex items-center gap-3 border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-blue-400">
                <input 
                  type="text" 
                  placeholder="Search Google Maps" 
                  className="flex-1 bg-transparent border-none outline-none text-[15px] py-1.5"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex items-center gap-1 pr-1">
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
                    </button>
                  )}
                  <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
                  <button onClick={() => setDirectionsMode(true)} className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-600">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M22.43,10.59L13.41,1.58C12.91,1.07 12.22,0.81 11.53,0.81C10.84,0.81 10.15,1.07 9.65,1.58L0.64,10.59C-0.37,11.6 -0.37,13.25 0.64,14.26L9.65,23.27C10.15,23.78 10.84,24.05 11.53,24.05C12.22,24.05 12.91,23.78 13.41,23.27L22.43,14.26C23.44,13.25 23.44,11.6 22.43,10.59M11.53,19.29V15.54H7.78V10.54H11.53V6.79L16.28,11.79L11.53,16.79" /></svg>
                  </button>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {(searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 py-2">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    searchResults.map((result, i) => (
                      <div 
                        key={i}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 group"
                      >
                        <button onClick={() => selectResult(result)} className="flex-1 flex items-start gap-3">
                          <div className="mt-0.5 text-gray-400 shrink-0">
                            {result.type === 'junction' ? (
                              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-blue-500"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" /></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2ZM12,11.5C10.62,11.5 9.5,10.38 9.5,9C9.5,7.62 10.62,6.5 12,6.5C13.38,6.5 14.5,7.62 14.5,9C14.5,10.38 13.38,11.5 12,11.5Z" /></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-medium text-gray-900 truncate">{result.display_name}</div>
                            <div className="text-xs text-gray-500 truncate">{result.type === 'junction' ? 'Live Junction' : result.address?.city || result.address?.state || 'Location'}</div>
                          </div>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartDirectNavigation(result);
                          }} 
                          className="bg-[#1a73e8] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                          Start
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Persistent Start strip — shown after selecting a location */}
              {destination && !directionsMode && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500"><path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2ZM12,11.5C10.62,11.5 9.5,10.38 9.5,9C9.5,7.62 10.62,6.5 12,6.5C13.38,6.5 14.5,7.62 14.5,9C14.5,10.38 13.38,11.5 12,11.5Z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">To</div>
                      <div className="font-bold text-gray-900 truncate text-sm">
                        {destination.display_name || destination.junctionName || destination.name}
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartDirectNavigation(destination)}
                      className="bg-[#1a73e8] text-white px-5 py-2.5 rounded-full font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 shrink-0"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                      Start
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-4 duration-300">
              <div className="bg-[#1a73e8] p-4 text-white">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={clearDirections} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                  </button>
                  <span className="font-medium">Directions</span>
                  <div className="w-8"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white"></div>
                    <input 
                      type="text" 
                      placeholder="Your location" 
                      className="w-full bg-white/10 border-b border-white/30 outline-none text-white placeholder:text-white/60 py-1.5 pl-6 text-sm"
                      value={originInput}
                      onFocus={() => setActiveField('origin')}
                      onChange={(e) => {
                        setOriginInput(e.target.value);
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white"></div>
                    <input 
                      type="text" 
                      placeholder="Choose destination..." 
                      className="w-full bg-white/10 border-none outline-none text-white placeholder:text-white/60 py-1.5 pl-6 text-sm"
                      value={destInput}
                      onFocus={() => setActiveField('destination')}
                      onChange={(e) => {
                        setDestInput(e.target.value);
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Start button — visible as soon as both fields are filled */}
              {originInput && destInput && (
                <button
                  onClick={() => {
                    if (routeInfo) {
                      startNavigation();
                    } else {
                      autoStartRef.current = true;
                      calculateRoute();
                    }
                  }}
                  className="mx-4 mb-3 mt-3 w-[calc(100%-2rem)] bg-[#1a73e8] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all active:scale-95 text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                  Start Navigation
                </button>
              )}

              {/* Directions Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="max-h-[200px] overflow-y-auto">
                  {searchResults.map((result, i) => (
                    <button 
                      key={i}
                      onClick={() => selectResult(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="mt-0.5 text-gray-400">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2ZM12,11.5C10.62,11.5 9.5,10.38 9.5,9C9.5,7.62 10.62,6.5 12,6.5C13.38,6.5 14.5,7.62 14.5,9C14.5,10.38 13.38,11.5 12,11.5Z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{result.display_name}</div>
                        <div className="text-xs text-gray-500 truncate">{result.address?.city || result.address?.state || 'Location'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!directionsMode && (
            <button className="bg-white rounded-full shadow-lg p-3 text-blue-600 hover:bg-blue-50 transition-colors pointer-events-auto shrink-0 border border-gray-100">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-6c-2.33 0-4.31.52-6.06 1.27C7.39 12.18 9.6 13 12 13s4.61-.82 6.06-1.73C16.31 10.52 14.33 10 12 10z" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Route Info Panel (Google Style) */}
      {routeInfo && !navigationActive && (
        <div className="absolute bottom-6 left-4 right-4 z-[1001] animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.1)] p-6 border border-gray-100 flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#00c853] rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-green-100">
                <span className="text-2xl font-black leading-none">{routeInfo.duration}</span>
                <span className="text-[10px] uppercase font-black tracking-tighter">min</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-gray-900 leading-none">{routeInfo.distance} km</div>
                <div className={`text-[13px] font-bold mt-1 leading-tight ${emergencyMode ? 'text-red-600 animate-pulse' : 'text-[#00c853]'}`}>
                  {emergencyMode ? 'EMERGENCY PRIORITY: Avoids major congestion' : 'Fastest route now due to traffic'}
                </div>
              </div>
            </div>
            <button 
              onClick={startNavigation}
              className="bg-[#1a73e8] text-white pl-4 pr-7 py-3.5 rounded-full font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
              Start
            </button>
          </div>
        </div>
      )}

      {/* Layer Toggle */}
      <div className="absolute right-4 bottom-6 z-[1000] flex flex-col gap-3">
        <button onClick={() => {
          if (mapInstance.current) {
            mapInstance.current.locate({setView: true, maxZoom: 16});
          }
        }} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 border border-gray-100 transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13Z" /></svg>
        </button>
        <button onClick={toggleMapType} className="w-14 h-14 rounded-2xl shadow-xl border-2 border-white overflow-hidden group relative transition-transform hover:scale-105">
          <img src={mapType === 'm' ? 'https://mt1.google.com/vt/lyrs=y&x=4688&y=5474&z=13' : 'https://mt1.google.com/vt/lyrs=m&x=4688&y=5474&z=13'} alt="Layers" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-end p-1 justify-center">
            <span className="text-[9px] font-black text-white uppercase tracking-tighter">Layers</span>
          </div>
        </button>
        <button 
          onClick={() => {
            setEmergencyMode(prev => !prev);
            if (origin && destination) calculateRoute();
          }} 
          className={`w-14 h-14 rounded-2xl shadow-xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${emergencyMode ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-white border-gray-100 text-gray-600'}`}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current mb-0.5"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" /></svg>
          <span className="text-[8px] font-black uppercase leading-none">{emergencyMode ? 'ACTIVE' : 'SOS'}</span>
        </button>
      </div>

      {selected && !directionsMode && (
        <div className="absolute bottom-6 left-4 right-4 z-[1001] max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex gap-4 animate-in slide-in-from-bottom-4">
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shrink-0 shadow-lg ${selected.trafficLevel === 'severe' ? 'bg-red-500 shadow-red-100' : 'bg-green-500 shadow-green-100'}`}>
              <span className="text-lg leading-none">{selected.avgSpeed || 45}</span>
              <span className="text-[10px] uppercase">km/h</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 truncate">{selected.display_name || selected.junctionName || selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg></button>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">Live</div>
                <div className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">Verified</div>
              </div>
              <div className="flex gap-2 mt-3 w-full">
                <button 
                  onClick={() => {
                    setDirectionsMode(true);
                    setDestination(selected);
                    setDestInput(selected.display_name || selected.junctionName || selected.name);
                    setSelected(null);
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M22.43,10.59L13.41,1.58C12.91,1.07 12.22,0.81 11.53,0.81C10.84,0.81 10.15,1.07 9.65,1.58L0.64,10.59C-0.37,11.6 -0.37,13.25 0.64,14.26L9.65,23.27C10.15,23.78 10.84,24.05 11.53,24.05C12.22,24.05 12.91,23.78 13.41,23.27L22.43,14.26C23.44,13.25 23.44,11.6 22.43,10.59M11.53,19.29V15.54H7.78V10.54H11.53V6.79L16.28,11.79L11.53,16.79" /></svg>
                  Directions
                </button>
                <button 
                  onClick={handleStartDirectNavigation}
                  className="flex-1 bg-[#1a73e8] text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Currently Viewing Overlay */}
      {viewingLocation && !navigationActive && (
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-800">{viewingLocation}</span>
          </div>
        </div>
      )}

      {/* Re-center Button */}
      {(navigationActive || viewingLocation) && (
        <button 
          onClick={() => {
            if (mapInstance.current) {
              if (navigationActive && origin) {
                mapInstance.current.setView([parseFloat(origin.lat || origin.latitude), parseFloat(origin.lon || origin.longitude)], 18, { animate: true });
              } else {
                mapInstance.current.locate({setView: true, maxZoom: 16});
              }
            }
          }}
          className="absolute left-1/2 -translate-x-1/2 bottom-[100px] z-[1000] bg-white text-blue-600 px-6 py-2.5 rounded-full shadow-2xl border border-blue-50 font-black flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95 animate-in slide-in-from-bottom-4"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13Z" /></svg>
          Re-center
        </button>
      )}

      <div className="absolute bottom-1 left-2 pointer-events-none z-[1000] opacity-80 font-bold text-gray-500 text-[10px]">Google</div>

      {!isLoaded && (
        <div className="absolute inset-0 bg-[#f8f9fa] z-[2000] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading World Map...
          </div>
        </div>
      )}
    </div>
  );
}
