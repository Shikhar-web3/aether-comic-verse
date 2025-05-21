
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Share2, FileCode, FileCheck } from "lucide-react";

interface StoryProtocolInfoProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const StoryProtocolInfo: React.FC<StoryProtocolInfoProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg bg-white/5 backdrop-blur-md border border-white/10">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-electric-blue" />
            Story Protocol Integration
          </DialogTitle>
          <DialogDescription className="text-white/70">
            How ComicCosmos uses Story Protocol to protect your intellectual property
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyber-pink" />
              What is Story Protocol?
            </h3>
            <p className="text-white/80 leading-relaxed">
              Story Protocol is an open-source toolkit that enables creators to establish, protect, 
              and monetize their intellectual property (IP) rights on the blockchain. It provides 
              a decentralized framework for registering, licensing, and managing creative works.
            </p>
          </div>
          
          <div className="space-y-4 bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="font-medium">How your comics are stored on Story Protocol:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                  <FileCode className="h-4 w-4 text-electric-blue" />
                </div>
                <div>
                  <h5 className="font-medium">IP Registration</h5>
                  <p className="text-sm text-white/60">Your comic metadata and ownership rights are registered on-chain</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                  <FileCheck className="h-4 w-4 text-electric-blue" />
                </div>
                <div>
                  <h5 className="font-medium">Content Verification</h5>
                  <p className="text-sm text-white/60">Cryptographic proofs establish authenticity and original creation</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                  <Share2 className="h-4 w-4 text-electric-blue" />
                </div>
                <div>
                  <h5 className="font-medium">Revenue Sharing</h5>
                  <p className="text-sm text-white/60">Smart contracts automatically distribute royalties to all collaborators</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-electric-blue" />
                </div>
                <div>
                  <h5 className="font-medium">Licensing Control</h5>
                  <p className="text-sm text-white/60">You control how your IP can be used, remixed, or monetized</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Technical Implementation</h3>
            <p className="text-white/80 leading-relaxed">
              When you register your comic's IP, we store the comic's metadata, ownership details, and 
              licensing terms on Story Protocol's smart contracts. The comic's content itself is stored 
              as encrypted data using IPFS (InterPlanetary File System) with the content hash recorded 
              on-chain for verification. This ensures your work is permanently accessible while maintaining 
              your ownership rights.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={() => window.open("https://storyprotocol.xyz/docs", "_blank")}
            variant="outline"
            className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10"
          >
            Learn More
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-electric-blue to-neon-purple"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoryProtocolInfo;
