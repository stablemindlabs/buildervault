import { motion } from "framer-motion";
import { SectionHeader } from "./HowItWorks";

const TIERS = [
  { name: "Newcomer", score: "0-20", contracts: "0-2", perks: ["Access to BuilderVault platform", "Basic profile"], color: "rgba(255,255,255,0.5)", ring: "ring-white/15", badge: null as string | null, elite: false },
  { name: "Builder", score: "30-50", contracts: "3-5", perks: ["Builder badge", "Community access", "Lock Commitment eligible"], color: "#2563EB", ring: "ring-[#2563EB]/40", badge: null, elite: false },
  { name: "Senior Builder", score: "60-100", contracts: "6-10", perks: ["Senior badge", "Priority features", "BVLT bonus multiplier"], color: "#7C3AED", ring: "ring-[#7C3AED]/40", badge: "Most Active", elite: false },
  { name: "Master Builder", score: "100+", contracts: "11+", perks: ["Master badge", "Governance rights", "Max BVLT rewards", "Early access all features"], color: "linear-gradient(135deg,#6EE7B7,#22D3EE)", ring: "ring-[#6EE7B7]/50", badge: "Elite", elite: true },
];

export function BuilderLevels() {
  return (
    <section id="levels" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title="Builder Levels" subtitle="Your score is determined by verified smart contract deployments on OPN Chain." />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: i * 0.08 }} className={`glass-card group relative p-6 ring-1 transition-all duration-300 hover:-translate-y-1 ${t.ring}`}>
              {t.badge && (
                <span className="absolute -top-3 right-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: t.elite ? "linear-gradient(135deg,#6EE7B7,#22D3EE)" : "#7C3AED", color: t.elite ? "#0A0F1E" : "#fff" }}>
                  {t.badge}
                </span>
              )}
              <div className="h-2 w-12 rounded-full" style={{ background: t.color }} />
              <h3 className="font-display mt-4 text-2xl font-bold">{t.name}</h3>
              <div className="mt-5 space-y-2 border-b border-white/10 pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Score</span>
                  <span className="font-mono text-white">{t.score}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Contracts</span>
                  <span className="font-mono text-white">{t.contracts}</span>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[#6EE7B7]" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
