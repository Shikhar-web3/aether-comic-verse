
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const comicFramesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!comicFramesRef.current) return;
      
      const frames = comicFramesRef.current.querySelectorAll('.comic-frame');
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const moveX = (clientX - windowWidth / 2) / windowWidth;
      const moveY = (clientY - windowHeight / 2) / windowHeight;
      
      frames.forEach((frame, index) => {
        const frameElement = frame as HTMLElement;
        const depth = parseFloat(frameElement.getAttribute('data-depth') || '0');
        const translateX = moveX * depth * 30;
        const translateY = moveY * depth * 30;
        const scale = 1 + depth * 0.05;
        
        frameElement.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-black via-cosmic-black to-space-gray"></div>
        
        <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-neon-purple/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-cyber-pink/20 to-transparent"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0)', 
             backgroundSize: '40px 40px' 
           }}>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-electric-blue font-semibold text-sm">Web3 + AI Comics</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-6">
              <span className="block">Create Comics with</span>
              <span className="inline-block bg-gradient-to-r from-electric-blue via-cyber-pink to-neon-purple text-transparent bg-clip-text glow-text">
                AI + Friends
              </span>
            </h1>
            
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Collaborate in real-time, generate amazing artwork with AI, and mint your comics as NFTs in our futuristic creative platform.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild className="bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity px-8 py-6">
                <Link to="/workshop">
                  Start Creating
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 backdrop-blur-sm hover:bg-white/5 px-8 py-6">
                <Link to="/explore">
                  Explore Comics
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative" ref={comicFramesRef}>
            {/* Animated comic panel display */}
            <div 
              className="comic-frame absolute top-10 -right-6 w-60 h-60 rounded-lg shadow-lg bg-cyber-pink/20 border border-white/30 backdrop-blur-sm animate-float"
              data-depth="0.6"
              style={{ transform: 'rotate(5deg)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-bold text-lg text-white/80">Character Design</span>
              </div>
            </div>
            
            <div 
              className="comic-frame absolute top-32 -left-10 w-56 h-40 rounded-lg shadow-lg bg-electric-blue/20 border border-white/20 backdrop-blur-sm animate-float"
              data-depth="0.4" 
              style={{ animationDelay: '0.5s', transform: 'rotate(-3deg)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-bold text-lg text-white/80">Scene Setting</span>
              </div>
            </div>
            
            <div 
              className="comic-frame absolute bottom-0 right-12 w-64 h-48 rounded-lg shadow-lg bg-neon-purple/20 border border-white/20 backdrop-blur-sm animate-float"
              data-depth="0.5"
              style={{ animationDelay: '1s', transform: 'rotate(-5deg)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-bold text-lg text-white/80">AI Generator</span>
              </div>
            </div>
            
            <div 
              className="comic-frame absolute bottom-20 -left-4 w-52 h-52 rounded-lg shadow-lg bg-glowing-orange/20 border border-white/20 backdrop-blur-sm animate-float"
              data-depth="0.3"
              style={{ animationDelay: '1.5s', transform: 'rotate(8deg)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-bold text-lg text-white/80">Collaboration</span>
              </div>
            </div>
            
            <div className="relative mx-auto w-72 h-72 bg-gradient-to-r from-electric-blue/50 via-cyber-pink/50 to-neon-purple/50 rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
