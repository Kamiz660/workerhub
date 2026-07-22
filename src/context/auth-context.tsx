"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  logIn,
  signUp,
  logOut,
  UserProfile,
} from "@/features/auth/auth-service";

export interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => ReturnType<typeof logIn>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => ReturnType<typeof signUp>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const result = await logIn({ email, password });
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    const result = await signUp({ name, email, password });
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
