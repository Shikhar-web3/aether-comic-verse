
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { MessageCircle, User, UserPlus, Share, Plus } from "lucide-react";

const Community = () => {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-electric-blue font-semibold text-sm">Community Hub</span>
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-4">
            Join Our <span className="bg-gradient-to-r from-electric-blue via-cyber-pink to-neon-purple text-transparent bg-clip-text">Creative Community</span>
          </h1>
          <p className="text-white/70 max-w-2xl">
            Connect with other comic creators, share your work, participate in challenges, and collaborate on projects.
          </p>
        </div>

        <Tabs defaultValue="featured" className="mb-10">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="featured" className="data-[state=active]:bg-white/10">
              Featured
            </TabsTrigger>
            <TabsTrigger value="discussions" className="data-[state=active]:bg-white/10">
              Discussions
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-white/10">
              Events
            </TabsTrigger>
            <TabsTrigger value="creators" className="data-[state=active]:bg-white/10">
              Creators
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden h-full">
                  <div className="h-60 bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 flex items-center justify-center">
                    <MessageCircle className="h-16 w-16 text-white/30" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="text-cyber-pink text-xs font-semibold">Weekly Challenge</span>
                      </div>
                      <div className="text-white/60 text-sm">3 days left</div>
                    </div>
                    <CardTitle>Cyberpunk Detective Story Challenge</CardTitle>
                    <CardDescription className="text-white/60">
                      Create a short detective story set in a cyberpunk world. The best entries will be featured on our homepage!
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(img => (
                        <Avatar key={img} className="border-2 border-background w-8 h-8">
                          <img src={`https://i.pravatar.cc/100?img=${img + 10}`} alt="Participant" />
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-xs">
                        +23
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90">
                      Join Challenge
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Discord Community</CardTitle>
                    <CardDescription className="text-white/60">
                      Join our active Discord server
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5">
                      <Link to="#">
                        <MessageCircle className="mr-2 h-4 w-4" /> Join Discord
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Twitter Space</CardTitle>
                    <CardDescription className="text-white/60">
                      Weekly Twitter Space on Comic Creation
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5">
                      <Link to="#">
                        <Share className="mr-2 h-4 w-4" /> Follow Us
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Submit Your Work</CardTitle>
                    <CardDescription className="text-white/60">
                      Share your latest comics with the community
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild className="w-full bg-gradient-to-r from-cyber-pink to-electric-blue hover:opacity-90">
                      <Link to="#">
                        <Plus className="mr-2 h-4 w-4" /> Submit Comic
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="mt-6">
            <div className="glass-panel rounded-xl p-6 border border-white/10 mb-6">
              <h3 className="font-bold text-xl mb-4">Recent Discussions</h3>
              
              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <img src={discussion.avatarUrl} alt={discussion.author} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{discussion.title}</h4>
                          <span className="text-white/40 text-xs">{discussion.timeAgo}</span>
                        </div>
                        <p className="text-white/60 text-sm mb-2">{discussion.preview}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 text-xs">{discussion.author}</span>
                            <span className="h-1 w-1 rounded-full bg-white/30"></span>
                            <span className="text-white/40 text-xs">{discussion.replies} replies</span>
                          </div>
                          <div className="flex -space-x-1">
                            {[1, 2].map(img => (
                              <div key={img} className="w-5 h-5 rounded-full bg-gradient-to-r from-electric-blue/20 to-cyber-pink/20 border border-white/10"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5">
                  <Link to="#">
                    View All Discussions
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-xl mb-4">Start a New Discussion</h3>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Discussion title" className="bg-white/5 border-white/10" />
                </div>
                <div>
                  <textarea 
                    className="w-full rounded-md bg-white/5 border border-white/10 p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent text-white/80"
                    placeholder="What do you want to talk about?"
                  ></textarea>
                </div>
                <Button className="bg-gradient-to-r from-electric-blue to-neon-purple">
                  <MessageCircle className="mr-2 h-4 w-4" /> Post Discussion
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <Card key={index} className="bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
                  <div className={`h-40 ${event.bgClass} flex items-center justify-center`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                      <span className="text-white font-semibold">{event.date}</span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-cyber-pink"></div>
                      <span className="text-cyber-pink text-xs font-semibold">{event.type}</span>
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="text-white/60">{event.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="text-white/60 text-sm">{event.timeInfo}</div>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                      {event.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="creators" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {creators.map((creator, index) => (
                <Card key={index} className="bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
                  <div className="pt-6 flex justify-center">
                    <Avatar className="h-20 w-20 border-2 border-white/10">
                      <img src={creator.avatarUrl} alt={creator.name} />
                    </Avatar>
                  </div>
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{creator.name}</CardTitle>
                    <CardDescription className="text-white/60">{creator.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-2">
                    <p className="text-white/70 text-sm">{creator.bio}</p>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-electric-blue to-neon-purple">
                      <UserPlus className="mr-1 h-4 w-4" /> Follow
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="glass-panel rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-white/0 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4">
                Ready to <span className="bg-gradient-to-r from-electric-blue via-cyber-pink to-neon-purple text-transparent bg-clip-text">Create</span>?
              </h2>
              <p className="text-white/70 mb-6">
                Jump into our workshop and start creating your own comic with AI assistance.
              </p>
              <Button asChild className="bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity">
                <Link to="/workshop">
                  <Plus className="mr-2 h-4 w-4" /> Start Creating
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-neon-purple opacity-20 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-cyber-pink opacity-20 blur-2xl"></div>
              <div className="relative z-10 flex justify-center">
                <div className="bg-gradient-to-br from-electric-blue/20 to-cyber-pink/20 h-40 w-40 rounded-lg overflow-hidden border border-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Data for the Community page
const discussions = [
  {
    title: "Best AI prompts for cyberpunk characters?",
    author: "NeonDreamer",
    avatarUrl: "https://i.pravatar.cc/100?img=11",
    preview: "I'm trying to create consistent character designs in a cyberpunk style. Anyone have good prompt techniques to share?",
    timeAgo: "2 hours ago",
    replies: 12
  },
  {
    title: "Story Protocol integration questions",
    author: "CryptoArtist",
    avatarUrl: "https://i.pravatar.cc/100?img=12",
    preview: "I'm trying to register my comic series with Story Protocol. Has anyone gone through the process before?",
    timeAgo: "5 hours ago",
    replies: 8
  },
  {
    title: "Weekly challenge submission thread",
    author: "ModTeam",
    avatarUrl: "https://i.pravatar.cc/100?img=13",
    preview: "Submit your entries for this week's comic challenge here. Theme: Cyberpunk Detective.",
    timeAgo: "1 day ago",
    replies: 24
  },
  {
    title: "Collaboration opportunity - Sci-Fi series",
    author: "StarGazer",
    avatarUrl: "https://i.pravatar.cc/100?img=14",
    preview: "Looking for 2-3 collaborators for an ongoing sci-fi comic series. Particularly need help with...",
    timeAgo: "2 days ago",
    replies: 17
  }
];

const events = [
  {
    title: "AI Comic Workshop",
    type: "Workshop",
    date: "June 15",
    description: "Learn advanced techniques for AI-assisted comic creation",
    timeInfo: "2:00 PM UTC",
    buttonText: "Register",
    bgClass: "bg-gradient-to-br from-electric-blue/20 to-neon-purple/20"
  },
  {
    title: "Story Protocol AMA",
    type: "Live Session",
    date: "June 18",
    description: "Ask anything about IP protection and registration",
    timeInfo: "6:00 PM UTC",
    buttonText: "Add to Calendar",
    bgClass: "bg-gradient-to-br from-cyber-pink/20 to-electric-blue/20"
  },
  {
    title: "Comic Creator Meetup",
    type: "Community",
    date: "June 22",
    description: "Virtual meetup for all comic creators",
    timeInfo: "8:00 PM UTC",
    buttonText: "Join",
    bgClass: "bg-gradient-to-br from-neon-purple/20 to-glowing-orange/20"
  },
  {
    title: "Web3 Comics Panel",
    type: "Panel",
    date: "June 25",
    description: "Discussion on the future of Web3 comics",
    timeInfo: "3:00 PM UTC",
    buttonText: "Register",
    bgClass: "bg-gradient-to-br from-glowing-orange/20 to-cyber-pink/20"
  },
  {
    title: "Character Design Contest",
    type: "Contest",
    date: "July 1-7",
    description: "Weekly contest with prizes for best character designs",
    timeInfo: "All week",
    buttonText: "Learn More",
    bgClass: "bg-gradient-to-br from-electric-blue/20 to-cyber-pink/20"
  },
  {
    title: "Comic Artists Showcase",
    type: "Exhibition",
    date: "July 10",
    description: "Featuring work from our top community artists",
    timeInfo: "24 hours",
    buttonText: "Preview",
    bgClass: "bg-gradient-to-br from-cyber-pink/20 to-neon-purple/20"
  }
];

const creators = [
  {
    name: "Alex Cyber",
    title: "Comic Artist",
    bio: "Specializing in cyberpunk narratives with a hint of retro aesthetics",
    avatarUrl: "https://i.pravatar.cc/100?img=1"
  },
  {
    name: "Nina Quantum",
    title: "Writer & Artist",
    bio: "Creating sci-fi worlds with deep philosophical themes",
    avatarUrl: "https://i.pravatar.cc/100?img=2"
  },
  {
    name: "Max Powers",
    title: "Character Designer",
    bio: "Bringing unique characters to life with bold designs",
    avatarUrl: "https://i.pravatar.cc/100?img=3"
  },
  {
    name: "Sara Digital",
    title: "AI Prompt Engineer",
    bio: "Crafting the perfect prompts for stunning AI art",
    avatarUrl: "https://i.pravatar.cc/100?img=4"
  },
  {
    name: "Leo Neon",
    title: "Web3 Developer",
    bio: "Building the bridge between comics and blockchain",
    avatarUrl: "https://i.pravatar.cc/100?img=5"
  },
  {
    name: "Zoe Matrix",
    title: "Colorist",
    bio: "Adding vibrant colors to bring stories to life",
    avatarUrl: "https://i.pravatar.cc/100?img=6"
  },
  {
    name: "Ray Pixel",
    title: "Layout Artist",
    bio: "Creating dynamic panel layouts for maximum impact",
    avatarUrl: "https://i.pravatar.cc/100?img=7"
  },
  {
    name: "Kim Vector",
    title: "Background Artist",
    bio: "Designing immersive worlds for characters to inhabit",
    avatarUrl: "https://i.pravatar.cc/100?img=8"
  }
];

export default Community;
