
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, Image, Eye, Sparkles, History, Send, Plus, Download, Share, Info, Settings, Zap, Users } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import WalletModal from "@/components/wallet/WalletModal";
import StoryProtocolRegister from "@/components/ip/StoryProtocolRegister";
import StoryProtocolInfo from "@/components/ip/StoryProtocolInfo";
import { useToast } from "@/hooks/use-toast";

const Workshop = () => {
  const [generating, setGenerating] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const { isConnected, connectWallet } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isIPModalOpen, setIsIPModalOpen] = useState(false);
  const [isIPInfoOpen, setIsIPInfoOpen] = useState(false);
  const { toast } = useToast();

  const characters = [
    { name: "Astro Nova", avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Quantum Kid", avatar: "https://i.pravatar.cc/100?img=2" },
    { name: "Dr. Nexus", avatar: "https://i.pravatar.cc/100?img=3" }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 3000);
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

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Input 
              type="text" 
              placeholder="Untitled Comic" 
              defaultValue="Cosmic Adventures" 
              className="bg-transparent border-none text-2xl font-bold focus:outline-none focus:ring-0 p-0 h-auto" 
            />
            <Button variant="ghost" size="icon" className="ml-2 text-white/60 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10" size="sm">
              <Users className="mr-2 h-4 w-4" /> Invite
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10" size="sm">
              <History className="mr-2 h-4 w-4" /> History
            </Button>
            <Button variant="outline" className="bg-white/5 border-white/10" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Prompt + Chat */}
          <div className="lg:col-span-5 flex flex-col h-[calc(100vh-200px)]">
            <div className="glass-panel rounded-xl border border-white/10 flex-grow flex flex-col overflow-hidden">
              <Tabs defaultValue="script" className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10">
                  <TabsList className="w-full bg-white/5">
                    <TabsTrigger value="script" className="flex-1 data-[state=active]:bg-electric-blue/20">
                      <MessageCircle className="mr-2 h-4 w-4" /> Script
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex-1 data-[state=active]:bg-electric-blue/20">
                      <Image className="mr-2 h-4 w-4" /> Image
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1 data-[state=active]:bg-electric-blue/20">
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="script" className="flex-grow flex flex-col overflow-hidden p-0 m-0">
                  <div className="flex-grow overflow-y-auto p-4">
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <img src="https://i.pravatar.cc/100?img=1" alt="User" />
                          </Avatar>
                          <span className="font-medium">You</span>
                        </div>
                        <p className="text-white/80">
                          Astro Nova stands at the edge of a futuristic city skyline, her neon blue cape flowing in the wind. The city is a mix of cyberpunk and art deco architecture.
                        </p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <img src="https://i.pravatar.cc/100?img=2" alt="User" />
                          </Avatar>
                          <span className="font-medium">Collaborator</span>
                        </div>
                        <p className="text-white/80">
                          A holographic message appears in front of Astro Nova. It's from Dr. Nexus, warning her about a quantum disruption in the city center.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-white/60">Writing as:</span>
                      <div className="flex -space-x-2">
                        {characters.map((character, index) => (
                          <Avatar 
                            key={index}
                            className={`border-2 w-8 h-8 hover:scale-110 transition-transform cursor-pointer ${
                              selectedCharacter === index 
                                ? 'border-electric-blue' 
                                : 'border-background'
                            }`}
                            onClick={() => setSelectedCharacter(index)}
                          >
                            <img src={character.avatar} alt={character.name} />
                          </Avatar>
                        ))}
                        <Avatar className="border-2 border-background w-8 h-8 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center">
                          <Plus className="h-4 w-4" />
                        </Avatar>
                      </div>
                      {selectedCharacter !== null && (
                        <span className="text-sm text-electric-blue">{characters[selectedCharacter].name}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Write your script or prompt here..." 
                        className="min-h-20 bg-white/5 border-white/10 resize-none"
                      />
                      <Button 
                        className="bg-gradient-to-r from-electric-blue to-neon-purple self-end"
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="image" className="flex-grow flex flex-col overflow-hidden p-0 m-0">
                  <div className="flex-grow overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-40 border-dashed border-2 border-white/20 bg-white/5 hover:bg-white/10 flex flex-col gap-2"
                        onClick={handleGenerate}
                      >
                        <Plus className="h-6 w-6" />
                        <span>Generate New Panel</span>
                      </Button>

                      <div className="bg-gradient-to-br from-cyber-pink/30 to-electric-blue/30 h-40 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/30 font-semibold">Panel Preview</span>
                        </div>
                      </div>
                    </div>

                    {generating && (
                      <div className="mt-4 bg-white/5 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple animate-spin mr-3 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-background"></div>
                          </div>
                          <span className="text-white/80">Generating your comic panel...</span>
                        </div>
                        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-electric-blue to-neon-purple animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">Prompt</label>
                        <Textarea 
                          placeholder="Describe your image in detail..." 
                          className="min-h-20 bg-white/5 border-white/10 resize-none"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" className="bg-white/5 border-white/10">
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-electric-blue to-neon-purple"
                          onClick={handleGenerate}
                        >
                          <Sparkles className="mr-2 h-4 w-4" /> Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="flex-grow overflow-y-auto p-4 m-0">
                  <div className="text-center my-8 text-white/60">
                    <Image className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Preview Your Comic</h3>
                    <p className="max-w-sm mx-auto">
                      Generate panels first to see a preview of your comic.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right panel: Comic preview */}
          <div className="lg:col-span-7 flex flex-col h-[calc(100vh-200px)]">
            <div className="glass-panel rounded-xl border border-white/10 flex-grow p-6 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Comic Preview</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-grow overflow-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg aspect-square flex items-center justify-center border border-white/10">
                    <span className="text-white/30">Panel 1</span>
                  </div>
                  <div className="bg-white/5 rounded-lg aspect-square flex items-center justify-center border border-white/10">
                    <span className="text-white/30">Panel 2</span>
                  </div>
                  <div className="bg-white/5 rounded-lg aspect-square flex items-center justify-center border border-white/10">
                    <span className="text-white/30">Panel 3</span>
                  </div>
                  <div className="bg-gradient-to-br from-cyber-pink/20 to-electric-blue/20 rounded-lg aspect-square flex items-center justify-center border border-white/10 animate-pulse">
                    <span className="text-white/30">Generating...</span>
                  </div>
                </div>
                
                {/* Character tracking bar */}
                <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-medium mb-3 text-white/80">Character Continuity Tracker</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {characters.map((character, index) => (
                      <div key={index} className="flex items-center bg-white/5 rounded-lg p-2 flex-1">
                        <Avatar className="h-10 w-10 mr-3">
                          <img src={character.avatar} alt={character.name} />
                        </Avatar>
                        <div>
                          <p className="font-medium">{character.name}</p>
                          <p className="text-xs text-white/60">Last appeared: Panel {index + 1}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="bg-white/5 border-white/10 h-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between">
                <Button variant="outline" className="bg-white/5 border-white/10">
                  <Download className="mr-2 h-4 w-4" /> Export Comic
                </Button>
                <Button className="bg-gradient-to-r from-electric-blue to-neon-purple">
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
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
