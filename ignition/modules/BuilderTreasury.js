import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BuilderTreasuryModule = buildModule("BuilderTreasuryModule", (m) => {
  const builderTreasury = m.contract("BuilderTreasury");
  return { builderTreasury };
});

export default BuilderTreasuryModule;