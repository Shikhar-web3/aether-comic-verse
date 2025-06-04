
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ComicPanel {
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

interface CreatePanelData {
  comic_id: string;
  panel_number: number;
  script_text?: string;
  ai_prompt?: string;
  character_data?: any;
}

export const useComicPanels = (comicId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: panels, isLoading } = useQuery({
    queryKey: ['comic-panels', comicId],
    queryFn: async () => {
      if (!comicId) return [];
      
      const { data, error } = await supabase
        .from('comic_panels')
        .select('*')
        .eq('comic_id', comicId)
        .order('panel_number', { ascending: true });

      if (error) throw error;
      return data as ComicPanel[];
    },
    enabled: !!comicId,
  });

  const createPanelMutation = useMutation({
    mutationFn: async (panelData: CreatePanelData) => {
      const { data, error } = await supabase
        .from('comic_panels')
        .insert(panelData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comic-panels', comicId] });
      toast({
        title: "Panel created",
        description: "Your comic panel has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create panel",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updatePanelMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ComicPanel> }) => {
      const { data, error } = await supabase
        .from('comic_panels')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comic-panels', comicId] });
      toast({
        title: "Panel updated",
        description: "Your comic panel has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update panel",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deletePanelMutation = useMutation({
    mutationFn: async (panelId: string) => {
      const { error } = await supabase
        .from('comic_panels')
        .delete()
        .eq('id', panelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comic-panels', comicId] });
      toast({
        title: "Panel deleted",
        description: "The comic panel has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete panel",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const generateImageMutation = useMutation({
    mutationFn: async ({ prompt, panelId }: { prompt: string; panelId: string }) => {
      const { data, error } = await supabase.functions.invoke('generate-comic-panel', {
        body: { prompt }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      // Update panel with generated image
      const { data: updatedPanel, error: updateError } = await supabase
        .from('comic_panels')
        .update({ 
          image_url: data.imageUrl,
          ai_prompt: prompt,
          updated_at: new Date().toISOString() 
        })
        .eq('id', panelId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedPanel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comic-panels', comicId] });
      toast({
        title: "Image generated",
        description: "Your comic panel image has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate image",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const generateScriptMutation = useMutation({
    mutationFn: async ({ prompt, characters }: { prompt: string; characters?: any[] }) => {
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: { prompt, characters }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      return data.script;
    },
    onError: (error) => {
      toast({
        title: "Failed to generate script",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    panels: panels || [],
    isLoading,
    createPanel: createPanelMutation.mutate,
    updatePanel: updatePanelMutation.mutate,
    deletePanel: deletePanelMutation.mutate,
    generateImage: generateImageMutation.mutate,
    generateScript: generateScriptMutation.mutate,
    isCreating: createPanelMutation.isPending,
    isUpdating: updatePanelMutation.isPending,
    isGeneratingImage: generateImageMutation.isPending,
    isGeneratingScript: generateScriptMutation.isPending,
  };
};
