import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Review } from '../types/tour';
import { getReviewsByTour } from '../services/getReviewsByTour';

export function useReviewsByTour(tourId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['reviews', tourId];

  // Query inicial
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!tourId) return [];
      
      return new Promise<Review[]>(() => {

        // La promesa se resuelve inmediatamente con los primeros datos
        // El listener continúa activo para updates
      });
    },
    enabled: !!tourId,
    staleTime: Infinity, // Los datos nunca se vuelven stale porque usamos real-time
    refetchOnWindowFocus: false,
  });

  // Subscription para real-time updates
  useEffect(() => {
    if (!tourId) return;

    const unsubscribe = getReviewsByTour.getReviewsByTour(
      tourId,
      (reviewsData) => {
        // Actualiza la cache con los nuevos datos
        queryClient.setQueryData(queryKey, reviewsData);
      },
      (err) => {
        console.error('Error in reviews subscription:', err);
      }
    );

    return () => unsubscribe();
  }, [tourId, queryClient, queryKey]);

  const averageRating = reviews.length > 0 
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return { 
    data: reviews,
    isLoading, 
    error: error?.message || null,
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution
  };
}