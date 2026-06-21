"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Nebula Dashboard",
    category: "Web App",
    description: "Analytics platform with real-time data visualization and AI-driven insights.",
    tags: ["React", "D3.js", "Node.js"],
    color: "#4ade80",
  },
  {
    title: "Prism Banking",
    category: "Mobile App",
    description: "Neobank experience with seamless onboarding and personalized financial tools.",
    tags: ["Flutter", "Firebase", "AI"],
    color: "#60a5fa",
  },
  {
    title: "Void E-Commerce",
    category: "Web Design",
    description: "Minimalist luxury shopping experience with immersive product storytelling.",
    tags: ["Next.js", "Three.js", "Stripe"],
    color: "#f472b6",
  },
  {
    title: "Terra Studio",
    category: "Brand Identity",
    description: "Complete brand system for a sustainable architecture firm.",
    tags: ["Branding", "UI Kit", "Webflow"],
    color: "#fbbf24",
  },
  {
    title: "Synth Learning",
    category: "Platform",
    description: "Gamified education platform with adaptive learning paths and collaboration.",
    tags: ["Vue.js", "Python", "ML"],
    color: "#a78bfa",
  },
  {
    title: "Pulse Health",
    category: "Mobile App",
    description: "Health tracking app with intuitive data visualization and telemedicine.",
    tags: ["Swift", "HealthKit", "AI"],
    color: "#34d399",
  },
];

export default function PortfolioWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = headingRef.current?.querySelectorAll<HTMLElement>(".reveal-up");
      if (reveals && reveals.length) {
        gsap.fromTo(
          reveals,
          { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      }

      const cards = gridRef.current?.querySelectorAll<HTMLElement>(".project-card");
      if (cards && cards.length) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
      id="works"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      dir="ltr"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-green-500/[0.03] blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div ref={headingRef} className="mb-16">
          <p className="reveal-up text-[10px] tracking-[0.25em] uppercase text-green-400 mb-4">
            Selected Work
          </p>
          <h2 className="reveal-up text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Projects I&apos;ve <br />
            <span className="text-white/40">crafted with care</span>
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 cursor-pointer hover:bg-white/[0.04] transition-all duration-500"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(600px circle at 50% 0%, ${project.color}11, transparent)`,
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase font-medium"
                    style={{ color: project.color }}
                  >
                    {project.category}
                  </span>
                  <span className="text-white/10 text-xs group-hover:text-white/30 transition-colors">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed mb-5 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-white/[0.08] text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
