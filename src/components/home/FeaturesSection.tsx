
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="#33C3F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5" stroke="#D946EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 10H16" stroke="#D946EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14H12" stroke="#33C3F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "AI-Powered Creation",
      description: "Generate stunning comic panels from text prompts. Our AI understands character continuity and visual style consistency."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.97 14.44C18.34 14.67 19.85 14.43 20.91 13.72C22.32 12.78 22.32 11.24 20.91 10.3C19.84 9.59 18.31 9.35 16.94 9.59" stroke="#D946EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.97 7.16C6.03 7.15 6.1 7.15 6.16 7.16C7.54 7.11 8.64 5.98 8.64 4.58C8.64 3.15 7.49 2 6.06 2C4.63 2 3.48 3.16 3.48 4.58C3.49 5.98 4.59 7.11 5.97 7.16Z" stroke="#D946EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 14.44C5.63 14.67 4.12 14.43 3.06 13.72C1.65 12.78 1.65 11.24 3.06 10.3C4.13 9.59 5.66 9.35 7.03 9.59" stroke="#33C3F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.33 13.45 9.33 12.05C9.33 10.62 10.48 9.47 11.91 9.47C13.34 9.47 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="#33C3F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.09 17.78C7.68 18.72 7.68 20.26 9.09 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.09 17.78Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Real-time Collaboration",
      description: "Create comics with friends and colleagues in real-time with live cursors, chat, and simultaneous editing features."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#33C3F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 15.5C12.663 15.5 13.2989 15.2366 13.7678 14.7678C14.2366 14.2989 14.5 13.663 14.5 13C14.5 12.337 14.2366 11.7011 13.7678 11.2322C13.2989 10.7634 12.663 10.5 12 10.5C11.337 10.5 10.7011 10.7634 10.2322 11.2322C9.76339 11.7011 9.5 12.337 9.5 13C9.5 13.663 9.76339 14.2989 10.2322 14.7678C10.7011 15.2366 11.337 15.5 12 15.5Z" stroke="#D946EF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 18C10.36 16.74 13.64 16.74 15.5 18" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 9.5C7.82843 9.5 8.5 8.82843 8.5 8C8.5 7.17157 7.82843 6.5 7 6.5C6.17157 6.5 5.5 7.17157 5.5 8C5.5 8.82843 6.17157 9.5 7 9.5Z" stroke="#D946EF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 9.5C17.8284 9.5 18.5 8.82843 18.5 8C18.5 7.17157 17.8284 6.5 17 6.5C16.1716 6.5 15.5 7.17157 15.5 8C15.5 8.82843 16.1716 9.5 17 9.5Z" stroke="#33C3F0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Character Continuity",
      description: "Our AI tracks characters across panels, maintaining their appearance, style, and personality traits throughout your comic."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.29 4.14001L17.22 7.93001C17.21 8.45001 17.54 9.14001 17.96 9.45001L19.44 10.55C20.31 11.24 20.43 12.5 19.7 13.29L18.56 14.54C18.19 14.95 17.92 15.73 18.03 16.26L18.43 18.12C18.67 19.27 17.86 20.27 16.69 20.35L14.81 20.49C14.27 20.53 13.64 20.9 13.34 21.36L12.25 23.21C11.58 24.27 10.41 24.27 9.74 23.21L8.65 21.36C8.35 20.91 7.72 20.53 7.18 20.49L5.31 20.35C4.14 20.27 3.32 19.26 3.56 18.12L3.96 16.26C4.07 15.73 3.8 14.95 3.43 14.54L2.29 13.29C1.56 12.5 1.68 11.24 2.55 10.54L4.03 9.45001C4.45 9.14001 4.78 8.46001 4.77 7.93001L4.7 4.14001C4.67 2.87001 5.63 2.04001 6.88 2.18001L8.8 2.39001C9.31 2.44001 10 2.21001 10.38 1.84001L11.89 0.370009C12.55 -0.269991 13.44 -0.269991 14.11 0.370009L15.62 1.84001C16 2.21001 16.69 2.44001 17.2 2.39001L19.12 2.18001C20.37 2.04001 21.33 2.87001 21.29 4.14001" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#33C3F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Web3 Integration",
      description: "Register your comics with Story Protocol, mint as NFTs, and manage your IP assets through blockchain technology."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            Create Comics Like <span className="text-cyber-pink">Never Before</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with Web3 capabilities to revolutionize comic creation and collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel rounded-xl p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="mb-4 p-3 rounded-lg bg-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70 mb-4">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild className="bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity">
            <a href="/workshop">
              Start Creating <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-purple opacity-20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyber-pink opacity-20 rounded-full blur-[100px] -z-10"></div>
    </section>
  );
};

export default FeaturesSection;
