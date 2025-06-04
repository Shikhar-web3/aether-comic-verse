
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Character {
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

interface CreateCharacterData {
  comic_id: string;
  name: string;
  description?: string;
  character_prompt?: string;
  appearance_data?: any;
}

export const useCharacters = (comicId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters', comicId],
    queryFn: async () => {
      if (!comicId) return [];
      
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('comic_id', comicId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Character[];
    },
    enabled: !!comicId,
  });

  const createCharacterMutation = useMutation({
    mutationFn: async (characterData: CreateCharacterData) => {
      const { data, error } = await supabase
        .from('characters')
        .insert(characterData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters', comicId] });
      toast({
        title: "Character created",
        description: "Your character has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create character",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateCharacterMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Character> }) => {
      const { data, error } = await supabase
        .from('characters')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters', comicId] });
      toast({
        title: "Character updated",
        description: "Your character has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update character",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters', comicId] });
      toast({
        title: "Character deleted",
        description: "The character has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete character",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    characters: characters || [],
    isLoading,
    createCharacter: createCharacterMutation.mutate,
    updateCharacter: updateCharacterMutation.mutate,
    deleteCharacter: deleteCharacterMutation.mutate,
    isCreating: createCharacterMutation.isPending,
    isUpdating: updateCharacterMutation.isPending,
  };
};
