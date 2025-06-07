
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { username?: string; full_name?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@comiccosmos.com',
  username: 'demo_user',
  full_name: 'Demo User'
};

const DEMO_CREDENTIALS = {
  email: 'demo@comiccosmos.com',
  password: 'demo123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData?: { username?: string; full_name?: string }) => {
    // For demo purposes, always succeed if using demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const newUser = { ...DEMO_USER, ...userData };
      setUser(newUser);
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to ComicCosmos!",
      });
      return { error: null };
    }

    toast({
      title: "Demo Mode",
      description: `Please use demo credentials: ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`,
      variant: "destructive"
    });

    return { error: new Error('Please use demo credentials') };
  };

  const signIn = async (email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser(DEMO_USER);
      localStorage.setItem('demo_user', JSON.stringify(DEMO_USER));
      
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      return { error: null };
    }

    toast({
      title: "Invalid credentials",
      description: `Demo credentials: ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`,
      variant: "destructive"
    });

    return { error: new Error('Invalid credentials') };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('demo_user');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const resetPassword = async (email: string) => {
    toast({
      title: "Demo Mode",
      description: "Password reset is not available in demo mode.",
    });
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
