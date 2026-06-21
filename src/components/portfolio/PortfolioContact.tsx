"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { name: "Dribbble", handle: "@designer" },
  { name: "Behance", handle: "/designer" },
  { name: "LinkedIn", handle: "in/designer" },
  { name: "Twitter/X", handle: "@designer" },
];

export default function PortfolioContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = contentRef.current?.querySelectorAll<HTMLElement>(".reveal-up");
      if (reveals && reveals.length) {
        gsap.fromTo(
          reveals,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      dir="ltr"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green-500/[0.02] blur-[200px]" />
      </div>

      <div
        ref={contentRef}
        className="relative max-w-4xl mx-auto px-6 text-center"
      >
        <p className="reveal-up text-[10px] tracking-[0.25em] uppercase text-green-400 mb-4">
          Let&apos;s Collaborate
        </p>

        <h2 className="reveal-up text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Have a project <br />
          <span className="text-white/40">in mind?</span>
        </h2>

        <p className="reveal-up text-base sm:text-lg text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>

        <div className="reveal-up">
          <a
            href="mailto:hello@designer.com"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all duration-300 group"
          >
            hello@designer.com
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        <div className="reveal-up mt-16 pt-16 border-t border-white/[0.06]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/20 mb-6">
            Find me on
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {socials.map((social) => (
              <a
                key={social.name}
                href="#"
                className="text-sm text-white/30 hover:text-white/70 transition-colors duration-300"
              >
                {social.name}
                <span className="block text-[10px] text-white/10">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="reveal-up mt-20">
          <p className="text-[10px] text-white/10 tracking-[0.15em]">
            &copy; {new Date().getFullYear()} Designer Name. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
