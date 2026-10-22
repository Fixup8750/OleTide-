import { Deal } from "@/components/Deal";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Frontier } from "@/components/Frontier";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { Partners } from "@/components/Partners";
import { Services } from "@/components/Services";
import { Terms } from "@/components/Terms";
import { Testimonials } from "@/components/Testimonials";
import { getGameStats } from "@/lib/game-stats";

export default async function Home() {
  const stats = await getGameStats();
  return (
    <>
      <main>
        <Hero playing={stats ? Object.values(stats).reduce((n, g) => n + g.playing, 0) : null} />
        <Marquee />
        <Manifesto />
        <Deal />
        <Services />
        <Frontier stats={stats} />
        <Testimonials />
        <Partners />
        <Terms />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
