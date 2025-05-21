
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  walletType: string | null;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
  balance: string;
  chainId: number | null;
  networkName: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("0.00");
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);

  // Check if wallet is already connected on load
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setAddress(walletData.address);
        setWalletType(walletData.type);
        setIsConnected(true);
        setBalance(walletData.balance || "0.00");
        setChainId(walletData.chainId || 1);
        
        // Map chainId to network name
        const networks: Record<number, string> = {
          1: "Ethereum Mainnet",
          137: "Polygon",
          43114: "Avalanche",
          10: "Optimism",
          42161: "Arbitrum",
        };
        setNetworkName(networks[walletData.chainId || 1] || "Unknown Network");
      } catch (error) {
        console.error("Error parsing wallet data", error);
      }
    }
  }, []);

  // Connect wallet with animation to simulate real wallet connection
  const connectWallet = async (type: string) => {
    try {
      toast({
        title: "Connecting wallet...",
        description: `Requesting connection to ${type}...`,
      });
      
      // This is just a mock implementation
      // In a real app, this would use actual wallet connection logic
      const mockAddresses: Record<string, {address: string, chainId: number, balance: string}> = {
        metamask: {
          address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 
          chainId: 1, 
          balance: "1.245"
        },
        walletconnect: {
          address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", 
          chainId: 137, 
          balance: "245.12"
        },
        coinbase: {
          address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", 
          chainId: 43114, 
          balance: "0.078"
        }
      };
      
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const walletInfo = mockAddresses[type] || {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        chainId: 1,
        balance: (Math.random() * 10).toFixed(4)
      };
      
      // Map chainId to network name
      const networks: Record<number, string> = {
        1: "Ethereum Mainnet",
        137: "Polygon",
        43114: "Avalanche",
        10: "Optimism",
        42161: "Arbitrum"
      };
      
      // Save to state and localStorage
      setAddress(walletInfo.address);
      setWalletType(type);
      setIsConnected(true);
      setBalance(walletInfo.balance);
      setChainId(walletInfo.chainId);
      setNetworkName(networks[walletInfo.chainId] || "Unknown Network");
      
      localStorage.setItem("wallet", JSON.stringify({
        address: walletInfo.address,
        type: type,
        chainId: walletInfo.chainId,
        balance: walletInfo.balance
      }));
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${type} wallet on ${networks[walletInfo.chainId] || "Unknown Network"}`,
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
    setBalance("0.00");
    setChainId(null);
    setNetworkName(null);
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
        balance,
        chainId,
        networkName
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
