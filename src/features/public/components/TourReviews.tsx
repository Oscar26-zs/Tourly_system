import { useParams } from 'react-router-dom';
import { useReviewsByTour } from '../hooks/useReviewsByTour';
import { useTranslation } from 'react-i18next';

interface TourReviewsProps {
  averageRating?: number;
  totalReviews?: number;
}

export function TourReviews({  }: TourReviewsProps) {
  const { tourId } = useParams<{ tourId: string }>();
  const { data: reviews, isLoading, error, averageRating, totalReviews, ratingDistribution } = useReviewsByTour(tourId || '');
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t('public.reviews.today');
    if (diffInDays === 1) return t('public.reviews.oneDayAgo');
    if (diffInDays < 7) return t('public.reviews.daysAgo', { count: diffInDays });
    if (diffInDays < 30) return t('public.reviews.weeksAgo', { count: Math.floor(diffInDays / 7) });
    if (diffInDays < 365) return t('public.reviews.monthsAgo', { count: Math.floor(diffInDays / 30) });
    return t('public.reviews.yearsAgo', { count: Math.floor(diffInDays / 365) });
  };

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

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return t('public.reviews.ratingLabels.excellent');
    if (rating >= 4) return t('public.reviews.ratingLabels.veryGood');
    if (rating >= 3.5) return t('public.reviews.ratingLabels.good');
    if (rating >= 2.5) return t('public.reviews.ratingLabels.fair');
    return t('public.reviews.ratingLabels.poor');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-white text-lg">{t('public.reviews.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {t('public.reviews.errorLoading')}: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resumen de reviews */}
      <div className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-2xl font-bold text-white">{averageRating || 0}</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">{getRatingLabel(averageRating)}</span>
            <span className="text-gray-400 ml-2">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
          </div>
        </div>
        
        {/* Distribución de estrellas */}
        {totalReviews > 0 && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution];
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-8">{stars} ★</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">
          {t('public.reviews.guestReviews', { count: totalReviews })}
        </h3>
        
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-lg">
                    {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                
                {/* Contenido del review */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{review.userName || 'Anonymous'}</h4>
                    <span className="text-gray-400 text-sm">{formatDate(review.createdAt)}</span>
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
          ))
        ) : (
          <div className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">{t('public.reviews.noReviewsYet')}</p>
            <p className="text-gray-500 mt-2">{t('public.reviews.beFirst')}</p>
          </div>
        )}
      </div>

      {/* Botón para ver más reviews - solo si hay reviews */}
      {reviews.length > 3 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-black/20 backdrop-blur-sm border border-gray-700/30 text-white rounded-lg hover:cursor-pointer hover:bg-black/30 transition-all duration-200">
            {t('public.reviews.showAllReviews', { total: totalReviews })}
          </button>
        </div>
      )}
    </div>
  );
}