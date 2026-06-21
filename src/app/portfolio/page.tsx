"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioWorks from "@/components/portfolio/PortfolioWorks";
import PortfolioSkills from "@/components/portfolio/PortfolioSkills";
import PortfolioContact from "@/components/portfolio/PortfolioContact";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioPage() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.to("html", { scrollBehavior: "auto" });

    const links = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e: Event) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    links.forEach((l) => l.addEventListener("click", handleClick));

    return () => {
      links.forEach((l) => l.removeEventListener("click", handleClick));
    };
  }, []);

  useEffect(() => {
    gsap.to(navRef.current, {
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(10,10,10,0.8)",
      borderBottomColor: "rgba(255,255,255,0.06)",
      duration: 0.3,
      scrollTrigger: {
        trigger: document.body,
        start: "top -80px",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  const navLinks = ["Works", "Skills", "Contact"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/20">
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-transparent transition-all duration-300"
        style={{ backgroundColor: "rgba(10,10,10,0)", backdropFilter: "blur(0px)" }}
      >
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-white/80 hover:text-white transition-colors"
        >
          Portfolio
        </a>
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/70 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      <PortfolioHero />
      <PortfolioWorks />
      <PortfolioSkills />
      <PortfolioContact />
    </div>
  );
}
