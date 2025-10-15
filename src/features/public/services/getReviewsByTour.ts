import { collection, query, orderBy, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '../../../app/config/firebase';
import type { Review } from '../types/tour';

export const getReviewsByTour = {
  getReviewsByTour: (
    tourId: string,
    onSuccess: (reviews: Review[]) => void,
    onError: (error: Error) => void
  ): Unsubscribe => {
    const reviewsRef = collection(db, 'tours', tourId, 'reseñas');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, 
      (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Review[];
        
        onSuccess(reviewsData);
      },
      (error) => {
        onError(error as Error);
      }
    );
  }
};