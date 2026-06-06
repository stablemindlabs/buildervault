import { GitBranch, ExternalLink, Globe, Compass } from "lucide-react";
import { Logo } from "./Logo";

const LINKS = [
  { label: "GitHub", href: "https://github.com/stablemindlabs/buildervault", icon: GitBranch },
  { label: "Live Demo", href: "https://buildervault-coral.vercel.app", icon: ExternalLink },
  { label: "Explorer", href: "https://testnet.iopn.tech/address/0x876d81a05900aa02Da17320cB521ce1FF19F720A", icon: Compass },
  { label: "@StableMindLabs", href: "https://twitter.com/StableMindLabs", icon: Globe },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070B17]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-lg font-bold">BuilderVault</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/55">Your on-chain identity, built one season at a time.</p>
          </div>
          <div className="flex flex-col gap-3 md:items-center">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-[#6EE7B7]">
                <l.icon size={15} /> {l.label}
              </a>
            ))}
          </div>
          <div className="flex md:justify-end">
            <div className="glass-card inline-flex items-center gap-2.5 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#6EE7B7] shadow-[0_0_10px_#6EE7B7]" />
              <span className="text-sm font-medium">Built on OPN Chain</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          2026 StableMind Labs. BuilderVault - OPN Builders Season 1.
        </div>
      </div>
    </footer>
  );
}
