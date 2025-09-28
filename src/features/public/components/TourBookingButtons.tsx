interface TourBookingButtonsProps {
  price: number;
  onBookNow: () => void;
  onCancel?: () => void;
}

export function TourBookingButtons({ price, onBookNow, onCancel }: TourBookingButtonsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBookNow}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
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
      
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          <span className="text-green-400">✓</span> Free cancellation up to 24 hours before
        </p>
        <p className="text-gray-400 text-sm">
          <span className="text-green-400">✓</span> Reserve now and pay later
        </p>
      </div>
    </div>
  );
}