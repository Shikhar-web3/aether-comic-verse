
import React from "react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create a Team",
      description: "Invite friends or collaborate with other creators to form your comic creation team."
    },
    {
      number: "02",
      title: "Draft Your Story",
      description: "Write prompts and dialogue in the collaborative editor with real-time feedback."
    },
    {
      number: "03",
      title: "Generate Art with AI",
      description: "Turn your prompts into stunning comic panels with our advanced AI image generator."
    },
    {
      number: "04",
      title: "Mint & Share",
      description: "Register your IP on-chain and share your comic with the world or mint it as an NFT."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            How It <span className="text-electric-blue">Works</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Follow these simple steps to create, collaborate, and share your comics using our platform.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-1/2 w-0.5 h-[calc(100%-120px)] bg-gradient-to-b from-electric-blue via-cyber-pink to-neon-purple opacity-50 hidden md:block"></div>
          
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center md:items-start">
                <div className={`w-full md:w-1/2 mb-8 md:mb-0 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="glass-panel rounded-xl p-6 h-full">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left h-full">
                      <div className="mb-4 p-3 bg-white/5 rounded-lg">
                        <span className="text-5xl font-orbitron font-bold bg-gradient-to-r from-electric-blue to-neon-purple text-transparent bg-clip-text">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-white/70">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`hidden md:flex items-center justify-center w-24 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center animate-pulse-glow z-10">
                    <div className="w-8 h-8 rounded-full bg-cosmic-black flex items-center justify-center">
                      <span className="font-orbitron font-bold text-white">{index + 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-full md:w-1/2 ${index % 2 === 1 ? 'md:order-0' : ''}`}>
                  <div className={`h-40 md:h-60 bg-gradient-to-br rounded-xl overflow-hidden relative ${
                    index === 0 ? 'from-neon-purple/20 to-electric-blue/20' : 
                    index === 1 ? 'from-cyber-pink/20 to-neon-purple/20' : 
                    index === 2 ? 'from-electric-blue/20 to-cyber-pink/20' : 
                    'from-neon-green/20 to-neon-purple/20'
                  }`}>
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/5 border border-white/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/30 font-semibold">Step {index + 1} Visualization</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
