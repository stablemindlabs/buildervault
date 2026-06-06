import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

const EXPLORER = "https://testnet.iopn.tech/address/0x876d81a05900aa02Da17320cB521ce1FF19F720A";

export function Hero() {
  const { connect } = useWallet();
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mesh-bg absolute inset-0 -z-10" />
      <div className="dot-grid absolute inset-0 -z-10 opacity-50" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#6EE7B7]/40 bg-[#6EE7B7]/5 px-3.5 py-1.5 text-xs font-medium text-[#6EE7B7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7] shadow-[0_0_8px_#6EE7B7]" />
            OPN Builders Season 1 - Now Live
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Your On-Chain Identity,{" "}
            <span className="gradient-text">Built One Season at a Time.</span>
          </h1>
          <p className="max-w-xl text-base text-white/60 md:text-lg">
            BuilderVault scores your Web3 builder reputation based on verified contract deployments on OPN Chain. Lock your commitment, earn your level, build your legacy.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={connect} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-6 py-3.5 text-sm font-semibold text-[#0A0F1E] transition-all hover:shadow-[0_0_40px_rgba(110,231,183,0.5)]">
              Connect Wallet and Get Scored
            </button>
            <a href={EXPLORER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
              View on Explorer <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-[#6EE7B7]/20 via-[#22D3EE]/10 to-[#7C3AED]/20 blur-3xl" />
          <div className="animate-float glass-card relative p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white/50">WALLET</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6EE7B7]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6EE7B7]">
                <CheckCircle2 size={12} /> Locked
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-white">0x1a2b...3c4d</p>
            <div className="my-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-white/50">Builder Score</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="gradient-text font-display text-6xl font-bold">75</span>
                <span className="text-sm text-white/40">/ 100</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Level" value="Senior" sub="Builder" />
              <Stat label="Contracts" value="8" sub="Deployed" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/50">{sub}</p>
    </div>
  );
}
