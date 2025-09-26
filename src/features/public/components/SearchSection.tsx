import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, DollarSign, Search, X } from 'lucide-react';
import type { SearchFilters } from '../types/filters';
import { useCities } from '../hooks/useCities';

interface SearchSectionProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchSection({ onFiltersChange }: SearchSectionProps) {
  const [locationInput, setLocationInput] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [priceInput, setPriceInput] = useState<string>('');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const { cities, popularDestinations, isLoading: citiesLoading } = useCities();

  const durations = [1, 2, 3, 4, 6, 8, 12]; // horas

  // Filtrar ubicaciones basándose en el input usando datos dinámicos
  const filteredLocations = locationInput.trim() 
    ? cities.filter(location =>
        location.toLowerCase().includes(locationInput.toLowerCase())
      ).slice(0, 8) // Máximo 8 cuando hay filtro de texto
    : cities.slice(0, 10); // Mostrar las primeras 10 ciudades cuando no hay texto

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cerrar dropdown de ubicaciones si se hace click fuera
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
      
      // Cerrar dropdown de duración si se hace click fuera del contenedor principal
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDurationDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const filters: SearchFilters = {};
    
    if (locationInput.trim()) filters.location = locationInput.trim();
    if (selectedDuration) filters.duration = selectedDuration;
    if (priceInput.trim()) {
      const price = parseFloat(priceInput);
      if (!isNaN(price) && price > 0) filters.maxPrice = price;
    }
    
    onFiltersChange(filters);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setShowDurationDropdown(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    // Mostrar sugerencias siempre que el input esté enfocado
    setShowLocationSuggestions(true);
    setSelectedSuggestionIndex(-1);
  };

