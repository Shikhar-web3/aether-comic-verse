
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Grid3X3, List, Filter, Sparkles } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const Explore = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const { isConnected } = useWallet();
  
  const mockComics = [
    {
      id: 1,
      title: "Astro Nova Chronicles",
      creator: "Cosmic Studios",
      image: "https://i.pravatar.cc/300?img=1",
      likes: 245,
      remixes: 18,
      tags: ["sci-fi", "adventure"]
    },
    {
      id: 2,
      title: "Quantum Kid Adventures",
      creator: "Digital Dreamers",
      image: "https://i.pravatar.cc/300?img=2",
      likes: 189,
      remixes: 12,
      tags: ["fantasy", "kids"]
    },
    {
      id: 3,
      title: "Dr. Nexus and the Time Warp",
      creator: "Time Travelers Inc.",
      image: "https://i.pravatar.cc/300?img=3",
      likes: 312,
      remixes: 24,
      tags: ["sci-fi", "mystery"]
    },
    {
      id: 4,
      title: "Cyber City Nights",
      creator: "Neon Studios",
      image: "https://i.pravatar.cc/300?img=4",
      likes: 178,
      remixes: 9,
      tags: ["cyberpunk", "noir"]
    },
    {
      id: 5,
      title: "Mythic Realms",
      creator: "Fantasy Forge",
      image: "https://i.pravatar.cc/300?img=5",
      likes: 265,
      remixes: 21,
      tags: ["fantasy", "adventure"]
    },
    {
      id: 6,
      title: "Space Pirates of Alpha Centauri",
      creator: "Stellar Comics",
      image: "https://i.pravatar.cc/300?img=6",
      likes: 203,
      remixes: 14,
      tags: ["sci-fi", "action"]
    }
  ];

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-bold mb-4">Explore Comics</h1>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <Input 
                placeholder="Search for comics, creators, or tags..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className={`bg-white/5 border-white/10 ${view === 'grid' ? 'text-electric-blue' : 'text-white/60'}`}
                onClick={() => setView('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`bg-white/5 border-white/10 ${view === 'list' ? 'text-electric-blue' : 'text-white/60'}`}
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="trending" className="mb-8">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="trending" className="data-[state=active]:bg-electric-blue/20">Trending</TabsTrigger>
            <TabsTrigger value="latest" className="data-[state=active]:bg-electric-blue/20">Latest</TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-electric-blue/20">Featured</TabsTrigger>
            {isConnected && (
              <TabsTrigger value="following" className="data-[state=active]:bg-electric-blue/20">Following</TabsTrigger>
            )}
          </TabsList>
          
          {filterOpen && (
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Sci-Fi", "Fantasy", "Action", "Comedy", "Drama", "Horror"].map(tag => (
                      <Button key={tag} variant="outline" size="sm" className="bg-white/5 border-white/10">
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Art Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Manga", "Western", "Digital", "Pixel Art", "3D"].map(style => (
                      <Button key={style} variant="outline" size="sm" className="bg-white/5 border-white/10">
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">IP Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                      Registered IP
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                      Open License
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                      Commercial Use
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <TabsContent value="trending" className="mt-4">
            <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {mockComics.map((comic) => (
                view === 'grid' ? (
                  <div key={comic.id} className="glass-panel rounded-lg overflow-hidden border border-white/10 hover:border-electric-blue/50 transition-all group">
                    <div className="aspect-square relative bg-gradient-to-br from-neon-purple/30 to-cyber-pink/30">
                      <img 
                        src={comic.image} 
                        alt={comic.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <div className="p-4 w-full">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold truncate">{comic.title}</h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10">
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-white/70">{comic.creator}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {comic.tags.map(tag => (
                              <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white/70 text-sm">{comic.likes} likes</span>
                          <span className="text-white/70 text-sm">{comic.remixes} remixes</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/5 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={comic.id} className="glass-panel rounded-lg overflow-hidden border border-white/10 hover:border-electric-blue/50 transition-all group p-4 flex gap-4">
                    <div className="w-24 h-24 rounded-md bg-gradient-to-br from-neon-purple/30 to-cyber-pink/30 overflow-hidden">
                      <img 
                        src={comic.image} 
                        alt={comic.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold">{comic.title}</h3>
                      <p className="text-sm text-white/70">{comic.creator}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {comic.tags.map(tag => (
                          <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/5 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="latest" className="mt-4">
            {/* Similar layout but with different comics */}
            <div className="text-center py-8 opacity-70">Latest comics content will appear here.</div>
          </TabsContent>
          
          <TabsContent value="featured" className="mt-4">
            <div className="text-center py-8 opacity-70">Featured comics content will appear here.</div>
          </TabsContent>
          
          {isConnected && (
            <TabsContent value="following" className="mt-4">
              <div className="text-center py-8 opacity-70">Comics from creators you follow will appear here.</div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Explore;
