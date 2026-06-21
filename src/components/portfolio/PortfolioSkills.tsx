"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "UI Design", level: 95, color: "#4ade80" },
  { name: "UX Research", level: 88, color: "#60a5fa" },
  { name: "Prototyping", level: 92, color: "#f472b6" },
  { name: "Motion Design", level: 85, color: "#fbbf24" },
  { name: "Design Systems", level: 90, color: "#a78bfa" },
  { name: "3D & WebGL", level: 78, color: "#34d399" },
];

const stats = [
  { value: "7+", label: "Years Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "12+", label: "Industries Served" },
];

export default function PortfolioSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headings = headingRef.current?.querySelectorAll(".reveal-up");
      if (headings && headings.length) {
        gsap.fromTo(
          headings,
          { y: 40, opacity: 0 },
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

      const bars = skillsRef.current?.querySelectorAll<HTMLElement>(".skill-bar-fill");
      if (bars && bars.length) {
        bars.forEach((bar) => {
          const width = bar.getAttribute("data-width") ?? "0%";
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: width,
              duration: 1.2,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: skillsRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      const skillLabels = skillsRef.current?.querySelectorAll<HTMLElement>(".skill-label");
      if (skillLabels && skillLabels.length) {
        gsap.fromTo(
          skillLabels,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const statItems = statsRef.current?.querySelectorAll<HTMLElement>(".stat-item");
      if (statItems && statItems.length) {
        gsap.fromTo(
          statItems,
          { y: 40, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
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
      id="skills"
      ref={sectionRef}
      className="relative py-32 overflow-hidden border-t border-white/[0.03]"
      dir="ltr"
    >
      <div className="relative max-w-6xl mx-auto px-6">
        <div ref={headingRef} className="mb-20">
          <p className="reveal-up text-[10px] tracking-[0.25em] uppercase text-green-400 mb-4">
            Expertise
          </p>
          <h2 className="reveal-up text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Skills & <br />
            <span className="text-white/40">capabilities</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div ref={skillsRef} className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="skill-item">
                <div className="skill-label flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">{skill.name}</span>
                  <span className="text-xs text-white/30">{skill.level}%</span>
                </div>
                <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="skill-bar-fill h-full rounded-full"
                    data-width={`${skill.level}%`}
                    style={{
                      width: "0%",
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center p-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] max-w-sm">
              <p className="text-[10px] tracking-[0.2em] uppercase text-green-400 mb-3">
                Design Philosophy
              </p>
              <blockquote className="text-lg text-white/60 leading-relaxed font-light">
                &ldquo;Good design is as little design as possible. Less, but
                better — because it concentrates on the essential aspects.&rdquo;
              </blockquote>
              <p className="text-xs text-white/20 mt-4">— Dieter Rams</p>
            </div>
          </div>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item text-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] text-white/30 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