  const handleLocationSelect = (location: string) => {
    setLocationInput(location);
    setShowLocationSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleLocationFocus = () => {
    // Mostrar sugerencias al hacer focus, incluso sin texto
    setShowLocationSuggestions(true);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showLocationSuggestions || filteredLocations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredLocations.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredLocations.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleLocationSelect(filteredLocations[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowLocationSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y punto decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPriceInput(value);
    }
  };

  const handlePopularDestination = (destination: string) => {
    setLocationInput(destination);
    const filters: SearchFilters = { location: destination };
    if (selectedDuration) filters.duration = selectedDuration;
    if (priceInput.trim()) {
      const price = parseFloat(priceInput);
      if (!isNaN(price) && price > 0) filters.maxPrice = price;
    }
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setLocationInput('');
    setSelectedDuration(null);
    setPriceInput('');
    setShowLocationSuggestions(false);
    setShowDurationDropdown(false);
    setSelectedSuggestionIndex(-1);
    
    // Notificar al componente padre que se limpiaron los filtros
    onFiltersChange({});
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = locationInput.trim() || selectedDuration || priceInput.trim();
  return (
    <div 
      ref={searchRef}
      className="w-[882px] h-96 p-6 bg-neutral-900 border border-neutral-700 rounded-[10px] flex flex-col justify-center items-center gap-11 shadow-xl shadow-black/20"
    >
      {/* Search Form */}
      <div className="w-[826px] flex justify-center items-end gap-6">
        {/* Where to? */}
        <div ref={locationRef} className="w-72 flex flex-col justify-start items-start gap-2.5 relative">
          <div className="self-stretch text-white text-2xl font-medium font-inter flex items-center gap-2">
            Where to?
            {locationInput.trim() && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
          <div className="self-stretch p-2.5 bg-stone-900 border border-neutral-600 rounded-[10px] flex items-center gap-3.5 hover:bg-stone-800 hover:border-neutral-500 transition-all duration-300">
            <MapPin className="w-6 h-6 text-green-700 flex-shrink-0" />
            <input
              type="text"
              value={locationInput}
              onChange={handleLocationChange}
              onFocus={handleLocationFocus}
              onKeyDown={handleLocationKeyDown}
              placeholder="Click to see destinations"
              className="flex-1 bg-transparent text-white text-xl font-light font-poppins placeholder-zinc-400 outline-none"
            />
          </div>
          
          {/* Location Suggestions */}
          {showLocationSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-stone-900 border border-neutral-600 rounded-[10px] z-20 max-h-60 overflow-y-auto shadow-xl">
              {citiesLoading ? (
                <div className="p-3 text-zinc-400 text-sm">Loading locations...</div>
              ) : filteredLocations.length > 0 ? (
                <>
                  {!locationInput.trim() && (
                    <div className="p-2 text-zinc-500 text-xs border-b border-neutral-700 bg-stone-800">
                      Available destinations (sorted by popularity)
                    </div>
                  )}
                  {filteredLocations.map((location, index) => (
                    <div
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className={`p-3 text-white cursor-pointer border-b border-neutral-700 last:border-b-0 flex items-center gap-2 transition-colors ${
                        index === selectedSuggestionIndex ? 'bg-green-700/30' : 'hover:bg-stone-800'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-green-700" />
                      <span>{location}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-3 text-zinc-400 text-sm">
                  No locations found matching "{locationInput}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="w-32 flex flex-col justify-start items-start gap-2.5 relative">
          <div className="self-stretch text-white text-2xl font-medium font-inter flex items-center gap-2">
            Duration?
            {selectedDuration && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
          <div 
            onClick={() => setShowDurationDropdown(!showDurationDropdown)}
            className="self-stretch p-2.5 bg-stone-900 border border-neutral-600 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:bg-stone-800 hover:border-neutral-500 transition-all duration-300"
          >
            <Clock className="w-6 h-6 text-green-700" />
            <div className="text-zinc-400 text-xl font-light font-poppins">
              {selectedDuration ? `${selectedDuration}h` : "1 hour?"}
            </div>
          </div>
          
          {/* Duration Dropdown */}
          {showDurationDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-stone-900 border border-neutral-600 rounded-[10px] z-20 max-h-60 overflow-y-auto">
              {durations.map((duration) => (
                <div
                  key={duration}
                  onClick={() => handleDurationSelect(duration)}
                  className="p-3 text-white hover:bg-stone-800 cursor-pointer border-b border-neutral-700 last:border-b-0"
                >
                  {duration} hour{duration > 1 ? 's' : ''}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="w-32 flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch text-white text-2xl font-medium font-inter flex items-center gap-2">
            Max Price
            {priceInput.trim() && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
          <div className="self-stretch p-2.5 bg-stone-900 border border-neutral-600 rounded-[10px] flex items-center gap-3.5 hover:bg-stone-800 hover:border-neutral-500 transition-all duration-300">
            <DollarSign className="w-6 h-6 text-green-700 flex-shrink-0" />
            <input
              type="text"
              value={priceInput}
              onChange={handlePriceChange}
              placeholder="Enter max price"
              className="flex-1 bg-transparent text-white text-xl font-light font-poppins placeholder-zinc-400 outline-none"
            />
          </div>
        </div>

        {/* Search and Clear Buttons */}
        <div className="flex flex-col gap-2">
          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="px-3.5 py-2.5 bg-green-700 hover:bg-green-600 rounded-[10px] flex justify-start items-center gap-2.5 transition-all duration-300 shadow-lg shadow-green-700/30 transform hover:scale-105"
          >
            <Search className="w-6 h-6 text-white" />
            <div className="text-white text-xl font-medium font-poppins">Search Tours</div>
          </button>
          
          {/* Clear Filters Button - Solo se muestra si hay filtros activos */}
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters}
              className="px-3.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-[10px] flex justify-center items-center gap-2 transition-all duration-300"
            >
              <X className="w-4 h-4 text-zinc-400" />
              <div className="text-zinc-400 text-sm font-medium font-poppins">Clear Filters</div>
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-[750px] h-px bg-neutral-600" />

      {/* Popular Destinations */}
      <div className="w-[750px] flex flex-col justify-start items-center gap-7">
        <div className="self-stretch text-center text-zinc-400 text-xl font-medium font-poppins">Popular Destinations</div>
        <div className="self-stretch flex justify-center items-center gap-11 flex-wrap">
          {citiesLoading ? (
            <div className="text-zinc-500 text-lg">Loading destinations...</div>
          ) : popularDestinations.length > 0 ? (
            popularDestinations.map((destination) => (
              <div 
                key={destination}
                onClick={() => handlePopularDestination(destination)}
                className="cursor-pointer hover:text-green-600 transition-colors"
              >
                <div className="text-center text-green-700 text-xl font-medium font-poppins">
                  {destination}
                </div>
              </div>
            ))
          ) : (
            <div className="text-zinc-500 text-lg">No destinations available</div>
          )}
        </div>
      </div>
    </div>
  );
}