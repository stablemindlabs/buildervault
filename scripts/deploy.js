import hre from "hardhat";

async function main() {
  console.log("Deploying BuilderTreasury...");

  const BuilderTreasury = await hre.ethers.getContractFactory("BuilderTreasury");
  const builderTreasury = await BuilderTreasury.deploy();

  await builderTreasury.waitForDeployment();

  const address = await builderTreasury.getAddress();
  console.log("✅ BuilderTreasury deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});