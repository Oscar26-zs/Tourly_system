import { createContext } from "react";
import type { User as FirebaseUser } from "firebase/auth";

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });