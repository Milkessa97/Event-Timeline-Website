/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, ReactNode, useState, useEffect } from "react";
import { Clock, Code, Coffee, Users, Zap, Terminal, Flag, MapPin, Cpu, Award } from "lucide-react";

// Inject CSS keyframes once
const BG_STYLES = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.08; transform: scale(1); }
    50%       { opacity: 0.85; transform: scale(1.25); }
  }
  @keyframes shoot {
    0%   { transform: translate(0,0) rotate(45deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translate(-90vw, 90vh) rotate(45deg); opacity: 0; }
  }
  @keyframes crossPulse {
    0%, 100% { opacity: 0.15; transform: scale(0.85) rotate(0deg); }
    50%       { opacity: 1;    transform: scale(1.15) rotate(15deg); }
  }
`;

// Small dot stars — CSS only, no JS animation per frame
const StarBackground = () => {
  const stars = useRef(
    Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.2 + 0.8,
      left: Math.random() * 100,
      top:  Math.random() * 100,
      dur:  (Math.random() * 5 + 3).toFixed(1),
      del:  (Math.random() * 6).toFixed(1),
    }))
  ).current;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{BG_STYLES}</style>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(20,43,111,0.18)_0%,transparent_70%)]" />
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            width:  s.size,
            height: s.size,
            left:   `${s.left}%`,
            top:    `${s.top}%`,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
};

// Shooting stars — CSS only

const ShootingStars = () => {
  const [showStars, setShowStars] = useState(false);

  // Generate star positions and properties once
  const stars = useRef(
    Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 75 + 20}%`,
      top: `${Math.random() * 35}%`,
      dur: (Math.random() * 2.5 + 2).toFixed(1), // 2–4.5s duration
      del: (Math.random() * 0.5).toFixed(1),     // small delay, 0–0.5s
      len: Math.round(120 + Math.random() * 80),
    }))
  ).current;

  // Show stars after 2 seconds
  useEffect(() => {
    const timeout = setTimeout(() => setShowStars(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (!showStars) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.len,
            height: 1.5,
            background:
              "linear-gradient(to right, transparent, rgba(255,214,2,0.75), transparent)",
            borderRadius: 2,
            opacity: 0,
            animation: `shoot ${s.dur}s ${s.del}s linear infinite, fadeIn 0.8s ease forwards`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Add keyframes for fadeIn and shoot if not already in global CSS */}
      <style>{`
        @keyframes shoot {
          0%   { transform: translate(0,0) rotate(45deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translate(-90vw, 90vh) rotate(45deg); opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Bright 4-pointed cross/sparkle stars
const CrossStars = () => {
  const sparkles = useRef(
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 14 + 10,
      left: (5 + (i % 6) * 17 + Math.random() * 10).toFixed(1),
      top:  (8 + Math.floor(i / 6) * 35 + Math.random() * 20).toFixed(1),
      dur:  (Math.random() * 4 + 3).toFixed(1),
      del:  (Math.random() * 5).toFixed(1),
      color: i % 3 === 0 ? "rgba(255,214,2,0.9)" : i % 3 === 1 ? "rgba(180,210,255,0.85)" : "rgba(255,255,255,0.9)",
    }))
  ).current;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top:  `${s.top}%`,
            width:  s.size,
            height: s.size,
            // 4-pointed star via clip-path
            clipPath: "polygon(50% 0%,55% 45%,100% 50%,55% 55%,50% 100%,45% 55%,0% 50%,45% 45%)",
            background: s.color,
            filter: `blur(0.3px) drop-shadow(0 0 4px ${s.color})`,
            animation: `crossPulse ${s.dur}s ${s.del}s ease-in-out infinite`,
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
};

interface TimelineItem {
  time: string;
  title: string;
  description?: string;
  icon: ReactNode;
}

const timelineData: TimelineItem[] = [
  {
    time: "12:00 LT",
    title: "Arrival and Settling time",
    description: "Check-in, grab your swag, and find your team's station.",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    time: "12:30 LT",
    title: "Workshop I",
    description: "Deep dive into the core technologies and API integration.",
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    time: "2:00 LT",
    title: "Dinner Break",
    description: "Fuel up with gourmet catering and network with other hackers.",
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    time: "3:00 LT",
    title: "Panel Discussion & Experience Sharing",
    description: "Insights from industry leaders and past hackathon winners.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    time: "4:00 LT",
    title: "Workshop II",
    description: "Advanced patterns, performance optimization, and UI/UX best practices.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    time: "5:45 LT",
    title: "Break Time, Fun and Games",
    description: "Quick mental reset with mini-games and lightning challenges.",
    icon: <Code className="w-5 h-5" />,
  },
  {
    time: "6:45 LT",
    title: "Workshop III",
    description: "Final polish: Deployment, presentation skills, and pitching.",
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    time: "12:00 LT",
    title: "Development stops",
    description: "Github repos will be closed. Final submissions are due.",
    icon: <Flag className="w-5 h-5" />,
  },
  {
    time: "1:00 LT",
    title: "Breakfast and Break Time",
    description: "Relax, refuel, and prepare your pitch for the final demo.",
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    time: "2:30 LT",
    title: "Project Presentation",
    description: "Teams showcase their hard work to the community and judges.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    time: "5:00 LT",
    title: "Closing Ceremony and Awards",
    description: "Celebrating innovation: awards, certificates, and closing remarks.",
    icon: <Award className="w-5 h-5" />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ✏️  EDIT THESE to set your event details
// ─────────────────────────────────────────────────────────────────────────────
const EVENT_DATE_EAT   = "2026-03-13";           // display date label
const EVENT_TIME_LABEL = "06:00 PM (12:00 LT)";             // display time label
const EVENT_LOCATION   = "ማኅበረ ቅዱሳን, አዳማ ማዕከል";  // display location

// ✏️ Set the exact event start — year, month (1-12), day, hour (EAT 24h), minute
const EVENT_EAT = { year: 2026, month: 3, day: 13, hour: 18, minute: 0 };
// (EAT = UTC+3 → we subtract 3 h when computing UTC)
const TARGET_MS = Date.UTC(
  EVENT_EAT.year,
  EVENT_EAT.month - 1,
  EVENT_EAT.day,
  EVENT_EAT.hour - 3,  // converting EAT → UTC
  EVENT_EAT.minute,
  0
);
// ─────────────────────────────────────────────────────────────────────────────

const EventInfoCountdown = () => {
  const calcTimeLeft = () => {
    const diff = TARGET_MS - Date.now();
    if (diff <= 0) return { days: 0, hrs: 0, min: 0, sec: 0 };
    return {
      days: Math.floor(diff / 86_400_000),
      hrs:  Math.floor((diff % 86_400_000) / 3_600_000),
      min:  Math.floor((diff % 3_600_000)  / 60_000),
      sec:  Math.floor((diff % 60_000)     / 1_000),
    };
  };

  const [left, setLeft] = useState(calcTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const blocks = [
    { label: "Days", value: pad(left.days) },
    { label: "Hrs",  value: pad(left.hrs)  },
    { label: "Min",  value: pad(left.min)  },
    { label: "Sec",  value: pad(left.sec)  },
  ];

  return (
    <section className="pb-16 px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        {/* Info chips row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {/* Date chip */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
            <svg className="w-4 h-4 text-brand-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-sm font-semibold text-white/80 font-mono tracking-wide">
              {new Date(EVENT_DATE_EAT).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Time chip */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
            <svg className="w-4 h-4 text-brand-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-sm font-semibold text-white/80 font-mono tracking-wide">{EVENT_TIME_LABEL}</span>
          </div>

          {/* Location chip */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-sm">
            <svg className="w-4 h-4 text-brand-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-sm font-semibold text-white/80 tracking-wide">{EVENT_LOCATION}</span>
          </div>
        </div>

        {/* Countdown blocks */}
        <div className="flex items-center justify-center gap-3 md:gap-5">
          {blocks.map((b, i) => (
            <div key={b.label} className="flex items-center gap-3 md:gap-5">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {/* glow */}
                  <div className="absolute -inset-1 bg-brand-accent/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative min-w-[70px] md:min-w-[90px] px-4 py-4 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm text-center">
                    <span className="block text-4xl md:text-5xl font-black tabular-nums text-white leading-none tracking-tight">
                      {b.value}
                    </span>
                  </div>
                </div>
                <span className="mt-2 text-[10px] md:text-xs font-mono font-bold tracking-[0.25em] text-white/35 uppercase">
                  {b.label}
                </span>
              </div>
              {/* colon separator (not after last) */}
              {i < blocks.length - 1 && (
                <div className="flex flex-col gap-2 pb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/50 block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/50 block" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-4 text-[11px] font-mono text-white/25 tracking-widest uppercase">
          Ethiopian Time (EAT · UTC+3)
        </p>
      </motion.div>
    </section>
  );
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div 
      ref={scrollerRef}
      className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth relative bg-linear-to-b from-[#030614] via-[#0a0a1a] to-[#020205] selection:bg-brand-accent selection:text-brand-bg flex flex-col"
    >
      <StarBackground />
      <ShootingStars />
      <CrossStars />
      
      {/* Hero Section */}
      <header className="min-h-screen snap-start snap-always shrink-0 flex items-center justify-center pt-24 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
              <div>
                <img className="w-10 h-10 md:w-24 md:h-24 text-brand-accent bg-transparent overflow-hidden object-contain" src="/mk-logo-300.png" alt="Mahbere Kdusan Logo" />
              </div>
              
              {/* Stylized Logo Section */}
              <div className="relative mx-2 md:mx-4">
               <div className="w-32 h-16 md:w-60 md:h-30 rounded-full flex items-center justify-center bg-transparent overflow-hidden relative z-10">
                <img 
                  className="w-32 h-32 md:w-60 md:h-60 brightness-0 invert object-contain" 
                  src="/AGT_HUB_Logo.png" 
                  alt="AGT HUB" 
                />
              </div>
              </div>

              <div>
                <img className="w-[70px] h-[70px] md:w-[120px] md:h-[120px] bg-transparent overflow-hidden object-contain" src="/30-year-anniversary-logo.png" alt="Mahbere Kdusan Logo" />
              </div>
            </div>

            <div className="flex flex-col items-center">
            <span className="text-4xl font-black tracking-[0.2em] text-white">AGT HUB</span>
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 48, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="h-1 bg-brand-accent mt-1 rounded-full" 
            />
          </div>

            <span className="inline-block px-3 py-1 rounded-full border border-brand-primary/50 bg-brand-primary/10 text-[10px] font-mono tracking-widest text-brand-accent mb-8 uppercase">
              AGT HUB Hackathon 2026
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-white">
              መክሊታችንን <br />
              <span className="text-brand-accent italic">ለቤተ ክርስትያናችን</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-brand-muted/80 text-lg md:text-xl leading-relaxed font-medium">
              The final overnight build session<br />
              Where teams turn their ideas into real solutions for the Church.
            </p>

            <div className="mt-12 flex gap-4">
              <a
              href="#schedule"
              className="px-8 py-3 border border-brand-primary hover:bg-brand-accent hover:text-brand-bg text-white font-bold rounded-full transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("schedule")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              View Details
            </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Countdown & Programs Section */}
      <section className="min-h-screen snap-start shrink-0 flex flex-col justify-center py-16 relative z-10" id="programs">
        {/* ── EVENT INFO & COUNTDOWN ───────────────────────────────────────
             ✏️  Edit the three constants below to set your event details  */}
        <EventInfoCountdown />

        <div className="px-6 w-full">
          <div className="max-w-5xl mx-auto">
            {/* Section Label */}
            <div className="flex flex-col items-center mb-10 md:mb-12">
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-px w-8 bg-brand-accent/50 origin-right" 
              />
              <span className="text-brand-accent font-mono text-xs tracking-widest uppercase">What to Expect</span>
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-px w-8 bg-brand-accent/50 origin-left" 
              />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">Main Programs</h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Panel Discussion",
                subtitle: "Experience Sharing",
                description:
                  "Industry leaders and past hackathon winners share raw insights, lessons learned, and strategies that actually work in the field.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                accent: "from-blue-500/20 to-indigo-500/10",
                border: "group-hover:border-blue-400/40",
                iconColor: "text-blue-300",
              },
              {
                number: "02",
                title: "Fun & Games",
                subtitle: "Break Time Activities",
                description:
                  "Step away from the screen, recharge your brain, and bond with teammates through quick mini-games and lightning challenges.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                  </svg>
                ),
                accent: "from-brand-accent/15 to-yellow-500/5",
                border: "group-hover:border-brand-accent/40",
                iconColor: "text-brand-accent",
              },
              {
                number: "03",
                title: "Workshop",
                subtitle: "Hands-on Learning",
                description:
                  "Three deep-dive sessions covering API integration, performance optimization, UI/UX best practices, deployment, and pitching.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
                accent: "from-emerald-500/15 to-teal-500/5",
                border: "group-hover:border-emerald-400/40",
                iconColor: "text-emerald-300",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                {/* Card glow */}
                <div className={`absolute -inset-0.5 bg-linear-to-br ${card.accent} rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500`} />

                <div className={`relative h-full p-8 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm ${card.border} transition-all duration-400 flex flex-col gap-5`}>
                  {/* Number badge */}
                  <span className="font-mono text-xs font-bold tracking-[0.3em] text-white/20 uppercase">{card.number}</span>

                  {/* Icon */}
                  <div className={`${card.iconColor} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                    {card.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-xl font-black text-white mb-1 group-hover:text-brand-accent transition-colors duration-300">{card.title}</h3>
                    <p className="text-xs font-mono tracking-widest text-white/40 uppercase mb-3">{card.subtitle}</p>
                    <p className="text-sm text-white/55 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* Timeline Section */}
      <section className="min-h-screen snap-start shrink-0 py-24 px-6 relative overflow-hidden" id="schedule">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-20">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-[1px] w-8 bg-brand-accent/50 origin-right" 
              />
              <span className="text-brand-accent font-mono text-xs tracking-widest uppercase">Timeline</span>
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-[1px] w-8 bg-brand-accent/50 origin-left" 
              />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white">THE SPRINT</h2>
          </div>

          <div ref={containerRef} className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-white/10" />
            
            {/* Progress Line */}
            <motion.div 
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-brand-accent origin-top z-10 shadow-[0_0_10px_rgba(255,214,2,0.5)]"
              style={{ scaleY }}
            />

            <div className="space-y-16">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-brand-bg border border-brand-accent rounded-full z-20 flex items-center justify-center">
                    <div className="w-1 h-1 bg-brand-accent rounded-full shadow-[0_0_5px_rgba(255,214,2,1)]" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <div className="group relative">
                      {/* Card Glow */}
                      <div className="absolute -inset-0.5 bg-linear-to-r from-brand-primary/0 via-brand-accent/0 to-brand-primary/0 group-hover:via-brand-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                      
                      <div className="relative p-8 rounded-2xl border border-white/5 bg-brand-card hover:border-brand-accent/30 transition-all duration-500 cursor-default">
                        <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-accent border border-brand-primary/20 group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-300">
                            {item.icon}
                          </div>
                          <div className={`flex flex-col ${index % 2 === 0 ? "md:items-start" : "md:items-end"}`}>
                            <span className="font-mono text-sm font-bold tracking-widest text-white">
                              {item.time.split(' ')[0]}
                              <span className="text-brand-accent ml-1 font-medium opacity-70">{item.time.split(' ')[1]}</span>
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-brand-accent transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-brand-muted/70 leading-relaxed font-medium">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for MD+ screens */}
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="snap-start shrink-0 py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-60 h-16 rounded-full flex items-center justify-center bg-black overflow-hidden relative z-10">
                <img 
                  className="w-60 h-60 brightness-0 invert " 
                  src="/AGT_HUB_Logo.png" 
                  alt="AGT HUB" 
                />
              </div>
            </div>
            <p className="text-brand-muted/50 text-xs max-w-xs text-center md:text-left">
              Empowering the next generation of developers through high-stakes innovation.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-8 text-brand-muted/60 text-sm font-bold uppercase tracking-widest">
              <a
                href="https://t.me/AGT_HUB"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-accent transition-colors"
              >
                Telegram
              </a>

              <a
                href="https://www.linkedin.com/in/YourLinkedInID/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-accent transition-colors"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/AGT-HUB-Team"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-accent transition-colors"
              >
                GitHub
              </a>
            </div>
            <div className="text-brand-muted/30 text-[10px] font-mono tracking-widest uppercase">
              © 2026 AGT HUB • ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
