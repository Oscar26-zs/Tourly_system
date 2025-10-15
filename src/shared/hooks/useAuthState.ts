import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "../../app/config/firebase";

export function useAuthState() {
  const [user, setUser] = useState<import("firebase/firestore").DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore(firebaseApp);
        const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
        setUser(userDoc.exists() ? userDoc.data() : null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}