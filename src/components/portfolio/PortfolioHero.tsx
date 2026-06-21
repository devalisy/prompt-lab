"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeScene from "./ThreeScene";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll(".word");
      const btns = ctaRef.current?.querySelectorAll(".btn-anim");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (words) {
        tl.fromTo(
          words,
          { y: 80, opacity: 0, rotateX: -40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.12 }
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        );
      }

      if (btns) {
        tl.fromTo(
          btns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        );
      }

      if (scrollHintRef.current) {
        tl.fromTo(
          scrollHintRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const title = "UI/UX Designer\n crafting digital experiences";
  const words = title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir="ltr"
    >
      <ThreeScene />

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full py-32">
        <div className="max-w-4xl">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-green-400 mb-6 opacity-0 animate-fade-in">
            Portfolio 2026
          </p>

          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-white"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.04em]">
                <span className="word inline-block" style={{ display: "inline-block" }}>
                  {word}
                  {word.includes("\n") ? "" : " "}
                </span>
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-white/50 max-w-xl mt-8 leading-relaxed font-light"
          >
            I design interfaces that blend aesthetics with functionality, creating
            memorable digital experiences for modern brands.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4 mt-10">
            <a
              href="#works"
              className="btn-anim inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all duration-300"
            >
              View Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#contact"
              className="btn-anim inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:bg-white/5 hover:border-white/40 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
