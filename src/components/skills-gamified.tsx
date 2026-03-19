"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Particles } from "@/components/magicui/particles";
import { Meteors } from "@/components/magicui/meteors";
import { BorderBeam } from "@/components/magicui/border-beam";
import NumberTicker from "@/components/magicui/number-ticker";
import Ripple from "@/components/magicui/ripple";
import Marquee from "@/components/magicui/marquee";
import ShimmerButton from "@/components/magicui/shimmer-button";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiNodedotjs, SiPython, SiDocker, SiPostgresql,
  SiKubernetes, SiCplusplus, SiGo, SiTailwindcss,
  SiGit, SiAmazon, SiMongodb, SiRedis,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkillLevel = "Beginner" | "Apprentice" | "Journeyman" | "Expert" | "Master";
export type SkillCategory = "frontend" | "backend" | "devops" | "tools" | "soft";

export interface Skill {
  name: string;
  icon: React.ReactNode;
  category: SkillCategory;
  proficiency: number;
  yearsOfExperience: number;
  level: SkillLevel;
  description: string;
  projects: string[];
  relatedSkills: string[];
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS_DATA: Skill[] = [
  {
    name: "React",
    icon: <SiReact className="w-full h-full" />,
    category: "frontend", proficiency: 95, yearsOfExperience: 5, level: "Master",
    description: "Building production apps with hooks, context, and performance optimization",
    projects: ["Chat Collect", "Magic UI", "Portfolio"],
    relatedSkills: ["TypeScript", "Next.js", "Tailwind"], color: "#61DAFB",
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="w-full h-full" />,
    category: "frontend", proficiency: 92, yearsOfExperience: 4, level: "Expert",
    description: "SSR, SSG, API routes, and App Router mastery",
    projects: ["llm.report", "Automatic Chat"],
    relatedSkills: ["React", "TypeScript", "Vercel"], color: "#888888",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="w-full h-full" />,
    category: "frontend", proficiency: 90, yearsOfExperience: 4, level: "Expert",
    description: "Type-safe development with advanced generics and utility types",
    projects: ["All modern projects"],
    relatedSkills: ["JavaScript", "React", "Node.js"], color: "#3178C6",
  },
  {
    name: "JavaScript",
    icon: <SiJavascript className="w-full h-full" />,
    category: "frontend", proficiency: 93, yearsOfExperience: 6, level: "Master",
    description: "ES6+, async patterns, and functional programming",
    projects: ["Legacy & Modern Apps"],
    relatedSkills: ["TypeScript", "Node.js"], color: "#F7DF1E",
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs className="w-full h-full" />,
    category: "backend", proficiency: 88, yearsOfExperience: 5, level: "Expert",
    description: "Building scalable APIs and microservices",
    projects: ["Automatic Chat", "llm.report"],
    relatedSkills: ["TypeScript", "PostgreSQL", "Docker"], color: "#5FA04E",
  },
  {
    name: "Python",
    icon: <SiPython className="w-full h-full" />,
    category: "backend", proficiency: 82, yearsOfExperience: 4, level: "Journeyman",
    description: "Data processing, automation, and ML pipelines",
    projects: ["AI Hackathon Winner"],
    relatedSkills: ["Docker", "PostgreSQL"], color: "#3776AB",
  },
  {
    name: "Docker",
    icon: <SiDocker className="w-full h-full" />,
    category: "devops", proficiency: 85, yearsOfExperience: 3, level: "Expert",
    description: "Containerization and multi-stage builds",
    projects: ["Capgemini Microservices"],
    relatedSkills: ["Kubernetes", "AWS"], color: "#2496ED",
  },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql className="w-full h-full" />,
    category: "backend", proficiency: 80, yearsOfExperience: 4, level: "Journeyman",
    description: "Complex queries, indexing, and optimization",
    projects: ["Chat Collect", "llm.report"],
    relatedSkills: ["Node.js", "Prisma"], color: "#4169E1",
  },
  {
    name: "Kubernetes",
    icon: <SiKubernetes className="w-full h-full" />,
    category: "devops", proficiency: 75, yearsOfExperience: 2, level: "Journeyman",
    description: "Orchestrating containerized applications at scale",
    projects: ["Capgemini Production Cluster"],
    relatedSkills: ["Docker", "AWS"], color: "#326CE5",
  },
  {
    name: "C++",
    icon: <SiCplusplus className="w-full h-full" />,
    category: "backend", proficiency: 70, yearsOfExperience: 3, level: "Journeyman",
    description: "Systems programming and performance optimization",
    projects: ["University Projects"],
    relatedSkills: ["Java"], color: "#00599C",
  },
  {
    name: "Java",
    icon: <FaJava className="w-full h-full" />,
    category: "backend", proficiency: 72, yearsOfExperience: 3, level: "Journeyman",
    description: "Enterprise applications and OOP design patterns",
    projects: ["Academic & Enterprise"],
    relatedSkills: ["C++"], color: "#E76F00",
  },
  {
    name: "Go",
    icon: <SiGo className="w-full h-full" />,
    category: "backend", proficiency: 68, yearsOfExperience: 2, level: "Apprentice",
    description: "Concurrent programming and microservices",
    projects: ["Side Projects"],
    relatedSkills: ["Docker", "Kubernetes"], color: "#00ACD7",
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="w-full h-full" />,
    category: "frontend", proficiency: 94, yearsOfExperience: 3, level: "Expert",
    description: "Utility-first styling and custom design systems",
    projects: ["Magic UI", "Portfolio"],
    relatedSkills: ["React", "Next.js"], color: "#06B6D4",
  },
  {
    name: "Git",
    icon: <SiGit className="w-full h-full" />,
    category: "tools", proficiency: 90, yearsOfExperience: 6, level: "Expert",
    description: "Version control, branching strategies, and collaboration",
    projects: ["All Projects"],
    relatedSkills: [], color: "#F05032",
  },
  {
    name: "AWS",
    icon: <SiAmazon className="w-full h-full" />,
    category: "devops", proficiency: 78, yearsOfExperience: 3, level: "Journeyman",
    description: "S3, Lambda, EC2, and cloud architecture",
    projects: ["Capgemini Data Lake"],
    relatedSkills: ["Docker", "Kubernetes"], color: "#FF9900",
  },
  {
    name: "MongoDB",
    icon: <SiMongodb className="w-full h-full" />,
    category: "backend", proficiency: 76, yearsOfExperience: 3, level: "Journeyman",
    description: "NoSQL database design and aggregation pipelines",
    projects: ["Various APIs"],
    relatedSkills: ["Node.js"], color: "#47A248",
  },
  {
    name: "Redis",
    icon: <SiRedis className="w-full h-full" />,
    category: "backend", proficiency: 74, yearsOfExperience: 2, level: "Journeyman",
    description: "Caching strategies and session management",
    projects: ["High-traffic APIs"],
    relatedSkills: ["Node.js", "PostgreSQL"], color: "#DC382D",
  },
];

