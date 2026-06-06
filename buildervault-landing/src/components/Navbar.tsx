import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { useWallet } from "@/hooks/useWallet";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how" },
  { label: "Levels", href: "#levels" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Community", href: "#community" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { shortAddress, isConnected, connect } = useWallet();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#0A0F1E]/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight">BuilderVault</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-white/70 transition-colors hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <ConnectButton isConnected={isConnected} shortAddress={shortAddress} onClick={connect} />
        </div>
        <button onClick={() => setOpen((v) => !v)} className="rounded-md p-2 text-white md:hidden" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-[#0A0F1E]/95 px-5 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-sm text-white/80 hover:text-white">
                  {n.label}
                </a>
              ))}
              <ConnectButton isConnected={isConnected} shortAddress={shortAddress} onClick={connect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ConnectButton({ isConnected, shortAddress, onClick }: { isConnected: boolean; shortAddress: string | null; onClick: () => void; }) {
  if (isConnected) {
    return (
      <button className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-sm backdrop-blur-md transition hover:bg-white/10">
        <span className="h-2 w-2 rounded-full bg-[#6EE7B7] shadow-[0_0_10px_#6EE7B7]" />
        {shortAddress}
      </button>
    );
  }
  return (
    <button onClick={onClick} className="rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#22D3EE] px-5 py-2.5 text-sm font-semibold text-[#0A0F1E] transition-all hover:shadow-[0_0_30px_rgba(110,231,183,0.45)]">
      Connect Wallet
    </button>
  );
}
