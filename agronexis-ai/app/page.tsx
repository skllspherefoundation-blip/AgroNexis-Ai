import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CommandCenter } from "@/components/sections/command-center";
import { FieldIntelligence } from "@/components/sections/field-intelligence";
import { HeroSection } from "@/components/sections/hero-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { OperationsSection } from "@/components/sections/operations-section";
import { PlatformSection } from "@/components/sections/platform-section";


export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#071A2F]">
      <SiteHeader />
      <main>
        <HeroSection />
        <PlatformSection />
        <FieldIntelligence />
        <OperationsSection />
        <InsightsSection />
        <CommandCenter />
      </main>
      <SiteFooter />
    </div>
  );
}
