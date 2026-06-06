import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { BuilderLevels } from '@/components/BuilderLevels'
import { LockCommitment } from '@/components/LockCommitment'
import { Roadmap } from '@/components/Roadmap'
import { StatsBanner } from '@/components/StatsBanner'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <BuilderLevels />
        <LockCommitment />
        <Roadmap />
        <StatsBanner />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}