import { motion } from 'motion/react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Cpu, 
  Layers, 
  Bot, 
  Box, 
  Laptop,
  CheckCircle2,
  Wrench,
  CircuitBoard
} from 'lucide-react';
import { staggerContainer, fadeUpVariant, scaleInVariant } from '../../utils/animations';

export interface ExperienceSkill {
  name: string;
  icon?: React.ReactNode;
}

export interface ExperienceHighlight {
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyLogo?: string;
  companyUrl?: string;
  employmentType: string;
  duration: string;
  location: string;
  workMode: string;
  status?: string;
  description: string;
  skills: ExperienceSkill[];
  highlights?: ExperienceHighlight[];
}

/**
 * Company Logo display with hover effect and crisp container
 */
function CompanyLogo({
  logoUrl,
  company,
  className = 'w-14 h-14 sm:w-16 sm:h-16',
}: {
  logoUrl?: string;
  company: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-white p-2.5 shadow-lg shadow-black/20 border border-white/20 group-hover:scale-105 group-hover:border-cyan-400/50 group-hover:shadow-cyan-500/20 transition-all duration-300 shrink-0 overflow-hidden ${className}`}
      aria-label={`${company} Logo`}
    >
      <img
        src={logoUrl || '/vir-innovations.png'}
        alt={`${company} Logo`}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

const experiences: ExperienceItem[] = [
  {
    id: 'vir-innovations',
    role: 'Robotics Engineering Intern',
    company: 'Vir Innovations',
    companyLogo: '/vir-innovations.png',
    companyUrl: 'https://virinnovations.in',
    employmentType: 'Internship',
    duration: 'August 2026 – October 2026',
    location: 'Hyderabad, Telangana, India',
    workMode: 'Hybrid',
    status: 'Completed',
    description:
      'During my internship, I gained hands-on experience in robot design, electronics selection, and CAD modeling, working on the development of a real-world robotic system. It was a great opportunity to learn and apply robotics engineering concepts to practical hardware development.',
    skills: [
      { name: 'Robotics', icon: <Bot size={13} className="text-cyan-400" /> },
      { name: 'SOLIDWORKS', icon: <Box size={13} className="text-blue-400" /> },
      { name: 'CAD Modeling', icon: <Layers size={13} className="text-purple-400" /> },
      { name: 'Electronics Selection', icon: <Cpu size={13} className="text-emerald-400" /> },
    ],
    highlights: [
      {
        title: 'Robot Design & Development',
        description:
          'Contributed to the mechanical and structural architecture of an operational robotic system, translating engineering requirements into physical subsystems.',
      },
      {
        title: 'Parametric CAD Modeling',
        description:
          'Modeled assemblies, functional mechanisms, and mounting frameworks in SOLIDWORKS with tight tolerance validation.',
      },
      {
        title: 'Hardware & Electronics Selection',
        description:
          'Specified actuators, sensors, and electrical interfaces optimized for real-world robotics performance and reliability.',
      },
    ],
  },
];

/**
 * Single Experience Card Component
 */
function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <motion.div
      variants={scaleInVariant}
      whileHover={{ y: -3 }}
      className="group relative glass-card-thin glow-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 text-left overflow-hidden"
    >
      {/* Ambient background light spot */}
      <div 
        className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-cyan-500/15 transition-all duration-500" 
        aria-hidden="true" 
      />

      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-white/[0.06]">
        {/* Left: Company Logo + Title + Badges */}
        <div className="flex items-start gap-4 sm:gap-5">
          <CompanyLogo logoUrl={item.companyLogo} company={item.company} />

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                {item.role}
              </h3>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap mt-2">
              {item.companyUrl ? (
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg sm:text-xl font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 group/link"
                >
                  <span>{item.company}</span>
                  <ExternalLink size={15} className="opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <span className="text-lg sm:text-xl font-semibold text-cyan-400">
                  {item.company}
                </span>
              )}

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-medium">
                {item.employmentType}
              </span>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 font-medium flex items-center gap-1.5">
                <Laptop size={12} className="text-purple-400" />
                {item.workMode}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Date, Location & Status Pills */}
        <div className="flex flex-wrap lg:flex-col lg:items-end gap-2.5 sm:gap-2">
          {/* Duration */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs sm:text-sm font-mono text-slate-300">
            <Calendar size={14} className="text-cyan-400 shrink-0" />
            <span>{item.duration}</span>
          </div>

          {/* Location */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs sm:text-sm text-slate-400">
            <MapPin size={14} className="text-emerald-400 shrink-0" />
            <span>{item.location}</span>
          </div>

          {/* Status */}
          {item.status && (
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{item.status}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description Box */}
      <div className="relative my-6 pl-4 sm:pl-5 border-l-2 border-cyan-500/50 bg-gradient-to-r from-cyan-950/20 via-transparent to-transparent rounded-r-xl py-3 pr-4">
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
          &ldquo;{item.description}&rdquo;
        </p>
      </div>

      {/* Key Engineering Pillars */}
      {item.highlights && item.highlights.length > 0 && (
        <div className="mb-6 pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <CircuitBoard size={14} className="text-cyan-400" />
            <span>Key Engineering Focus Areas</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {item.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-white mb-1.5">
                  <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                  <span>{highlight.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Competencies Badges */}
      <div className="pt-2">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Wrench size={14} className="text-cyan-400" />
          <span>Core Skills &amp; Tools</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {item.skills.map((skill, idx) => (
            <motion.span
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-mono rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-200 hover:border-cyan-500/40 hover:text-cyan-200 hover:bg-cyan-500/10 transition-all duration-300 cursor-default shadow-sm"
            >
              {skill.icon}
              <span>{skill.name}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ExperienceSection Component
 * Showcases professional engineering experience and internships.
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="relative min-h-screen py-24 lg:py-32 overflow-hidden flex flex-col justify-center">
      {/* Background ambient glows */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-left mb-16 max-w-3xl"
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-mono mb-4"
          >
            <Briefcase size={14} />
            <span>Professional Trajectory</span>
          </motion.div>

          <motion.h2
            variants={fadeUpVariant}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white"
          >
            Work Experience
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            className="text-lg text-slate-400 leading-relaxed"
          >
            Practical engineering roles applying robotics, hardware-software integration, and mechanical CAD modeling to real-world autonomous systems.
          </motion.p>
        </motion.div>

        {/* Timeline & Experience List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-8"
        >
          {experiences.map((item) => (
            <ExperienceCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
