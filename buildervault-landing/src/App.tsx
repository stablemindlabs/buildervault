import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { BuilderLevels } from "@/components/BuilderLevels";
import { LockCommitment } from "@/components/LockCommitment";
import { Roadmap } from "@/components/Roadmap";
import { StatsBanner } from "@/components/StatsBanner";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { CommunityPage } from "@/pages/CommunityPage";
import { ProfilePage } from "@/pages/ProfilePage";

function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <BuilderLevels />
      <LockCommitment />
      <Roadmap />
      <StatsBanner />
      <FinalCTA />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile/:address" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}