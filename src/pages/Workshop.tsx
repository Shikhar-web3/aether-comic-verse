
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Zap, Info } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useComics } from "@/hooks/useComics";
import WalletModal from "@/components/wallet/WalletModal";
import StoryProtocolRegister from "@/components/ip/StoryProtocolRegister";
import StoryProtocolInfo from "@/components/ip/StoryProtocolInfo";
import ComicWorkspace from "@/components/workshop/ComicWorkspace";
import { toast } from "@/hooks/use-toast";

const Workshop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const comicIdParam = searchParams.get('comic');
  
  const { isConnected, connectWallet } = useWallet();
  const { comics, createComic, isLoading } = useComics();
  
  const [currentComic, setCurrentComic] = useState<any>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isIPModalOpen, setIsIPModalOpen] = useState(false);
  const [isIPInfoOpen, setIsIPInfoOpen] = useState(false);
  const [isNewComicDialogOpen, setIsNewComicDialogOpen] = useState(false);
  
  // New comic form state
  const [newComicTitle, setNewComicTitle] = useState('');
  const [newComicDescription, setNewComicDescription] = useState('');
  const [newComicGenre, setNewComicGenre] = useState('');

  // Load comic from URL parameter or default to first comic
  useEffect(() => {
    if (comicIdParam && comics.length > 0) {
      const comic = comics.find(c => c.id === comicIdParam);
      if (comic) {
        setCurrentComic(comic);
      }
    } else if (comics.length > 0 && !currentComic) {
      setCurrentComic(comics[0]);
    }
  }, [comicIdParam, comics, currentComic]);

  const handleCreateComic = () => {
    if (!newComicTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a comic title.",
        variant: "destructive"
      });
      return;
    }

    createComic({
      title: newComicTitle,
      description: newComicDescription,
      genre: newComicGenre || 'adventure',
      status: 'draft'
    });

    // Reset form
    setNewComicTitle('');
    setNewComicDescription('');
    setNewComicGenre('');
    setIsNewComicDialogOpen(false);
  };

  const handleRegisterIP = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to register your comic IP",
      });
      return;
    }
    
    setIsIPModalOpen(true);
  };

  const handleConnectWallet = async (walletType: string) => {
    await connectWallet(walletType);
    setIsWalletModalOpen(false);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
            <p>Loading your workspace...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (comics.length === 0) {
    return (
      <MainLayout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Welcome to Your Workshop</h2>
            <p className="text-gray-600 mb-8">Start creating your first comic!</p>
            
            <Dialog open={isNewComicDialogOpen} onOpenChange={setIsNewComicDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-electric-blue to-neon-purple">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Comic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Comic</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newComicTitle}
                      onChange={(e) => setNewComicTitle(e.target.value)}
                      placeholder="Enter comic title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newComicDescription}
                      onChange={(e) => setNewComicDescription(e.target.value)}
                      placeholder="Describe your comic..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={newComicGenre} onValueChange={setNewComicGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="superhero">Superhero</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateComic} className="w-full">
                    Create Comic
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Select
              value={currentComic?.id || ''}
              onValueChange={(value) => {
                const comic = comics.find(c => c.id === value);
                if (comic) {
                  setCurrentComic(comic);
                  navigate(`/workshop?comic=${value}`);
                }
              }}
            >
              <SelectTrigger className="w-64 bg-transparent border-none text-2xl font-bold">
                <SelectValue placeholder="Select a comic" />
              </SelectTrigger>
              <SelectContent>
                {comics.map((comic) => (
                  <SelectItem key={comic.id} value={comic.id}>
                    {comic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="ml-2 text-white/60 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog open={isNewComicDialogOpen} onOpenChange={setIsNewComicDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/5 border-white/10" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> New Comic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Comic</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newComicTitle}
                      onChange={(e) => setNewComicTitle(e.target.value)}
                      placeholder="Enter comic title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newComicDescription}
                      onChange={(e) => setNewComicDescription(e.target.value)}
                      placeholder="Describe your comic..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={newComicGenre} onValueChange={setNewComicGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="superhero">Superhero</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateComic} className="w-full">
                    Create Comic
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              className="bg-gradient-to-r from-electric-blue to-neon-purple" 
              size="sm"
              onClick={handleRegisterIP}
            >
              <Zap className="mr-2 h-4 w-4" /> Register IP
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
              onClick={() => setIsIPInfoOpen(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Workspace */}
        {currentComic ? (
          <ComicWorkspace comicId={currentComic.id} />
        ) : (
          <div className="text-center py-12">
            <p>Please select a comic to start working.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <WalletModal 
        isOpen={isWalletModalOpen} 
        setIsOpen={setIsWalletModalOpen} 
        onConnect={handleConnectWallet} 
      />
      
      <StoryProtocolRegister 
        isOpen={isIPModalOpen} 
        setIsOpen={setIsIPModalOpen} 
      />

      <StoryProtocolInfo
        isOpen={isIPInfoOpen}
        setIsOpen={setIsIPInfoOpen}
      />
    </MainLayout>
  );
};

export default Workshop;
