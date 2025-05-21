
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  walletType: string | null;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Check if wallet is already connected on load
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setAddress(walletData.address);
        setWalletType(walletData.type);
        setIsConnected(true);
      } catch (error) {
        console.error("Error parsing wallet data", error);
      }
    }
  }, []);

  // Mock wallet connection function
  const connectWallet = async (type: string) => {
    try {
      // This is just a mock implementation
      // In a real app, this would use actual wallet connection logic
      const mockAddresses: Record<string, string> = {
        metamask: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        walletconnect: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        coinbase: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
      };
      
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAddress = mockAddresses[type] || `0x${Math.random().toString(16).substr(2, 40)}`;
      
      // Save to state and localStorage
      setAddress(newAddress);
      setWalletType(type);
      setIsConnected(true);
      
      localStorage.setItem("wallet", JSON.stringify({
        address: newAddress,
        type: type
      }));
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${type} wallet`,
      });
      
      return;
    } catch (error) {
      console.error("Error connecting wallet", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setWalletType(null);
    setIsConnected(false);
    localStorage.removeItem("wallet");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        walletType,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
