
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { HelpCircle, Menu, Plus, Search, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import WalletModal from "../wallet/WalletModal";
import { useWallet } from "@/context/WalletContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { address, isConnected, walletType, connectWallet, disconnectWallet } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnectWallet = async (walletType: string) => {
    await connectWallet(walletType);
    setIsWalletModalOpen(false);
  };

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-lg bg-background/80 border-b border-white/10">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-neon-purple via-cyber-pink to-electric-blue p-0.5 animate-pulse-glow">
              <div className="w-full h-full bg-cosmic-black rounded-md flex items-center justify-center">
                <span className="font-orbitron font-bold text-xl text-white">C²</span>
              </div>
            </div>
            <span className="font-orbitron font-bold text-xl hidden sm:inline-block">
              Comic<span className="text-cyber-pink">Cosmos</span>
            </span>
          </Link>
        </div>

        <div className={`md:flex items-center gap-6 ${mobileMenuOpen ? 'absolute top-full left-0 right-0 flex flex-col bg-background/95 backdrop-blur-lg border-b border-white/10 p-4 space-y-2' : 'hidden'}`}>
          <Link to="/explore" className="text-white/80 hover:text-white transition-colors">
            Explore
          </Link>
          <Link to="/workshop" className="text-white/80 hover:text-white transition-colors">
            Workshop
          </Link>
          <Link to="/learn" className="text-white/80 hover:text-white transition-colors">
            Learn
          </Link>
          <Link to="/community" className="text-white/80 hover:text-white transition-colors">
            Community
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:text-white">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {!isConnected ? (
            <Button 
              onClick={() => setIsWalletModalOpen(true)}
              variant="outline" 
              className="border-white/10 hover:bg-white/5"
            >
              <User className="mr-2 h-4 w-4" /> Connect
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple mr-2"></div>
                  {formatAddress(address)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/5 backdrop-blur-md border border-white/10">
                <DropdownMenuLabel className="text-white/70">
                  {walletType} Wallet
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="cursor-pointer text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10"
                  onClick={disconnectWallet}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <div className="flex -space-x-2">
            {/* Connected users mockup */}
            <Avatar className="border-2 border-background w-8 h-8 hover:scale-110 transition-transform">
              <img src="https://i.pravatar.cc/100?img=1" alt="User" />
            </Avatar>
            <Avatar className="border-2 border-background w-8 h-8 hover:scale-110 transition-transform">
              <img src="https://i.pravatar.cc/100?img=2" alt="User" />
            </Avatar>
            <Avatar className="border-2 border-background w-8 h-8 hover:scale-110 transition-transform">
              <img src="https://i.pravatar.cc/100?img=3" alt="User" />
            </Avatar>
          </div>
          
          <Button 
            asChild
            className="ml-2 bg-gradient-to-r from-electric-blue to-neon-purple hover:opacity-90 transition-opacity"
          >
            <Link to="/workshop">
              <Plus className="mr-2 h-4 w-4" /> Create
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <WalletModal 
        isOpen={isWalletModalOpen} 
        setIsOpen={setIsWalletModalOpen} 
        onConnect={handleConnectWallet} 
      />
    </header>
  );
};

export default Header;
