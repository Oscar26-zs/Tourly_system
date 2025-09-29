import { MapPin, Clock, DollarSign, Search, X } from 'lucide-react';
import type { SearchFilters } from '../types/filters';
import { useSearchSection } from '../hooks/useSearchSection';

interface SearchSectionProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchSection({ onFiltersChange }: SearchSectionProps) {
  const {
    // Estados del formulario
    locationInput,
    selectedDuration,
    priceInput,
    
    // Estados de UI
    showDurationDropdown,
    showLocationSuggestions,
    selectedSuggestionIndex,
    
    // Referencias
    searchRef,
    locationRef,
    
    // Datos
    filteredLocations,
    citiesLoading,
    durations,
    popularDestinations,
    hasActiveFilters,
    
    // Handlers
    handleSearch,
    handleDurationSelect,
    handleLocationChange,
    handleLocationSelect,
    handleLocationFocus,
    handleLocationKeyDown,
    handlePriceChange,
    handlePopularDestination,
    handleClearFilters,
    
    // Setters de UI
    setShowDurationDropdown,
  } = useSearchSection({ onFiltersChange });

  return (
    <div 
      ref={searchRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="bg-neutral-900 border border-neutral-700 rounded-[10px] p-6 shadow-xl shadow-black/20">
        {/* Search Form */}
        <div className="flex flex-col lg:flex-row justify-center items-end gap-6 mb-8">
          {/* Where to? */}
          <div ref={locationRef} className="w-full lg:w-72 flex flex-col justify-start items-start gap-2.5 relative">
            <div className="self-stretch text-white text-xl lg:text-2xl font-medium font-inter flex items-center gap-2">
              Where to?
              {locationInput.trim() && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </div>
            <div className="self-stretch p-2.5 bg-stone-900 border border-neutral-600 rounded-[10px] flex items-center gap-3.5 hover:bg-stone-800 hover:border-neutral-500 transition-all duration-300">
              <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-green-700 flex-shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={handleLocationChange}
                onFocus={handleLocationFocus}
                onKeyDown={handleLocationKeyDown}
                placeholder="Click to see destinations"
                className="flex-1 bg-transparent text-white text-lg lg:text-xl font-light font-poppins placeholder-zinc-400 outline-none"
              />
            </div>
            
            {/* Location Suggestions */}
            {showLocationSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-stone-900 border border-neutral-600 rounded-[10px] z-20 max-h-60 overflow-y-auto shadow-xl">
                {citiesLoading ? (
                  <div className="p-3 text-zinc-400 text-sm">Cargando ubicaciones...</div>
                ) : filteredLocations.length > 0 ? (
                  <>
                    {!locationInput.trim() && (
                      <div className="p-2 text-zinc-500 text-xs border-b border-neutral-700 bg-stone-800">
                        Ubicaciones disponibles en Costa Rica
                      </div>
                    )}
                    {filteredLocations.map((location, index) => (
                      <div
                        key={location.id}
                        onClick={() => handleLocationSelect(location.name)}
                        className={`p-3 text-white cursor-pointer border-b border-neutral-700 last:border-b-0 flex items-center gap-2 transition-colors ${
                          index === selectedSuggestionIndex ? 'bg-green-700/30' : 'hover:bg-stone-800'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-green-700" />
                        <div className="flex flex-col">
                          <span className="text-sm">{location.name}</span>
                          <span className="text-xs text-zinc-400">{location.fullName}</span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-3 text-zinc-400 text-sm">
                    No se encontraron ubicaciones que coincidan con "{locationInput}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="w-full lg:w-48 flex flex-col justify-start items-start gap-2.5 relative">
            <div className="self-stretch text-white text-xl lg:text-2xl font-medium font-inter flex items-center gap-2">
              Duration?
              {selectedDuration && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </div>
            <div 
              onClick={() => setShowDurationDropdown(!showDurationDropdown)}
              className="self-stretch p-2.5 bg-stone-900 border border-neutral-600 rounded-[10px] flex justify-center items-center gap-3.5 cursor-pointer hover:bg-stone-800 hover:border-neutral-500 transition-all duration-300"
            >
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-green-700" />
              <div className="text-zinc-400 text-lg lg:text-xl font-light font-poppins">
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
          <div className="w-full lg:w-48 flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch text-white text-xl lg:text-2xl font-medium font-inter flex items-center gap-2">
              Max Price
              {priceInput.trim() && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </div>
            <div className="self-stretch p-2.5 bg-stone-900 border border-neutral-600 rounded-[10px] flex items-center gap-3.5 hover:bg-stone-800 hover:border-neutral-500 transition-all duration-300">
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-700 flex-shrink-0" />
              <input
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="Enter max price"
                className="flex-1 bg-transparent text-white text-lg lg:text-xl font-light font-poppins placeholder-zinc-400 outline-none"
              />
            </div>
          </div>

          {/* Search and Clear Buttons */}
          <div className="w-full lg:w-auto flex flex-col gap-2">
            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="px-3.5 py-2.5 bg-green-700 hover:bg-green-600 rounded-[10px] flex justify-center items-center gap-2.5 transition-all duration-300 shadow-lg shadow-green-700/30 transform hover:scale-105 w-full lg:w-auto"
            >
              <Search className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              <div className="text-white text-lg lg:text-xl font-medium font-poppins">Search Tours</div>
            </button>
            
            {/* Clear Filters Button - Solo se muestra si hay filtros activos */}
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-[10px] flex justify-center items-center gap-2 transition-all duration-300 w-full lg:w-auto"
              >
                <X className="w-4 h-4 text-zinc-400" />
                <div className="text-zinc-400 text-sm font-medium font-poppins">Clear Filters</div>
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-600 mb-8" />

        {/* Popular Destinations */}
        <div className="flex flex-col justify-start items-center gap-7">
          <div className="text-center text-zinc-400 text-lg lg:text-xl font-medium font-poppins">
            Destinos Populares en Costa Rica
          </div>
          <div className="flex justify-center items-center gap-4 lg:gap-11 flex-wrap">
            {citiesLoading ? (
              <div className="text-zinc-500 text-lg">Cargando destinos...</div>
            ) : popularDestinations.length > 0 ? (
              popularDestinations.map((destination) => (
                <div 
                  key={destination}
                  onClick={() => handlePopularDestination(destination)}
                  className="cursor-pointer hover:text-green-600 transition-colors px-2 py-1"
                >
                  <div className="text-center text-green-700 text-lg lg:text-xl font-medium font-poppins">
                    {destination}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 text-lg">No hay destinos disponibles</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}