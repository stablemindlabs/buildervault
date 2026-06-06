import { Contract, formatEther, type Signer, type Provider } from "ethers";

export const CONTRACT_ADDRESS = "0x876d81a05900aa02Da17320cB521ce1FF19F720A";

export const CONTRACT_ABI = [
  "function deposit(string _projectName) payable",
  "function withdraw()",
  "function getBuilderInfo(address) view returns (uint256 amount, string projectName, uint256 timestamp)",
  "function getStats() view returns (uint256 totalBuilders, uint256 totalFunds)",
];

export function getContract(signerOrProvider: Signer | Provider) {
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export type BuilderLevel = "Newcomer" | "Builder" | "Senior Builder" | "Master Builder";

export interface BuilderScore {
  score: number;
  level: BuilderLevel;
  contracts: number;
  lockedAmount: string;
  projectName: string;
}

export function scoreFromContracts(contracts: number): { score: number; level: BuilderLevel } {
  if (contracts >= 11) return { score: 100 + (contracts - 11) * 5, level: "Master Builder" };
  if (contracts >= 6) return { score: 60 + (contracts - 6) * 10, level: "Senior Builder" };
  if (contracts >= 3) return { score: 30 + (contracts - 3) * 10, level: "Builder" };
  if (contracts >= 1) return { score: 10 + (contracts - 1) * 10, level: "Newcomer" };
  return { score: 0, level: "Newcomer" };
}

export async function getBuilderScore(
  address: string,
  provider: Provider,
  contractsDeployed = 0,
): Promise<BuilderScore> {
  const contract = getContract(provider);
  const info = (await contract.getBuilderInfo(address)) as [bigint, string, bigint];
  const { score, level } = scoreFromContracts(contractsDeployed);
  return {
    score,
    level,
    contracts: contractsDeployed,
    lockedAmount: formatEther(info[0]),
    projectName: info[1],
  };
}

export async function getStats(provider: Provider) {
  const contract = getContract(provider);
  const [totalBuilders, totalFunds] = (await contract.getStats()) as [bigint, bigint];
  return { totalBuilders: Number(totalBuilders), totalFunds: formatEther(totalFunds) };
}