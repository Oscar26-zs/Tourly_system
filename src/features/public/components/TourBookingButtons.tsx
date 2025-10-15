import { useNavigate } from 'react-router-dom';

interface TourBookingButtonsProps {
  price: number;
  onBookNow?: () => void;
  onCancel?: () => void;
  slotId?: string; // optional slotId to navigate to BookingForm
}

export function TourBookingButtons({ price, onBookNow, onCancel, slotId }: TourBookingButtonsProps) {
  const navigate = useNavigate();

  const handleBook = () => {
    // Navegar siempre a la página de BookingForm.
    // Si tenemos slotId lo pasamos como query param para que la página cargue el slot específico.
    if (slotId) {
      onBookNow && onBookNow();
      navigate(`/BookingForm`);
      return;
    }
    onBookNow && onBookNow();
    navigate('/BookingForm');
  };

  return (
    <div className="rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleBook}
          className="flex-1 bg-green-700 hover:bg-green-600 text-white font-inter font-medium py-4 px-6 hover:cursor-pointer rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-700/30 hover:scale-[1.02] active:scale-[0.98] text-lg"
        >
          Book now - ${price}

        </button>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}