import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import GraphMount from "@/components/GraphMount";
import { MobileBar, Sidebar } from "@/components/Sidebar";
import { buildTraitGraph } from "@/lib/graph";

export default function Home() {
  const graph = buildTraitGraph();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-bg"
      >
        Skip to content
      </a>

      <GraphMount graph={graph} />

      <MobileBar />
      <Sidebar />

      <main
        id="main"
        className="relative z-10 px-5 pb-24 sm:px-8 lg:ml-[clamp(320px,30vw,420px)] lg:px-12 xl:px-20 2xl:max-w-[1100px]"
      >
        <Hero />
        <About />
        <Education />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
