interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
}

interface TourReviewsProps {
  averageRating: number;
  totalReviews: number;
}

export function TourReviews({ averageRating, totalReviews }: TourReviewsProps) {
  // Datos de ejemplo para las reseñas
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Amazing experience! The horses were well-trained and the guide was very knowledgeable. The beach views were absolutely stunning. Highly recommend for anyone visiting the area!'
    },
    {
      id: '2',
      userName: 'Miguel Rodriguez',
      rating: 5,
      date: '1 month ago',
      comment: 'Perfect tour for beginners! I had never ridden a horse before, but the guide made me feel safe and comfortable. The scenery was breathtaking and the whole experience was unforgettable.'
    },
    {
      id: '3',
      userName: 'Emma Thompson',
      rating: 4,
      date: '1 month ago',
      comment: 'Great tour overall. The horses were gentle and the route was beautiful. Only minor issue was that it started a bit late, but the guide made up for it with great stories and knowledge about the area.'
    },
    {
      id: '4',
      userName: 'Carlos Mendez',
      rating: 5,
      date: '2 months ago',
      comment: 'Incredible! This was the highlight of our Costa Rica trip. The guide was fantastic, the horses were amazing, and riding along the beach at sunset was magical. Will definitely do this again!'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-8">
      {/* Resumen de reviews */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-2xl font-bold text-white">{averageRating}</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">Excellent</span>
            <span className="text-gray-400 ml-2">({totalReviews} reviews)</span>
          </div>
        </div>
        
        {/* Distribución de estrellas */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-8">{stars} ★</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ 
                    width: `${stars === 5 ? 75 : stars === 4 ? 20 : stars === 3 ? 5 : 0}%` 
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-400 w-8">
                {stars === 5 ? '75%' : stars === 4 ? '20%' : stars === 3 ? '5%' : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Guest Reviews</h3>
        
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-lg">
                  {review.userName.charAt(0)}
                </span>
              </div>
              
              {/* Contenido del review */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{review.userName}</h4>
                  <span className="text-gray-400 text-sm">{review.date}</span>
                </div>
                
                {/* Estrellas */}
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                
                {/* Comentario */}
                <p className="text-gray-300 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para ver más reviews */}
      <div className="text-center">
        <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
          Show more reviews
        </button>
      </div>
    </div>
  );
}