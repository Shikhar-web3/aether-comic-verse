
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Comic Cosmos has completely transformed our studio's workflow. The AI-powered tools save us countless hours on concept art and rough drafts.",
      name: "Alex Johnson",
      title: "Creative Director, Quantum Comics",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      quote: "The character continuity features are mind-blowing. Our team can collaborate remotely and the AI keeps everything consistent across panels.",
      name: "Sarah Chen",
      title: "Lead Artist, Future Tales",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      quote: "Being able to register our IP directly through the platform is a game-changer for independent creators like me. Web3 integration done right!",
      name: "Marcus Reeves",
      title: "Independent Creator",
      avatar: "https://i.pravatar.cc/150?img=8"
    }
  ];

  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            What Creators Are <span className="text-neon-purple">Saying</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join thousands of creators who are already using our platform to bring their comic visions to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="glass-panel border-white/10 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:translate-y-[-4px]"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  {/* Quote SVG */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                    <path d="M0 20L10 0H16.6667L10 20V40H0V20ZM23.3333 20L33.3333 0H40L33.3333 20V40H23.3333V20Z" fill="url(#paint0_linear)" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#33C3F0" />
                        <stop offset="1" stopColor="#D946EF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                <p className="text-white/80 mb-6 flex-grow">"{testimonial.quote}"</p>
                
                <div className="flex items-center mt-auto">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-white/10">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </Avatar>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-white/60">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
