import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { BuilderTreasuryABI, CONTRACT_ADDRESS } from "@/lib/BuilderTreasuryABI";

export interface BuilderInfo {
  amount: string;       // dalam OPN (sudah di-format)
  project: string;
  since: number;        // unix timestamp
  hasDeposit: boolean;
}

export interface Stats {
  builders: number;
  totalFunds: string;   // dalam OPN (sudah di-format)
}

export function useContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [builderInfo, setBuilderInfo] = useState<BuilderInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const getContract = useCallback(async (withSigner = false) => {
    if (!window.ethereum) throw new Error("No wallet found");
    const provider = new BrowserProvider(window.ethereum);
    if (withSigner) {
      const signer = await provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, BuilderTreasuryABI, signer);
    }
    return new Contract(CONTRACT_ADDRESS, BuilderTreasuryABI, provider);
  }, []);

  const fetchBuilderInfo = useCallback(async (address: string) => {
    try {
      const contract = await getContract(false);
      const result = await contract.getBuilderInfo(address);
      setBuilderInfo({
        amount: formatEther(result.amount),
        project: result.project,
        since: Number(result.since),
        hasDeposit: result.amount > 0n,
      });
    } catch {
      setBuilderInfo(null);
    }
  }, [getContract]);

  const fetchStats = useCallback(async () => {
    try {
      const contract = await getContract(false);
      const result = await contract.getStats();
      setStats({
        builders: Number(result.builders),
        totalFunds: formatEther(result.totalFunds),
      });
    } catch {
      setStats(null);
    }
  }, [getContract]);

  const lockCommitment = useCallback(async (projectName: string, amountOPN: string) => {
    setError(null);
    setTxHash(null);

    if (!projectName.trim()) {
      setError("Project name cannot be empty.");
      return false;
    }

    const amount = parseFloat(amountOPN);
    if (isNaN(amount) || amount < 10) {
      setError("Minimum deposit is 10 OPN.");
      return false;
    }

    try {
      setIsLoading(true);
      const contract = await getContract(true);
      const tx = await contract.deposit(projectName.trim(), {
        value: parseEther(amountOPN),
      });
      setTxHash(tx.hash);
      await tx.wait();
      await fetchStats();
      return true;
    } catch (err: unknown) {
      const e = err as { reason?: string; message?: string };
      setError(e.reason ?? e.message ?? "Transaction failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchStats]);

  const withdrawFunds = useCallback(async () => {
    setError(null);
    setTxHash(null);
    try {
      setIsLoading(true);
      const contract = await getContract(true);
      const tx = await contract.withdraw();
      setTxHash(tx.hash);
      await tx.wait();
      await fetchStats();
      return true;
    } catch (err: unknown) {
      const e = err as { reason?: string; message?: string };
      setError(e.reason ?? e.message ?? "Withdraw failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getContract, fetchStats]);

  useEffect(() => {
  const load = async () => {
    await fetchStats();
  };
  void load();
}, [fetchStats]);

  return {
    isLoading,
    txHash,
    error,
    builderInfo,
    stats,
    lockCommitment,
    withdrawFunds,
    fetchBuilderInfo,
    fetchStats,
  };
}