import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";

export function FinalCTA() {
  const { connect } = useWallet();
  return (
    <section className="relative py-28 md:py-36">
      <div className="absolute inset-0 -z-10 mesh-bg" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6EE7B7]/10 blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <h2 className="font-display text-3xl font-bold leading-tight md:text-6xl">
          Ready to Build Your{" "}
          <span className="gradient-text">On-Chain Legacy?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/60 md:text-lg">
          Connect your wallet, get your Builder Score, and lock your commitment to OPN Chain.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button onClick={connect} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-8 py-4 text-base font-semibold text-[#0A0F1E] transition-all hover:shadow-[0_0_50px_rgba(110,231,183,0.55)]">
            Connect Wallet & Get Scored
          </button>
          <p className="text-xs text-white/50">No account needed. Just your wallet.</p>
        </div>
      </motion.div>
    </section>
  );
}
