import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext({});

const config = {
  androidClientId:
    "432790334595-pedtv1vvii1mj8nfr9fbphoona3rdhmf.apps.googleusercontent.com",
  iosClientId:
    "432790334595-6ho75cctsvaj6q9io5lp5td45ac0q93j.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //Logged in...
          setUser(user);
        } else {
          setUser(null);
        }
        setLoadingInitial(false);
      }),
    []
  );

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user: user,
      error,
      loading,
      logout,
      signInWithGoogle,
    }),
    [user, loading, error]
  );

  async function signInWithGoogle() {
    setLoading(true);

    try {
      const result = await Google.logInAsync(config);
      if (result.type === "success") {
        //Login
        const { idToken, accessToken } = result;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        await signInWithCredential(auth, credential);
      } else {
        //return { cancelled: true };
        return Promise.reject();
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
