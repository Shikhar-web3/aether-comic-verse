
# ComicCosmos Setup Guide 🚀

This guide will help you set up the complete ComicCosmos platform, including frontend, backend, and smart contracts.

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **MetaMask** browser extension
- **VS Code** (recommended) with Solidity extension

### Required Accounts & Services
- **OpenAI Account** - [Sign up](https://platform.openai.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Alchemy Account** (for blockchain) - [Sign up](https://alchemy.com/)
- **Pinata Account** (for IPFS) - [Sign up](https://pinata.cloud/)

## 🏗️ Project Structure

```
comiccosmos/
├── src/                    # Frontend React application
├── contracts/              # Solidity smart contracts
├── scripts/               # Deployment scripts
├── supabase/              # Backend configuration
├── public/                # Static assets
├── docs/                  # Documentation
└── tests/                 # Test files
```

## 🚀 Quick Start (Demo Mode)

For immediate testing without external services:

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/comiccosmos.git
   cd comiccosmos
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Open http://localhost:5173
   - Use demo credentials: `demo@comiccosmos.com` / `demo123`

## ⚙️ Full Production Setup

### Step 1: Environment Configuration

Create `.env.local` file in the root directory:

```env
# Frontend Configuration
VITE_APP_NAME=ComicCosmos
VITE_APP_VERSION=1.0.0

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Blockchain Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_CHAIN_ID=11155111

# IPFS Configuration
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key

# Story Protocol Configuration
VITE_STORY_PROTOCOL_API_KEY=your_story_protocol_key
VITE_STORY_PROTOCOL_CHAIN_ID=11155111

# Contract Addresses (update after deployment)
VITE_COMIC_NFT_ADDRESS=0x...
VITE_ROYALTY_DISTRIBUTOR_ADDRESS=0x...
VITE_COLLABORATION_MANAGER_ADDRESS=0x...
VITE_LICENSING_CONTRACT_ADDRESS=0x...
```

### Step 2: Supabase Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Note your project URL and anon key

2. **Database Setup**
   ```sql
   -- Run these SQL commands in Supabase SQL Editor
   
   -- Enable Row Level Security
   ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
   
   -- Create profiles table
   CREATE TABLE public.profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     username TEXT UNIQUE,
     full_name TEXT,
     avatar_url TEXT,
     bio TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     PRIMARY KEY (id)
   );
   
   -- Create other tables (comics, panels, characters, etc.)
   -- See full schema in database/schema.sql
   ```

3. **Authentication Setup**
   - Go to Authentication > Settings
   - Configure email templates
   - Set site URL and redirect URLs
   - Enable email confirmations (optional for production)

4. **Storage Setup**
   - Go to Storage
   - Create bucket named "comics"
   - Set up appropriate policies

### Step 3: Smart Contract Deployment

1. **Install Contract Dependencies**
   ```bash
   # Install Hardhat and dependencies
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npm install @openzeppelin/contracts
   ```

2. **Configure Hardhat**
   Create `.env` file for contract deployment:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
   MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_infura_key
   POLYGON_RPC_URL=https://polygon-rpc.com
   ETHERSCAN_API_KEY=your_etherscan_api_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ```

3. **Deploy Contracts**
   ```bash
   # Compile contracts
   npx hardhat compile
   
   # Deploy to local network
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   
   # Deploy to testnet
   npx hardhat run scripts/deploy.js --network sepolia
   
   # Deploy to mainnet (when ready)
   npx hardhat run scripts/deploy.js --network mainnet
   ```

4. **Verify Contracts**
   ```bash
   # Verify on Etherscan
   npx hardhat verify --network sepolia CONTRACT_ADDRESS
   ```

### Step 4: API Configuration

1. **OpenAI API Setup**
   - Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add to Supabase secrets or environment variables
   - Configure rate limits and usage monitoring

2. **IPFS Setup (Pinata)**
   - Create account at [Pinata](https://pinata.cloud/)
   - Generate API keys
   - Configure upload settings

3. **Blockchain RPC Setup**
   - Create account at [Alchemy](https://alchemy.com/)
   - Create apps for desired networks
   - Get RPC URLs and API keys

### Step 5: Frontend Configuration

1. **Update Contract Addresses**
   ```typescript
   // src/config/contracts.ts
   export const CONTRACTS = {
     ComicNFT: "0x...", // Your deployed contract address
     RoyaltyDistributor: "0x...",
     CollaborationManager: "0x...",
     LicensingContract: "0x..."
   };
   ```

2. **Configure Web3 Provider**
   ```typescript
   // src/config/web3.ts
   export const WEB3_CONFIG = {
     chainId: 11155111, // Sepolia testnet
     rpcUrl: process.env.VITE_ALCHEMY_API_KEY,
     blockExplorer: "https://sepolia.etherscan.io"
   };
   ```

## 🧪 Testing

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Component testing
npm run test:components
```

### Smart Contract Testing
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Gas reporting
REPORT_GAS=true npx hardhat test

# Coverage
npx hardhat coverage
```

## 🚀 Deployment

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Backend Deployment

1. **Supabase Edge Functions**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Deploy functions
   supabase functions deploy generate-comic-panel
   supabase functions deploy generate-script
   ```

## 🔧 Configuration Files

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "compile-contracts": "hardhat compile",
    "deploy-contracts": "hardhat run scripts/deploy.js",
    "start-node": "hardhat node"
  }
}
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
})
```

## 🛡️ Security Considerations

### Smart Contract Security
- Use OpenZeppelin contracts for security standards
- Implement proper access controls
- Add emergency pause mechanisms
- Conduct thorough testing
- Consider professional audits for mainnet

### Frontend Security
- Validate all user inputs
- Implement proper error handling
- Use secure communication (HTTPS)
- Store sensitive data securely
- Implement rate limiting

### API Security
- Use environment variables for secrets
- Implement proper authentication
- Add rate limiting
- Monitor API usage
- Use secure headers

## 📊 Monitoring & Analytics

### Performance Monitoring
```bash
# Install monitoring tools
npm install @sentry/react @sentry/tracing
```

### Analytics Setup
- Google Analytics for user tracking
- Custom events for feature usage
- Error tracking with Sentry
- Performance monitoring

## 🔄 Updates & Maintenance

### Regular Updates
- Update dependencies monthly
- Monitor security advisories
- Update documentation
- Run automated tests

### Database Maintenance
- Monitor query performance
- Optimize slow queries
- Regular backups
- Update RLS policies as needed

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Contract Deployment Issues**
   ```bash
   # Check network configuration
   npx hardhat console --network sepolia
   
   # Verify account balance
   await ethers.provider.getBalance(accounts[0])
   ```

3. **Supabase Connection Issues**
   - Verify project URL and keys
   - Check CORS settings
   - Verify RLS policies

4. **MetaMask Issues**
   - Reset account in MetaMask
   - Check network configuration
   - Clear browser cache

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check contract interactions
npx hardhat console --network localhost
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)

### Community
- [ComicCosmos Discord](https://discord.gg/comiccosmos)
- [GitHub Discussions](https://github.com/comiccosmos/discussions)
- [Developer Blog](https://blog.comiccosmos.io)

### Support
- Email: support@comiccosmos.io
- Discord: #developer-support
- GitHub Issues: Report bugs and feature requests

---

**Need help?** Join our [Discord community](https://discord.gg/comiccosmos) or create an issue on [GitHub](https://github.com/comiccosmos/issues).

**Happy building! 🚀**
