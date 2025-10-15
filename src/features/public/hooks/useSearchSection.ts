import { useState, useEffect, useRef, useMemo } from 'react';
import type { SearchFilters } from '../types/filters';
import { useCostaRicaLocations } from '../../../shared/hooks/useCostaRicaLocations';

interface UseSearchSectionProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export function useSearchSection({ onFiltersChange }: UseSearchSectionProps) {
  // Estados del formulario
  const [locationInput, setLocationInput] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [priceInput, setPriceInput] = useState<string>('');
  
  // Estados de UI
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Referencias
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  
  // Hook de ubicaciones de Costa Rica
  const { 
    filteredLocations, 
    isLoading: citiesLoading, 
    filterByText,
    getPopularDestinations 
  } = useCostaRicaLocations();

  // Configuración
  const durations = [1, 2, 3, 4, 6, 8, 12]; // horas
  const popularDestinations = useMemo(() => getPopularDestinations(), [getPopularDestinations]);

  // Usar el filtro de ubicaciones del hook
  useEffect(() => {
    filterByText(locationInput);
  }, [locationInput, filterByText]);

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

  // Handlers del formulario
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
          handleLocationSelect(filteredLocations[selectedSuggestionIndex].name);
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

  // Estados computados
  const hasActiveFilters = locationInput.trim() || selectedDuration || priceInput.trim();

  return {
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
    setShowLocationSuggestions,
    setSelectedSuggestionIndex,
  };
}