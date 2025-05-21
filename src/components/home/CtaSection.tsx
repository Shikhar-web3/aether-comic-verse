
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-space-gray to-cosmic-black"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-neon-purple opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-cyber-pink opacity-20 blur-[100px]"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="glass-panel rounded-2xl p-8 md:p-16 border border-white/10 bg-gradient-to-br from-white/5 to-white/0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
                Ready to Create Your <span className="bg-gradient-to-r from-electric-blue via-cyber-pink to-neon-purple text-transparent bg-clip-text">Next Comic?</span>
              </h2>
              
              <p className="text-white/70 mb-8">
                Join our community of creators and start building amazing comics with AI assistance and real-time collaboration.
              </p>
              
              <div className="space-y-4 md:space-y-0 md:space-x-4">
                <Button className="bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity px-8 py-6">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-white/20 backdrop-blur-sm hover:bg-white/5 px-8 py-6 md:ml-4">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto w-full max-w-xs h-80 bg-gradient-to-r from-electric-blue/30 via-cyber-pink/30 to-neon-purple/30 rounded-xl overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/5 border border-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 font-semibold">Comic Preview</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-electric-blue/20 rounded-lg backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-cyber-pink/20 rounded-lg backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
