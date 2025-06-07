
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting ComicCosmos smart contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Platform wallet address (replace with actual address)
  const PLATFORM_WALLET = deployer.address; // For demo, using deployer address

  try {
    // 1. Deploy ComicNFT contract
    console.log("\n📚 Deploying ComicNFT contract...");
    const ComicNFT = await ethers.getContractFactory("ComicNFT");
    const comicNFT = await ComicNFT.deploy(
      "ComicCosmos NFT",
      "COMIC",
      PLATFORM_WALLET
    );
    await comicNFT.deployed();
    console.log("✅ ComicNFT deployed to:", comicNFT.address);

    // 2. Deploy RoyaltyDistributor contract
    console.log("\n💰 Deploying RoyaltyDistributor contract...");
    const RoyaltyDistributor = await ethers.getContractFactory("RoyaltyDistributor");
    const royaltyDistributor = await RoyaltyDistributor.deploy(PLATFORM_WALLET);
    await royaltyDistributor.deployed();
    console.log("✅ RoyaltyDistributor deployed to:", royaltyDistributor.address);

    // 3. Deploy CollaborationManager contract
    console.log("\n🤝 Deploying CollaborationManager contract...");
    const CollaborationManager = await ethers.getContractFactory("CollaborationManager");
    const collaborationManager = await CollaborationManager.deploy();
    await collaborationManager.deployed();
    console.log("✅ CollaborationManager deployed to:", collaborationManager.address);

    // 4. Deploy LicensingContract
    console.log("\n📄 Deploying LicensingContract...");
    const LicensingContract = await ethers.getContractFactory("LicensingContract");
    const licensingContract = await LicensingContract.deploy(
      PLATFORM_WALLET,
      comicNFT.address
    );
    await licensingContract.deployed();
    console.log("✅ LicensingContract deployed to:", licensingContract.address);

    // Verification wait
    console.log("\n⏳ Waiting for block confirmations...");
    await comicNFT.deployTransaction.wait(6);
    await royaltyDistributor.deployTransaction.wait(6);
    await collaborationManager.deployTransaction.wait(6);
    await licensingContract.deployTransaction.wait(6);

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Deployment Summary:");
    console.log("=====================================");
    console.log("📚 ComicNFT:", comicNFT.address);
    console.log("💰 RoyaltyDistributor:", royaltyDistributor.address);
    console.log("🤝 CollaborationManager:", collaborationManager.address);
    console.log("📄 LicensingContract:", licensingContract.address);
    console.log("=====================================");

    // Save deployment info to file
    const deploymentInfo = {
      network: await ethers.provider.getNetwork(),
      deployer: deployer.address,
      contracts: {
        ComicNFT: comicNFT.address,
        RoyaltyDistributor: royaltyDistributor.address,
        CollaborationManager: collaborationManager.address,
        LicensingContract: licensingContract.address
      },
      deployedAt: new Date().toISOString()
    };

    console.log("\n💾 Deployment info saved for frontend integration");
    console.log("🔗 Add these addresses to your frontend configuration");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n✨ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
