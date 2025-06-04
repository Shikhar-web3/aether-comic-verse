
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2, Image, Wand2, Download, Share } from "lucide-react";
import { useComicPanels } from "@/hooks/useComicPanels";
import { useCharacters } from "@/hooks/useCharacters";
import { useComics } from "@/hooks/useComics";
import { toast } from "@/hooks/use-toast";

interface ComicWorkspaceProps {
  comicId: string;
}

const ComicWorkspace: React.FC<ComicWorkspaceProps> = ({ comicId }) => {
  const { panels, createPanel, updatePanel, deletePanel, generateImage, generateScript, isGeneratingImage, isGeneratingScript } = useComicPanels(comicId);
  const { characters, createCharacter } = useCharacters(comicId);
  const { updateComic } = useComics();
  
  const [selectedPanel, setSelectedPanel] = useState<any>(null);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterDescription, setNewCharacterDescription] = useState('');
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleCreatePanel = () => {
    const nextPanelNumber = panels.length + 1;
    createPanel({
      comic_id: comicId,
      panel_number: nextPanelNumber,
      script_text: "New panel"
    });
  };

  const handleGenerateImage = (panelId: string) => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive"
      });
      return;
    }

    generateImage({ prompt: currentPrompt, panelId });
    setCurrentPrompt('');
  };

  const handleCreateCharacter = () => {
    if (!newCharacterName.trim()) {
      toast({
        title: "Character name required",
        description: "Please enter a character name.",
        variant: "destructive"
      });
      return;
    }

    createCharacter({
      comic_id: comicId,
      name: newCharacterName,
      description: newCharacterDescription
    });

    setNewCharacterName('');
    setNewCharacterDescription('');
    setIsCharacterDialogOpen(false);
  };

  const handleScriptGeneration = () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate a script.",
        variant: "destructive"
      });
      return;
    }

    generateScript({ prompt: currentPrompt, characters });
  };

  const exportComic = () => {
    // Simple export functionality - could be enhanced with PDF generation
    const comicData = {
      panels: panels.map(panel => ({
        number: panel.panel_number,
        script: panel.script_text,
        imageUrl: panel.image_url
      })),
      characters: characters.map(char => ({
        name: char.name,
        description: char.description
      }))
    };

    const dataStr = JSON.stringify(comicData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'comic-export.json';
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Comic exported",
      description: "Your comic has been exported successfully.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel - Script and Controls */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Script Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Characters</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {characters.map((character) => (
                  <Avatar 
                    key={character.id}
                    className={`w-10 h-10 cursor-pointer border-2 ${
                      selectedCharacter === character.id ? 'border-electric-blue' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedCharacter(character.id)}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white font-bold">
                      {character.name[0]}
                    </div>
                  </Avatar>
                ))}
                <Dialog open={isCharacterDialogOpen} onOpenChange={setIsCharacterDialogOpen}>
                  <DialogTrigger asChild>
                    <Avatar className="w-10 h-10 cursor-pointer border-2 border-dashed border-gray-300 hover:border-electric-blue">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Character</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="character-name">Character Name</Label>
                        <Input
                          id="character-name"
                          value={newCharacterName}
                          onChange={(e) => setNewCharacterName(e.target.value)}
                          placeholder="Enter character name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="character-description">Description</Label>
                        <Textarea
                          id="character-description"
                          value={newCharacterDescription}
                          onChange={(e) => setNewCharacterDescription(e.target.value)}
                          placeholder="Describe the character..."
                        />
                      </div>
                      <Button onClick={handleCreateCharacter} className="w-full">
                        Create Character
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder="Describe what you want to generate..."
                className="min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleScriptGeneration}
                disabled={isGeneratingScript}
                variant="outline"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGeneratingScript ? 'Generating...' : 'Generate Script'}
              </Button>
              <Button 
                onClick={() => selectedPanel && handleGenerateImage(selectedPanel.id)}
                disabled={isGeneratingImage || !selectedPanel}
                className="bg-gradient-to-r from-electric-blue to-neon-purple"
              >
                <Image className="w-4 h-4 mr-2" />
                {isGeneratingImage ? 'Generating...' : 'Generate Image'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={handleCreatePanel} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Panel
            </Button>
            <Button onClick={exportComic} className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Comic
            </Button>
            <Button className="w-full bg-gradient-to-r from-electric-blue to-neon-purple">
              <Share className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Comic Preview */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Comic Panels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPanel?.id === panel.id 
                      ? 'border-electric-blue bg-electric-blue/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPanel(panel)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    {panel.image_url ? (
                      <img 
                        src={panel.image_url} 
                        alt={`Panel ${panel.panel_number}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Panel {panel.panel_number}</p>
                    <Textarea
                      value={panel.script_text || ''}
                      onChange={(e) => updatePanel({ 
                        id: panel.id, 
                        updates: { script_text: e.target.value } 
                      })}
                      placeholder="Panel script..."
                      className="text-xs"
                      rows={2}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePanel(panel.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {panels.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No panels yet. Click "Add Panel" to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComicWorkspace;
