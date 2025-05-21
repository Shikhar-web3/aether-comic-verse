
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Link, Share } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConnect: (wallet: string) => void;
}

const WalletModal = ({ isOpen, setIsOpen, onConnect }: WalletModalProps) => {
  const wallets = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "M23.5167 3.32731L13.8952 11.1815L15.475 6.25882L23.5167 3.32731Z",
      description: "Connect to your MetaMask Wallet",
      color: "#E2761B"
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "M6.375 9.375a9.375 9.375 0 0 1 13.24 0l.44.45.439.451a.469.469 0 0 1 0 .659l-1.5 1.54a.234.234 0 0 1-.328 0l-.604-.618a6.563 6.563 0 0 0-9.258 0l-.646.664a.234.234 0 0 1-.329 0l-1.5-1.54a.469.469 0 0 1 0-.659l.483-.494.379-.39Zm16.369 3.195 1.335 1.373a.469.469 0 0 1 0 .659l-6.01 6.177a.469.469 0 0 1-.663 0l-4.264-4.381a.117.117 0 0 0-.166 0l-4.264 4.381a.469.469 0 0 1-.663 0l-6.01-6.177a.469.469 0 0 1 0-.659l1.334-1.373a.469.469 0 0 1 .663 0l4.265 4.382a.117.117 0 0 0 .165 0l4.265-4.382a.469.469 0 0 1 .663 0l4.265 4.382a.117.117 0 0 0 .165 0l4.265-4.382a.469.469 0 0 1 .663 0Z",
      description: "Scan with WalletConnect to connect",
      color: "#3B99FC"
    },
    {
      id: "coinbase",
      name: "Coinbase",
      icon: "M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm0 20c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zm0-4.5c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5-4.5 2-4.5 4.5 2 4.5 4.5 4.5z",
      description: "Connect to your Coinbase Wallet",
      color: "#0052FF"
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-md border border-white/10">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-white/70">
            Connect your wallet to access Web3 features like IP registration with Story Protocol.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="flex items-center justify-between w-full p-6 border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              onClick={() => onConnect(wallet.id)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${wallet.color}20` }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={wallet.color}
                  >
                    <path d={wallet.icon} />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold">{wallet.name}</div>
                  <div className="text-sm text-white/60">{wallet.description}</div>
                </div>
              </div>
              <div className="text-white/60">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-2">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                <Link className="h-5 w-5 text-electric-blue" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">New to Web3?</h4>
                <p className="text-sm text-white/60 mb-3">
                  Learn how to set up a wallet and connect to Web3 applications securely.
                </p>
                <Button variant="outline" size="sm" className="border-electric-blue/20 hover:bg-electric-blue/10 text-electric-blue">
                  <Share className="mr-2 h-4 w-4" /> Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
