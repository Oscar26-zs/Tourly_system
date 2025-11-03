import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../app/config/firebase';

export async function fetchActiveSlots() {
  const col = collection(db, 'slot');
  // traer solo activos
  const q = query(col, where('activo', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}
