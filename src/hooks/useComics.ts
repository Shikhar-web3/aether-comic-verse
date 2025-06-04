
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface Comic {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  genre?: string;
  status: 'draft' | 'published';
  creator_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  tags?: string[];
}

export interface ComicPanel {
  id: string;
  comic_id: string;
  panel_number: number;
  image_url?: string;
  script_text?: string;
  dialogue?: any;
  ai_prompt?: string;
  character_data?: any;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  comic_id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  character_prompt?: string;
  appearance_data?: any;
  created_at: string;
  updated_at: string;
}

export const useComics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comics = [], isLoading } = useQuery({
    queryKey: ['comics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comics')
        .select('*')
        .eq('creator_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Comic[];
    },
    enabled: !!user?.id,
  });

  const createComicMutation = useMutation({
    mutationFn: async (comicData: Partial<Comic>) => {
      if (!user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('comics')
        .insert({
          ...comicData,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comics', user?.id] });
      toast({
        title: "Comic created",
        description: "Your new comic has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateComicMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Comic> }) => {
      const { data, error } = await supabase
        .from('comics')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comics', user?.id] });
      toast({
        title: "Comic updated",
        description: "Your comic has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteComicMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('comics')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comics', user?.id] });
      toast({
        title: "Comic deleted",
        description: "Your comic has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    comics,
    isLoading,
    createComic: createComicMutation.mutate,
    updateComic: updateComicMutation.mutate,
    deleteComic: deleteComicMutation.mutate,
    isCreating: createComicMutation.isPending,
    isUpdating: updateComicMutation.isPending,
    isDeleting: deleteComicMutation.isPending
  };
};

export const useComic = (comicId: string) => {
  const queryClient = useQueryClient();

  const { data: comic, isLoading } = useQuery({
    queryKey: ['comic', comicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comics')
        .select('*')
        .eq('id', comicId)
        .single();

      if (error) throw error;
      return data as Comic;
    },
    enabled: !!comicId,
  });

  const { data: panels = [] } = useQuery({
    queryKey: ['comic-panels', comicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comic_panels')
        .select('*')
        .eq('comic_id', comicId)
        .order('panel_number');

      if (error) throw error;
      return data as ComicPanel[];
    },
    enabled: !!comicId,
  });

  const { data: characters = [] } = useQuery({
    queryKey: ['comic-characters', comicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('comic_id', comicId)
        .order('created_at');

      if (error) throw error;
      return data as Character[];
    },
    enabled: !!comicId,
  });

  return {
    comic,
    panels,
    characters,
    isLoading
  };
};
