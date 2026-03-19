/**
 * EXAMPLE: How to integrate the Gamified Skills Section into your portfolio
 * 
 * This file shows different ways to use the SkillsGamified component
 */

import SkillsGamified from "@/components/skills-gamified";
import BlurFade from "@/components/magicui/blur-fade";

// ═══════════════════════════════════════════════════════════════════════════
// OPTION 1: Basic Usage (Recommended)
// ═══════════════════════════════════════════════════════════════════════════

export function BasicUsage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Your other sections */}
      
      <section id="skills">
        <SkillsGamified />
      </section>
      
      {/* More sections */}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTION 2: With Blur Fade Animation (Smooth entrance)
// ═══════════════════════════════════════════════════════════════════════════

export function WithBlurFade() {
  const BLUR_FADE_DELAY = 0.04;
  
  return (
    <main className="flex flex-col min-h-screen">
      <section id="skills">
        <BlurFade delay={BLUR_FADE_DELAY * 10}>
          <SkillsGamified />
        </BlurFade>
      </section>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTION 3: With Custom Container Styling
// ═══════════════════════════════════════════════════════════════════════════

export function WithCustomStyling() {
  return (
    <main className="flex flex-col min-h-screen">
      <section 
        id="skills" 
        className="container mx-auto px-4 py-20 max-w-7xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4">My Tech Arsenal</h2>
          <p className="text-gray-400">
            Technologies I've mastered through years of building
          </p>
        </div>
        
        <SkillsGamified />
      </section>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTION 4: Full Page Layout Example
// ═══════════════════════════════════════════════════════════════════════════

export function FullPageExample() {
  return (
    <main className="flex flex-col min-h-screen space-y-20">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Hi, I'm John Doe 👋</h1>
          <p className="text-xl text-gray-400">Full Stack Developer</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">About Me</h2>
        <p className="text-gray-400">
          I'm a passionate developer with 5+ years of experience...
        </p>
      </section>

      {/* Skills Section - THE STAR OF THE SHOW */}
      <section id="skills">
        <SkillsGamified />
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Projects</h2>
        {/* Your projects */}
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
        {/* Contact form */}
      </section>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMIZATION EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * To customize the skills data, edit the SKILLS_DATA array in:
 * src/components/skills-gamified.tsx
 * 
 * Example skill object:
 * 
 * {
 *   name: "React",
 *   icon: <SiReact className="w-full h-full" />,
 *   category: "frontend",
 *   proficiency: 95,
 *   yearsOfExperience: 5,
 *   level: "Master",
 *   description: "Building production apps with hooks and context",
 *   projects: ["Project A", "Project B"],
 *   relatedSkills: ["TypeScript", "Next.js"],
 *   color: "#61DAFB",
 * }
 */

/**
 * To customize achievements, edit the ACHIEVEMENTS array:
 * 
 * const ACHIEVEMENTS = [
 *   { title: "React Certified", icon: "🏆", color: "#61DAFB" },
 *   { title: "5+ Years Frontend", icon: "⚡", color: "#00f5ff" },
 * ];
 */

/**
 * To customize stats, update these values in the component:
 * 
 * const totalTech = SKILLS_DATA.length;
 * const totalProjects = 50;
 * const totalHours = 3000;
 * const totalYears = 6;
 */

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION WITH EXISTING PORTFOLIO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * To replace your existing skills section:
 * 
 * 1. Find your current skills section in src/app/page.tsx
 * 2. Replace it with:
 * 
 *    <section id="skills">
 *      <SkillsGamified />
 *    </section>
 * 
 * 3. Remove the old skills component import
 * 4. Add: import SkillsGamified from "@/components/skills-gamified";
 */

// ═══════════════════════════════════════════════════════════════════════════
// TIPS & TRICKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 1. PERFORMANCE:
 *    - The component is optimized with useInView hooks
 *    - Animations only trigger when scrolled into view
 *    - Respects prefers-reduced-motion for accessibility
 * 
 * 2. RESPONSIVE:
 *    - Automatically adapts to mobile, tablet, and desktop
 *    - Grid columns adjust based on screen size
 *    - Touch-friendly on mobile devices
 * 
 * 3. CUSTOMIZATION:
 *    - All colors can be changed in the component
 *    - Particle count and meteor count are adjustable
 *    - Animation speeds can be modified in tailwind.config.ts
 * 
 * 4. ACCESSIBILITY:
 *    - Keyboard navigable
 *    - Screen reader friendly
 *    - Reduced motion support
 *    - Semantic HTML structure
 * 
 * 5. BROWSER SUPPORT:
 *    - Works in all modern browsers
 *    - Graceful degradation for older browsers
 *    - 3D transforms fallback to 2D
 */

export default BasicUsage;
