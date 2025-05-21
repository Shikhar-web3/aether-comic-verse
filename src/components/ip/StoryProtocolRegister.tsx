
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Zap, BookOpen, FileText, X, Check } from "lucide-react";

interface StoryProtocolRegisterProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  comicTitle?: string;
  comicPreviewImage?: string;
}

const StoryProtocolRegister: React.FC<StoryProtocolRegisterProps> = ({ 
  isOpen, 
  setIsOpen,
  comicTitle = "Cosmic Adventures",
  comicPreviewImage
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: comicTitle,
    description: "",
    characters: "",
    genre: "",
    licenseType: "CC BY-SA 4.0"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsRegistering(true);
    
    // Simulate registration process with Story Protocol
    setTimeout(() => {
      setIsRegistering(false);
      setIsSuccess(true);
      
      // Show success toast
      toast({
        title: "IP Registration Successful",
        description: "Your comic has been registered on Story Protocol",
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        setIsOpen(false);
      }, 3000);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isRegistering) setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white/5 backdrop-blur-md border border-white/10">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-orbitron text-xl">
                Register Comic IP on Story Protocol
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Protect your intellectual property and enable licensing through Story Protocol's blockchain registry.
              </DialogDescription>
            </DialogHeader>

            {step === 1 && (
              <div className="space-y-4 py-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-electric-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Why register with Story Protocol?</h4>
                      <p className="text-sm text-white/60">
                        Story Protocol enables creators to register IP on-chain, control licensing, and earn from derivative works while maintaining ownership.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Comic Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="A brief description of your comic..."
                      className="bg-white/5 border-white/10 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Main Characters</label>
                    <Input
                      name="characters"
                      value={formData.characters}
                      onChange={handleChange}
                      placeholder="Comma separated list of characters"
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Genre</label>
                    <Input
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      placeholder="e.g., Sci-Fi, Fantasy, Cyberpunk"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 py-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-electric-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">License Type</h4>
                      <p className="text-sm text-white/60">
                        Choose how others can use your comic. This can be changed later.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                    <div>
                      <h3 className="font-medium">CC BY-SA 4.0</h3>
                      <p className="text-sm text-white/60">Attribution-ShareAlike</p>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-electric-blue flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                    <div>
                      <h3 className="font-medium">CC BY-NC 4.0</h3>
                      <p className="text-sm text-white/60">Attribution-NonCommercial</p>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-white/10"></div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                    <div>
                      <h3 className="font-medium">All Rights Reserved</h3>
                      <p className="text-sm text-white/60">No derivatives allowed</p>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-white/10"></div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                    <div>
                      <h3 className="font-medium">Custom License</h3>
                      <p className="text-sm text-white/60">Define custom terms</p>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-white/10"></div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
              {step === 1 ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-white/10 hover:bg-white/5"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-electric-blue to-neon-purple"
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="border-white/10 hover:bg-white/5"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isRegistering}
                    className="bg-gradient-to-r from-electric-blue to-neon-purple"
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" /> Register IP
                      </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple flex items-center justify-center mb-6 animate-pulse">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="font-orbitron text-xl mb-2">Registration Complete!</h2>
            <p className="text-white/70 text-center mb-6">
              Your comic has been successfully registered on Story Protocol
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-white/10 hover:bg-white/5"
                onClick={() => {
                  setIsSuccess(false);
                  setStep(1);
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
              <Button 
                className="bg-gradient-to-r from-electric-blue to-neon-purple"
                onClick={() => {
                  setIsSuccess(false);
                  setStep(1);
                  setIsOpen(false);
                }}
              >
                View Certificate
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryProtocolRegister;
