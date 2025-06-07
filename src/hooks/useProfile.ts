
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Create demo profile from user data
      const demoProfile: Profile = {
        id: user.id,
        username: user.username || 'demo_user',
        full_name: user.full_name || 'Demo User',
        avatar_url: 'https://via.placeholder.com/150?text=Demo',
        bio: 'Comic creator using ComicCosmos demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(demoProfile);
    } else {
      setProfile(null);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return { error: new Error('No profile found') };
    
    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updatedProfile);
    
    return { error: null };
  };

  return {
    profile,
    loading,
    updateProfile
  };
};
