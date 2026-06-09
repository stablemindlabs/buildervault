import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

const OPN_CHAIN = {
  chainId: "0x3D8",
  chainName: "OPN Chain Testnet",
  nativeCurrency: { name: "OPN", symbol: "OPN", decimals: 18 },
  rpcUrls: ["https://testnet-rpc.iopn.tech"],
  blockExplorerUrls: ["https://testnet.iopn.tech"],
};

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: OPN_CHAIN.chainId }],
      });
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [OPN_CHAIN],
        });
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    if (accounts?.[0]) {
      setAddress(accounts[0]);
      await switchNetwork();
    }
  }, [switchNetwork]);

  const disconnect = useCallback(() => setAddress(null), []);

  // Auto-detect existing connection on page load
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = (await window.ethereum!.request({
          method: "eth_accounts",
        })) as string[];
        if (accounts?.[0]) {
          setAddress(accounts[0]);
        }
      } catch {
        // ignore
      }
    };
    void checkConnection();

    // Listen for account changes
    const handler = (...args: unknown[]) => {
      const accs = args[0] as string[];
      setAddress(accs?.[0] ?? null);
    };
    window.ethereum.on?.("accountsChanged", handler);
    return () => window.ethereum?.removeListener?.("accountsChanged", handler);
  }, []);

  return { address, shortAddress, isConnected: !!address, connect, disconnect };
}