import { motion } from "framer-motion";
import { Hammer, Lock, FileCode2 } from "lucide-react";

const STATS = [
  { icon: Hammer, label: "Builders Registered", value: "Growing" },
  { icon: Lock, label: "OPN Tokens Locked", value: "On-chain" },
  { icon: FileCode2, label: "Contracts Deployed", value: "Verified" },
];

export function StatsBanner() {
  return (
    <section id="community" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#7C3AED] to-[#2563EB] p-10 md:p-14">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative grid gap-10 md:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex flex-col items-center text-center text-white">
                <s.icon size={28} className="mb-3 opacity-80" />
                <p className="font-display text-4xl font-bold md:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm text-white/80">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <p className="relative mt-10 text-center text-xs text-white/70">Live data from OPN Chain Testnet</p>
        </div>
      </div>
    </section>
  );
}
