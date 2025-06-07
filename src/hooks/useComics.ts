
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Comic {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  cover_image?: string;
  genre?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at?: string;
  tags?: string[];
}

interface CreateComicData {
  title: string;
  description?: string;
  genre?: string;
  cover_image?: string;
}

const DEMO_COMICS: Comic[] = [
  {
    id: 'demo-comic-1',
    creator_id: 'demo-user-123',
    title: 'The Cosmic Heroes',
    description: 'An epic adventure through space and time',
    genre: 'sci-fi',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['space', 'adventure', 'heroes']
  },
  {
    id: 'demo-comic-2',
    creator_id: 'demo-user-123',
    title: 'Mystery of the Digital Realm',
    description: 'A cyberpunk thriller in the digital age',
    genre: 'cyberpunk',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['cyberpunk', 'mystery', 'digital']
  }
];

export const useComics = () => {
  const { user } = useAuth();
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load demo comics
      setComics(DEMO_COMICS);
    } else {
      setComics([]);
    }
  }, [user]);

  const createComic = async (comicData: CreateComicData) => {
    if (!user) return { error: new Error('User not authenticated') };

    const newComic: Comic = {
      id: `demo-comic-${Date.now()}`,
      creator_id: user.id,
      ...comicData,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setComics(prev => [newComic, ...prev]);
    
    toast({
      title: "Comic created",
      description: "Your comic has been created successfully.",
    });

    return { data: newComic, error: null };
  };

  const updateComic = async ({ id, updates }: { id: string; updates: Partial<Comic> }) => {
    setComics(prev => prev.map(comic => 
      comic.id === id 
        ? { ...comic, ...updates, updated_at: new Date().toISOString() }
        : comic
    ));

    toast({
      title: "Comic updated",
      description: "Your comic has been updated successfully.",
    });

    return { error: null };
  };

  const deleteComic = async (comicId: string) => {
    setComics(prev => prev.filter(comic => comic.id !== comicId));
    
    toast({
      title: "Comic deleted",
      description: "The comic has been deleted successfully.",
    });

    return { error: null };
  };

  return {
    comics,
    loading,
    createComic,
    updateComic,
    deleteComic
  };
};
