import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import TransitionSection from '../components/landing/TransitionSection'
import LiveDemoSection from '../components/landing/LiveDemoSection'
import ArchitectureSection from '../components/landing/ArchitectureSection'
import FinalCTA from '../components/landing/FinalCTA'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <TransitionSection />
      <LiveDemoSection />
      <ArchitectureSection />
      <FinalCTA />
    </>
  )
}
