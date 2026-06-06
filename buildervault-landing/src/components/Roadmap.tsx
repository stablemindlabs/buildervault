import { motion } from "framer-motion";
import { SectionHeader } from "./HowItWorks";

const SEASONS = [
  { s: "S1", quarter: "Now - Live", title: "Builder Treasury", desc: "Deploy scoring + commitment vault. Live on OPN Chain.", active: true },
  { s: "S2", quarter: "Q2 2026", title: "Identity & Reputation", desc: "On-chain builder profiles + verified badges.", active: false },
  { s: "S3", quarter: "Q3 2026", title: "Portfolio NFT", desc: "Verifiable on-chain credentials as NFTs.", active: false },
  { s: "S4", quarter: "Q4 2026", title: "AI Mentor", desc: "Personalized guidance from your on-chain build history.", active: false },
  { s: "S5", quarter: "Q1 2027", title: "Quest System & Guild", desc: "Gamified builder journey + team guilds.", active: false },
  { s: "S6", quarter: "Q2 2027", title: "Full Platform + BVLT", desc: "Token launch, full tokenomics, DEX listing.", active: false },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeader title="6 Seasons. One Platform." subtitle="BuilderVault evolves every season with new features, rewards, and infrastructure." />
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[#6EE7B7]/40 via-white/10 to-transparent md:left-1/2" />
          <div className="space-y-10">
            {SEASONS.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div key={s.s} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: i * 0.05 }} className={`relative flex items-start gap-6 md:items-center ${left ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden flex-1 md:block" />
                  <div className="absolute left-4 top-5 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-bold ${s.active ? "border-[#6EE7B7] bg-[#6EE7B7] text-[#0A0F1E] shadow-[0_0_20px_rgba(110,231,183,0.6)]" : "border-white/20 bg-[#0A0F1E] text-white/70"}`}>
                      {s.s}
                    </div>
                  </div>
                  <div className="ml-12 flex-1 md:ml-0">
                    <div className={`glass-card p-5 transition-all ${s.active ? "border-[#6EE7B7]/40 shadow-[0_0_40px_rgba(110,231,183,0.18)]" : "opacity-80"}`}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-xs uppercase tracking-wider text-white/50">{s.quarter}</span>
                        {s.active ? (
                          <span className="rounded-full bg-[#6EE7B7]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6EE7B7]">Active</span>
                        ) : (
                          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">Coming Soon</span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-white/60">{s.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
