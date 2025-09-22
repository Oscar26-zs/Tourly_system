import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Tour } from '../features/public/types/tour';

export const getTourById = async (id: string): Promise<Tour> => {
  console.log('🔍 getTourById - Fetching tour with ID:', id);
  
  if (!id) {
    throw new Error('Tour ID is required');
  }

  try {
    const tourDoc = doc(db, 'tours', id);
    const tourSnapshot = await getDoc(tourDoc);

    if (!tourSnapshot.exists()) {
      console.log('❌ getTourById - Tour not found with ID:', id);
      throw new Error('Tour not found');
    }

    const data = tourSnapshot.data();
    const tour: Tour = {
      id: tourSnapshot.id,
      ...data,
    } as Tour;

    console.log('✅ getTourById - Tour found:', tour.titulo);
    return tour;
  } catch (error) {
    console.error('❌ getTourById - Error fetching tour:', error);
    throw error;
  }
};