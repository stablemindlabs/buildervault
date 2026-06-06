import { motion } from "framer-motion";
import { Link2, BarChart3, Lock } from "lucide-react";

const STEPS = [
  { icon: Link2, title: "Connect Wallet", desc: "Link your MetaMask or Web3 wallet. We scan your OPN Chain activity automatically." },
  { icon: BarChart3, title: "Get Scored", desc: "Your Builder Score is calculated from verified contract deployments on OPN Chain. No manual input needed." },
  { icon: Lock, title: "Lock Commitment", desc: "Stake OPN tokens to signal serious intent. Earn BVLT rewards when BVLT launches in Season 6." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader title="How It Works" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card group relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#6EE7B7]/40 hover:shadow-[0_0_40px_rgba(110,231,183,0.15)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#6EE7B7]/20 to-[#22D3EE]/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <span className="font-display flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-bold text-[#6EE7B7]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon size={24} className="text-[#6EE7B7]" />
              </div>
              <h3 className="font-display mt-6 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ title, subtitle, align = "left" }: { title: string; subtitle?: string; align?: "left" | "center"; }) {
  return (
    <div className={`flex flex-col gap-3 ${align === "center" ? "items-center text-center" : ""}`}>
      <h2 className="font-display text-3xl font-bold md:text-5xl">{title}</h2>
      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE]" />
      {subtitle && <p className="max-w-2xl text-white/60">{subtitle}</p>}
    </div>
  );
}
