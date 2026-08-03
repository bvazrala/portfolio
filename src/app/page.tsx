import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import { MobileBar, Sidebar } from "@/components/Sidebar";
import Skills from "@/components/Skills";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-bg"
      >
        Skip to content
      </a>

      <MobileBar />
      <Sidebar />

      <main
        id="main"
        className="px-5 pb-24 sm:px-8 lg:ml-[clamp(320px,30vw,420px)] lg:px-12 xl:px-20 2xl:max-w-[1100px]"
      >
        <Hero />
        <About />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