const ACHIEVEMENTS = [
  { title: "React Certified",         icon: "🏆", color: "#61DAFB" },
  { title: "5+ Years Frontend",       icon: "⚡", color: "#00f5ff" },
  { title: "Open Source Contributor", icon: "🌟", color: "#39ff14" },
  { title: "Hackathon Winner",        icon: "🥇", color: "#FFD700" },
  { title: "Full Stack Master",       icon: "💎", color: "#7c3aed" },
  { title: "Cloud Architect",         icon: "☁️", color: "#FF9900" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getLevelColor = (level: SkillLevel): string =>
  ({ Beginner: "#9CA3AF", Apprentice: "#60A5FA", Journeyman: "#34D399", Expert: "#FBBF24", Master: "#F472B6" }[level]);

const getConfidenceEmojis = (proficiency: number): string => {
  const count = Math.ceil(proficiency / 20);
  return "🟢".repeat(count) + "⚪".repeat(5 - count);
};

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group perspective-1000 h-52"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── Front ── */}
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
          <div
            className={cn(
              "relative h-full rounded-xl border p-5 transition-all duration-300",
              "border-black/10 bg-white/80 backdrop-blur-sm",
              "dark:border-white/10 dark:bg-[#0f0f14]/80",
              isHovered && "scale-105 shadow-2xl"
            )}
            style={{ boxShadow: isHovered ? `0 0 30px ${skill.color}40, 0 0 60px ${skill.color}20` : "none" }}
          >
            <BorderBeam size={250} duration={12} delay={index * 0.5} colorFrom={skill.color} colorTo="#7c3aed" />
            {isHovered && <Ripple mainCircleSize={100} mainCircleOpacity={0.15} numCircles={5} />}

            {/* Icon */}
            <div className="w-12 h-12 mb-3 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${skill.color}15`, color: skill.color }}>
              {skill.icon}
            </div>

            {/* Name */}
            <h3 className="text-base font-bold mb-1 font-mono" style={{ color: skill.color }}>
              {skill.name}
            </h3>

            {/* Level badge */}
            <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2"
              style={{ backgroundColor: `${getLevelColor(skill.level)}20`, color: getLevelColor(skill.level), border: `1px solid ${getLevelColor(skill.level)}40` }}>
              {skill.level}
            </div>

            {/* XP bar */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">XP</span>
                <span className="text-[10px] font-bold font-mono" style={{ color: skill.color }}>{skill.proficiency}%</span>
              </div>
              <div className="h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)` }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                  transition={{ duration: 1, delay: index * 0.05 + 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Years */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>⏱️</span>
              <NumberTicker value={skill.yearsOfExperience} delay={index * 0.05 + 0.5} />
              <span className="font-mono">yrs</span>
            </div>
          </div>
        </div>

        {/* ── Back ── */}
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div
            className="h-full rounded-xl border p-5 border-black/10 bg-white/95 dark:border-white/10 dark:bg-[#0f0f14]/95"
            style={{ boxShadow: `0 0 30px ${skill.color}40` }}
          >
            <BorderBeam size={250} duration={12} delay={index * 0.5} colorFrom={skill.color} colorTo="#7c3aed" />

            <h4 className="text-sm font-bold mb-2 font-mono" style={{ color: skill.color }}>{skill.name}</h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{skill.description}</p>

            {skill.projects.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono">PROJECTS:</p>
                <div className="flex flex-wrap gap-1">
                  {skill.projects.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[9px] font-mono bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono">CONFIDENCE:</p>
              <p className="text-xs">{getConfidenceEmojis(skill.proficiency)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

function StatsBar({ totalTech, totalProjects, totalHours, totalYears }: {
  totalTech: number; totalProjects: number; totalHours: number; totalYears: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {[
        { icon: "⚡", label: "Technologies", value: totalTech,     suffix: "+" },
        { icon: "📦", label: "Projects",     value: totalProjects, suffix: "+" },
        { icon: "☕", label: "Hours Coded",  value: totalHours,    suffix: "" },
        { icon: "🌍", label: "Years Exp",    value: totalYears,    suffix: "" },
      ].map((stat, i) => (
        <div key={i} className="relative rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#0f0f14]/60 backdrop-blur-sm p-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
          <div className="relative z-10">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-[#00b4cc] dark:text-[#00f5ff] flex items-center justify-center gap-1">
              <NumberTicker value={stat.value} delay={i * 0.2} />
              <span>{stat.suffix}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── AchievementBadge ─────────────────────────────────────────────────────────

function AchievementBadge({ title, icon, color }: { title: string; icon: string; color: string }) {
  return (
    <div
      className="relative flex-shrink-0 w-32 h-32 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0f0f14]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 group cursor-pointer mx-2"
      style={{ boxShadow: `0 0 20px ${color}20` }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="text-xs font-bold text-center font-mono text-gray-600 dark:text-gray-300 px-2">{title}</div>
      <BorderBeam size={150} duration={10} colorFrom={color} colorTo="#FFD700" />
    </div>
  );
}

// ─── RadarChart ───────────────────────────────────────────────────────────────

function RadarChart({ skills }: { skills: Skill[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });

  const categories: SkillCategory[] = ["frontend", "backend", "devops", "tools", "soft"];
  const categoryLabels: Record<SkillCategory, string> = {
    frontend: "Frontend", backend: "Backend", devops: "DevOps", tools: "Tools", soft: "Soft Skills",
  };

  const categoryScores = categories.map((cat) => {
    const s = skills.filter((sk) => sk.category === cat);
    if (!s.length) return 0;
    return s.reduce((sum, sk) => sum + sk.proficiency, 0) / s.length;
  });

  // Give the chart a generous viewBox so labels never clip
  const chartSize = 260;          // polygon area
  const padding   = 60;           // space reserved for labels on every side
  const viewSize  = chartSize + padding * 2;
  const center    = viewSize / 2;
  const maxRadius = chartSize / 2;
  const angleStep = (Math.PI * 2) / categories.length;

  // Build polygon points
  const dataPoints = categoryScores.map((score, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (score / 100) * maxRadius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions — pushed further out than the polygon edge
  const labelOffset = maxRadius + 38;
  const labelPositions = categories.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const x = center + labelOffset * Math.cos(angle);
    const y = center + labelOffset * Math.sin(angle);
    // Anchor text based on horizontal position
    const anchor = Math.cos(angle) > 0.1 ? "start" : Math.cos(angle) < -0.1 ? "end" : "middle";
    return { x, y, anchor };
  });

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg
        ref={ref}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        width="100%"
        style={{ overflow: "visible" }}
      >
        {/* Background rings */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle key={i} cx={center} cy={center} r={maxRadius * scale}
            fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        ))}

        {/* Axis spokes */}
        {categories.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return (
            <line key={i}
              x1={center} y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(0,245,255,0.12)"
          stroke="#00f5ff"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0, originX: `${center}px`, originY: `${center}px` }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Data point dots */}
        {dataPoints.map((pt, i) => (
          <motion.circle key={i} cx={pt.x} cy={pt.y} r="4"
            fill="#00f5ff"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
          />
        ))}

        {/* Labels — each one anchored to its quadrant so they never overlap */}
        {categories.map((cat, i) => {
          const { x, y, anchor } = labelPositions[i];
          return (
            <text key={i} x={x} y={y}
              textAnchor={anchor as "start" | "end" | "middle"}
              dominantBaseline="middle"
              fontSize="11"
              fontFamily="monospace"
              fill="currentColor"
              fillOpacity="0.6"
            >
              {categoryLabels[cat]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SkillsGamified() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");

  const categories: Array<{ id: SkillCategory | "all"; label: string }> = [
    { id: "all",      label: "All"      },
    { id: "frontend", label: "Frontend" },
    { id: "backend",  label: "Backend"  },
    { id: "devops",   label: "DevOps"   },
    { id: "tools",    label: "Tools"    },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === activeCategory);

  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#f0f4ff] dark:bg-[#0a0a0f] transition-colors duration-300" />
      <Particles className="absolute inset-0" quantity={60} ease={80} color="#00b4cc" refresh={false} />
      <Meteors number={10} />
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,180,204,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,204,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 font-mono">
            <span className="text-[#00b4cc] dark:text-[#00f5ff]">SKILLS</span>
            <span className="text-[#22c55e] dark:text-[#39ff14]">.exe</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-mono">
            // Explore the skill tree. Click cards to reveal secrets.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <StatsBar totalTech={SKILLS_DATA.length} totalProjects={50} totalHours={3000} totalYears={6} />

        {/* ── Category Tabs ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "relative px-6 py-2 rounded-lg font-mono text-sm font-bold transition-all duration-300",
                activeCategory === cat.id
                  ? "text-[#00b4cc] dark:text-[#00f5ff] bg-[#00b4cc]/10 dark:bg-[#00f5ff]/10 border border-[#00b4cc]/50 dark:border-[#00f5ff]/50"
                  : "text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#00b4cc]/40 dark:hover:border-[#00f5ff]/30"
              )}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <BorderBeam size={100} duration={8} colorFrom="#00f5ff" colorTo="#39ff14" />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Skills Grid ── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
        >
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.name} skill={skill} index={index} />
          ))}
        </motion.div>

        {/* ── Radar Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 font-mono text-[#00b4cc] dark:text-[#00f5ff]">
            Skill Balance Radar
          </h3>
          <RadarChart skills={SKILLS_DATA} />
        </motion.div>

        {/* ── Achievements ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-6 font-mono text-[#22c55e] dark:text-[#39ff14]">
            🏆 Achievements Unlocked
          </h3>
          <Marquee pauseOnHover className="[--duration:30s]">
            {ACHIEVEMENTS.map((a, i) => (
              <AchievementBadge key={i} {...a} />
            ))}
          </Marquee>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <ShimmerButton
            className="px-8 py-4 text-lg font-bold font-mono text-white"
            shimmerColor="#00f5ff"
            background="linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)"
            borderRadius="12px"
          >
            <span className="flex items-center gap-2">
              <span>📄</span>
              <span>Download Resume</span>
            </span>
          </ShimmerButton>
        </motion.div>

      </div>
    </section>
  );
}
