import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";

const BULLETS = [
  "Minimum 10 OPN to lock",
  "Locked for 30 days minimum",
  "Earn +50 BVLT when Season 6 launches",
];

const EXPLORER = "https://testnet.iopn.tech";

export function LockCommitment() {
  const { isConnected, connect, address } = useWallet();
  const { isLoading, txHash, error, stats, builderInfo, lockCommitment, fetchBuilderInfo } = useContract();
  const [projectName, setProjectName] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (address) fetchBuilderInfo(address);
  }, [address, fetchBuilderInfo]);

  const handleLock = async () => {
    if (!isConnected) { connect(); return; }
    setSuccess(false);
    const ok = await lockCommitment(projectName, amount);
    if (ok) {
      setSuccess(true);
      setProjectName("");
      setAmount("");
      if (address) fetchBuilderInfo(address);
    }
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Put OPN on the Line.{" "}
              <span className="gradient-text">Prove You are Serious.</span>
            </h2>
            <p className="mt-5 max-w-lg text-white/60 md:text-lg">
              Locking OPN tokens signals you are committed to building. It is not just staking, it is a public declaration of intent, recorded on-chain forever.
            </p>
            <ul className="mt-8 space-y-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6EE7B7]/15 text-[#6EE7B7]">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            {stats && (
              <div className="mt-8 flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.builders}</p>
                  <p className="text-xs text-white/50">Builders Locked</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {parseFloat(stats.totalFunds).toFixed(2)} OPN
                  </p>
                  <p className="text-xs text-white/50">Total Locked</p>
                </div>
              </div>
            )}
            <p className="mt-8 text-sm text-white/50">
              Your deposit is always withdrawable. No protocol risk.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-[#6EE7B7]/15 via-[#22D3EE]/10 to-[#7C3AED]/20 blur-3xl" />
            <div className="glass-card p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Lock Commitment</h3>
                <span className="rounded-full border border-[#6EE7B7]/30 bg-[#6EE7B7]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6EE7B7]">
                  Live
                </span>
              </div>

              {builderInfo?.hasDeposit && (
                <div className="mt-4 rounded-xl border border-[#6EE7B7]/20 bg-[#6EE7B7]/5 px-4 py-3">
                  <p className="text-xs text-[#6EE7B7]">
                    You have {parseFloat(builderInfo.amount).toFixed(2)} OPN locked for {builderInfo.project}
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                    Project Name
                  </label>
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My DeFi Protocol"
                    disabled={isLoading}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                    Amount OPN
                  </label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10 OPN minimum"
                    type="number"
                    min="10"
                    disabled={isLoading}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:border-[#6EE7B7]/40 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {success && txHash && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#6EE7B7]/20 bg-[#6EE7B7]/10 px-4 py-3">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#6EE7B7]" />
                  <div>
                    <p className="text-xs text-[#6EE7B7]">Commitment locked on-chain!</p>
                    <a
                      href={EXPLORER + "/tx/" + txHash}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-[11px] text-[#6EE7B7]/70 hover:text-[#6EE7B7]"
                    >
                      View on Explorer <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              )}

              <button
                onClick={handleLock}
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-6 py-3.5 text-sm font-semibold text-[#0A0F1E] transition-all hover:shadow-[0_0_40px_rgba(110,231,183,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Processing...</>
                ) : isConnected ? (
                  "Lock Commitment"
                ) : (
                  "Connect Wallet to Lock"
                )}
              </button>

              <p className="mt-4 text-center text-[11px] text-white/40">
                Powered by BuilderTreasury Smart Contract
              </p>
              <p className="mt-1 break-all text-center font-mono text-[11px] text-[#6EE7B7]/80">
                0x876d...F720A
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}