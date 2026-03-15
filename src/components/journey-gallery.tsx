"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

export interface JourneyMoment {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "work" | "hackathon" | "education" | "personal" | "achievement";
  year: string;
  size: "large" | "medium" | "small";
}

interface TileProps {
  moment: JourneyMoment;
  index: number;
  onOpen: (moment: JourneyMoment) => void;
}

const categoryGlow: Record<JourneyMoment["category"], string> = {
  work: "rgba(99,102,241,0.6)",
  hackathon: "rgba(236,72,153,0.6)",
  education: "rgba(34,211,238,0.6)",
  personal: "rgba(251,191,36,0.6)",
  achievement: "rgba(52,211,153,0.6)",
};

const categoryAccent: Record<JourneyMoment["category"], string> = {
  work: "#6366f1",
  hackathon: "#ec4899",
  education: "#22d3ee",
  personal: "#fbbf24",
  achievement: "#34d399",
};

function JourneyTile({ moment, index, onOpen }: TileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      rotateX.set(-dy * 8);
      rotateY.set(dx * 8);
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [rotateX, rotateY, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  }, [rotateX, rotateY]);

  const floatDelay = index * 0.4;
  const glow = categoryGlow[moment.category];
  const accent = categoryAccent[moment.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 40, filter: "blur(8px)" }
      }
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      style={{ perspective: 800 }}
      className="relative cursor-pointer h-full"
      onClick={() => onOpen(moment)}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl overflow-hidden group h-full"
      >
        {/* Glow border */}
        <motion.div
          className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
          animate={
            hovered
              ? { boxShadow: `0 0 0 1.5px ${accent}, 0 0 24px 4px ${glow}` }
              : { boxShadow: `0 0 0 1px rgba(255,255,255,0.08)` }
          }
          transition={{ duration: 0.3 }}
        />

        {/* Spotlight effect */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
          style={{
            background: hovered
              ? `radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(255,255,255,0.07) 0%, transparent 60%)`
              : "none",
          }}
        />

        {/* Image */}
        <div className="relative w-full h-full overflow-hidden">
          <motion.div
            className="w-full h-full"
            animate={hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={moment.image}
              alt={moment.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Dark base overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Glassmorphism overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-20 flex flex-col justify-end p-4"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                backdropFilter: "blur(2px)",
              }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: accent }}
              >
                {moment.category} · {moment.year}
              </div>
              <div className="text-white font-bold text-sm leading-tight mb-1">
                {moment.title}
              </div>
              <div className="text-white/70 text-xs leading-snug line-clamp-2">
                {moment.description}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always-visible bottom label */}
        <AnimatePresence>
          {!hovered && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 z-20 p-3"
            >
              <div className="text-white/90 font-semibold text-xs truncate drop-shadow-lg">
                {moment.title}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Year badge */}
        <div
          className="absolute top-3 right-3 z-20 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${accent}40`,
            color: accent,
          }}
        >
          {moment.year}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function JourneyModal({
  moment,
  onClose,
}: {
  moment: JourneyMoment;
  onClose: () => void;
}) {
  const accent = categoryAccent[moment.category];
  const glow = categoryGlow[moment.category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`tile-${moment.id}`}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          boxShadow: `0 0 0 1px ${accent}60, 0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${glow}`,
          background: "rgba(10,10,15,0.95)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full h-64">
          <Image
            src={moment.image}
            alt={moment.title}
            fill
            className="object-cover"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: accent }}
          >
            {moment.category} · {moment.year}
          </div>
          <h3 className="text-white text-xl font-bold mb-3">{moment.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {moment.description}
          </p>

          {/* Accent line */}
          <div
            className="mt-5 h-px w-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${accent}, transparent)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Gallery ─────────────────────────────────────────────────────────────

interface JourneyGalleryProps {
  moments: JourneyMoment[];
}

export function JourneyGallery({ moments }: JourneyGalleryProps) {
  const [selected, setSelected] = useState<JourneyMoment | null>(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  // Build bento layout: assign grid spans based on size
  const sizeToSpan: Record<JourneyMoment["size"], string> = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1 row-span-2",
    small: "col-span-1 row-span-1",
  };

  const sizeToHeight: Record<JourneyMoment["size"], string> = {
    large: "h-72",
    medium: "h-72",
    small: "h-36",
  };

  return (
    <div className="w-full space-y-8">
      {/* Section header */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-3"
      >
        <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
          Journey
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          My Story in Moments
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          A living memory wall of experiences, milestones, and the people who
          shaped the journey.
        </p>

        {/* Animated gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={titleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px w-32 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #6366f1, #ec4899, #22d3ee)",
            transformOrigin: "left",
          }}
        />
      </motion.div>

      {/* Bento Grid */}
      <div
        className="grid grid-cols-2 gap-3 auto-rows-auto"
        style={{ gridAutoRows: "auto" }}
      >
        {moments.map((moment, i) => (
          <div
            key={moment.id}
            className={`${sizeToSpan[moment.size]} ${sizeToHeight[moment.size]}`}
          >
            <div className="w-full h-full">
              <JourneyTile moment={moment} index={i} onOpen={setSelected} />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <JourneyModal moment={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
