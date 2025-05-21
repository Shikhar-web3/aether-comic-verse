
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BookOpen, MessageCircle, Pencil, Plus, Share, User, UserPlus } from "lucide-react";

const Learn = () => {
  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-electric-blue font-semibold text-sm">Learning Center</span>
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-4">
            Learn Comic <span className="bg-gradient-to-r from-electric-blue via-cyber-pink to-neon-purple text-transparent bg-clip-text">Creation</span>
          </h1>
          <p className="text-white/70 max-w-2xl">
            Master the art of AI-assisted comic creation with our comprehensive guides, tutorials, and community resources.
          </p>
        </div>

        <Tabs defaultValue="tutorials" className="mb-10">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-white/10">
              <BookOpen className="mr-2 h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-white/10">
              <Share className="mr-2 h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="web3" className="data-[state=active]:bg-white/10">
              <User className="mr-2 h-4 w-4" />
              Web3 & IP
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tutorials" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
                  <CardHeader className="pb-3">
                    <div className={`h-40 rounded-md mb-4 ${tutorial.bgClass} flex items-center justify-center`}>
                      <tutorial.icon className="h-16 w-16 text-white/50" />
                    </div>
                    <CardTitle>{tutorial.title}</CardTitle>
                    <CardDescription className="text-white/60">{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5">
                      <Link to="#">Watch Tutorial</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription className="text-white/60">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.links.map((link, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/70 hover:text-electric-blue transition-colors">
                          <div className="h-1 w-1 rounded-full bg-electric-blue"></div>
                          <Link to="#">{link}</Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5">
                      <Link to="#">Explore All</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="web3" className="mt-6">
            <div className="glass-panel rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-xl mb-4">Web3 & IP Protection Guide</h3>
              <p className="text-white/70 mb-6">
                Learn how to protect your comic creations using blockchain technology and register your intellectual property with Story Protocol.
              </p>
              
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-lg mb-2">Register Your IP with Story Protocol</h4>
                  <p className="text-white/70 mb-4">
                    Story Protocol enables creators to register their intellectual property on-chain, establish clear ownership, and earn from derivatives.
                  </p>
                  <Button className="bg-gradient-to-r from-electric-blue to-neon-purple">
                    Learn More About Story Protocol
                  </Button>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-lg mb-2">Connect Your Wallet</h4>
                  <p className="text-white/70 mb-4">
                    To use Web3 features like IP registration, you need to connect your wallet to our platform.
                  </p>
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    <User className="mr-2 h-4 w-4" /> Connect Wallet Guide
                  </Button>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-lg mb-2">Mint and Share Comics</h4>
                  <p className="text-white/70 mb-4">
                    After creation, you can mint your comics as NFTs and share them with the community, earning royalties when others build on your work.
                  </p>
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    <Share className="mr-2 h-4 w-4" /> Minting Tutorial
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="glass-panel rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-white/0 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4">
                Join Our <span className="bg-gradient-to-r from-electric-blue via-cyber-pink to-neon-purple text-transparent bg-clip-text">Community</span>
              </h2>
              <p className="text-white/70 mb-6">
                Connect with other comic creators, share tips, and get feedback on your work.
              </p>
              <Button asChild className="bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity">
                <Link to="/community">
                  <MessageCircle className="mr-2 h-4 w-4" /> Visit Community Hub
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-neon-purple opacity-20 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-cyber-pink opacity-20 blur-2xl"></div>
              <div className="relative z-10 flex justify-center">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full bg-electric-blue/30 flex items-center justify-center border border-white/20">
                    <User className="h-6 w-6 text-white/80" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyber-pink/30 flex items-center justify-center border border-white/20">
                    <Pencil className="h-6 w-6 text-white/80" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-neon-purple/30 flex items-center justify-center border border-white/20">
                    <MessageCircle className="h-6 w-6 text-white/80" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-glowing-orange/30 flex items-center justify-center border border-white/20">
                    <UserPlus className="h-6 w-6 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Data for the Learn page
const tutorials = [
  {
    title: "Getting Started",
    description: "Learn the basics of comic creation on our platform",
    icon: Plus,
    bgClass: "bg-gradient-to-br from-electric-blue/30 to-neon-purple/30"
  },
  {
    title: "Character Design",
    description: "Create compelling characters with AI assistance",
    icon: User,
    bgClass: "bg-gradient-to-br from-cyber-pink/30 to-electric-blue/30"
  },
  {
    title: "Scene Creation",
    description: "Set the perfect scene for your comic panels",
    icon: Pencil,
    bgClass: "bg-gradient-to-br from-neon-purple/30 to-glowing-orange/30"
  },
  {
    title: "Collaborative Editing",
    description: "Work effectively with other creators",
    icon: UserPlus,
    bgClass: "bg-gradient-to-br from-glowing-orange/30 to-cyber-pink/30"
  },
  {
    title: "Web3 Integration",
    description: "Connect your wallet and mint your creations",
    icon: Share,
    bgClass: "bg-gradient-to-br from-electric-blue/30 to-cyber-pink/30"
  },
  {
    title: "Advanced AI Prompting",
    description: "Write better prompts for superior AI-generated art",
    icon: MessageCircle,
    bgClass: "bg-gradient-to-br from-cyber-pink/30 to-neon-purple/30"
  }
];

const resources = [
  {
    title: "Comic Creation Resources",
    description: "Helpful guides, templates, and tools for creating comics",
    links: [
      "Comic Panel Templates",
      "Character Design Guide",
      "Speech Bubble Styles",
      "Color Theory for Comics",
      "Storytelling Structure"
    ]
  },
  {
    title: "AI Prompt Optimization",
    description: "Learn how to write better prompts for AI image generation",
    links: [
      "Prompt Engineering Basics",
      "Style Keywords Reference",
      "Scene Description Templates",
      "Character Prompt Guide",
      "Advanced Techniques"
    ]
  },
  {
    title: "Web3 & NFT Resources",
    description: "Everything you need to know about blockchain integration",
    links: [
      "Wallet Setup Guide",
      "NFT Minting Process",
      "Intellectual Property Rights",
      "Royalty Structures",
      "Story Protocol Documentation"
    ]
  },
  {
    title: "Community Resources",
    description: "Connect with other creators and share your work",
    links: [
      "Discord Server",
      "Weekly Challenges",
      "Feedback Sessions",
      "Collaboration Opportunities",
      "Featured Artists Gallery"
    ]
  }
];

export default Learn;
