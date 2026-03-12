import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebaseUtils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch profile
        const profileRef = doc(db, 'users', currentUser.uid);
        try {
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            setProfile(profileSnap.data());
          } else {
            // Create initial profile if it doesn't exist
            const initialProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              bio: '',
              education: [],
              workExperience: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(profileRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }

        // Listen for profile changes
        const unsubProfile = onSnapshot(profileRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data());
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { user, profile, loading, login, logout };
}
