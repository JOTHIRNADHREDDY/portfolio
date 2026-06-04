import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Code, ChevronRight, Github, X, FileText, PenLine, Trash2, Search, ExternalLink, Cpu, Star } from 'lucide-react';
import { staggerContainer, fadeUpVariant, scaleInVariant } from '../../utils/animations';
import { useAuth } from '../../utils/AuthContext';
import { useDataStore, type Project } from '../../utils/DataStore';
import { AddProjectModal } from '../ui/AddProjectModal';

const categories = ['All', 'Hardware', 'AI', 'Software', 'Research'];

const themeColors: Record<string, { border: string; glow: string; text: string; bg: string; glowColor: string }> = {
  emerald: { border: 'hover:border-emerald-500/50', glow: 'hover:shadow-emerald-500/20', text: 'group-hover:text-emerald-400', bg: 'group-hover:bg-emerald-500/20', glowColor: 'rgba(16,185,129,0.12)' },
  blue: { border: 'hover:border-blue-500/50', glow: 'hover:shadow-blue-500/20', text: 'group-hover:text-blue-400', bg: 'group-hover:bg-blue-500/20', glowColor: 'rgba(59,130,246,0.12)' },
  amber: { border: 'hover:border-amber-500/50', glow: 'hover:shadow-amber-500/20', text: 'group-hover:text-amber-400', bg: 'group-hover:bg-amber-500/20', glowColor: 'rgba(245,158,11,0.12)' },
  purple: { border: 'hover:border-purple-500/50', glow: 'hover:shadow-purple-500/20', text: 'group-hover:text-purple-400', bg: 'group-hover:bg-purple-500/20', glowColor: 'rgba(168,85,247,0.12)' },
};

const projectVisuals: Record<string, { label: string; gradient: string; image?: string }> = {
  'default-1': {
    label: 'Weed detection · YOLO + ESP32',
    gradient: 'from-emerald-600/30 via-cyan-900/20 to-slate-900',
    image: '/projects/weed-robot.png',
  },
  'default-5': {
    label: 'ESP32 · Live process dashboard',
    gradient: 'from-emerald-700/30 via-teal-900/20 to-slate-900',
    image: '/projects/esp32-monitor.png',
  },
  'default-2': {
    label: 'PID · IMU balance control',
    gradient: 'from-blue-600/30 via-indigo-900/20 to-slate-900',
    image: '/projects/self-balancing-robot.png',
  },
  'default-3': { 
    label: 'Pneumatic safety bumper', 
    gradient: 'from-amber-600/30 via-orange-900/20 to-slate-900',
    image: '/projects/pneumatic-bumper.jpg',
  },
  'default-7': { 
    label: 'Truss force visualization', 
    gradient: 'from-amber-500/30 via-yellow-900/20 to-slate-900',
    image: '/projects/truss-simulator.png',
  },
  'default-4': { 
    label: 'Remote trash collection bot', 
    gradient: 'from-purple-600/30 via-violet-900/20 to-slate-900',
    image: '/projects/trash-bot.jpg',
  },
  'default-6': { 
    label: 'AI grocery planning', 
    gradient: 'from-purple-500/30 via-fuchsia-900/20 to-slate-900',
    image: '/projects/smart-basket.png',
  },
};

function ProjectVisual({ project, featured = false }: { project: Project; featured?: boolean }) {
  const visual = projectVisuals[project.id] || { label: project.category, gradient: 'from-slate-700/40 to-slate-900' };
  const heightClass = featured ? 'h-48 md:h-56' : 'h-32';

  if (visual.image) {
    return (
      <div className={`relative overflow-hidden rounded-xl mb-4 border border-white/[0.06] ${heightClass}`}>
        <img
          src={visual.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span className="text-[11px] font-mono text-cyan-300/90 uppercase tracking-wider">{visual.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl mb-4 border border-white/[0.06] bg-gradient-to-br ${visual.gradient} ${heightClass}`}
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)',
          backgroundSize: '200% 100%',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <Cpu size={featured ? 36 : 28} className="text-cyan-400/60 mb-2" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{visual.label}</span>
        <span className="text-[10px] text-slate-600 mt-1">Photo coming soon</span>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
  isOwner,
  onDelete,
  featured = false,
}: {
  project: Project;
  onClick: () => void;
  isOwner: boolean;
  onDelete?: () => void;
  featured?: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const theme = themeColors[project.theme] || themeColors.emerald;
  const isCustom = project.id.startsWith('custom-');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setTilt({
      x: ((y - rect.height / 2) / rect.height) * (featured ? -3 : -4),
      y: ((x - rect.width / 2) / rect.width) * (featured ? 3 : 4),
    });
  };

  return (
    <motion.div
      variants={scaleInVariant}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setMousePos({ x: 0, y: 0 }); }}
      style={{ transformPerspective: 800, rotateX: tilt.x, rotateY: tilt.y }}
      className={`group cursor-pointer glass-card ${theme.border} rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl ${theme.glow} relative overflow-hidden flex flex-col h-full text-left ${
        featured ? 'md:p-8 ring-1 ring-cyan-500/20' : ''
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`View details for ${project.title}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${theme.glowColor}, transparent 40%)` }}
      />

      {featured && (
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-3 relative z-10">
          <Star size={12} className="fill-cyan-400" />
          <span>Flagship Project</span>
        </div>
      )}

      {isOwner && isCustom && onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Remove project"
        >
          <Trash2 size={12} />
        </motion.button>
      )}

      <ProjectVisual project={project} featured={featured} />

      <motion.div className="flex justify-between items-start mb-3 relative z-10" layout>
        <span className="px-2.5 py-0.5 text-xs font-mono rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-400">
          {project.category}
        </span>
        <div className={`w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} transition-all`}>
          <ChevronRight size={14} />
        </div>
      </motion.div>

      <h3 className={`font-bold text-white ${theme.text} transition-colors duration-300 mb-2 relative z-10 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
        {project.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
        {project.tech.slice(0, featured ? 6 : 4).map((t) => (
          <span key={t} className="px-2 py-0.5 text-xs font-mono rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.04]">{t}</span>
        ))}
      </div>

      <p className={`text-slate-400 relative z-10 group-hover:text-slate-300 transition-colors ${featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
        {project.problem}
      </p>

      <div className="flex flex-wrap gap-2 mt-3 relative z-20">
        {project.github && project.github !== '#' && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all"
          >
            <Github size={13} />
            <span>GitHub</span>
          </a>
        )}
        {project.previewUrl && project.previewUrl !== '#' && (
          <a
            href={project.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <ExternalLink size={13} />
            <span>Live Demo</span>
          </a>
        )}
      </div>

      {project.resultTags.length > 0 && (
        <div className="mt-auto pt-4 border-t border-white/[0.04] relative z-10 flex flex-wrap gap-2">
          {project.resultTags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-[11px] font-mono rounded-full bg-cyan-500/8 border border-cyan-500/15 text-cyan-300/90">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function ProjectsSection() {
  const { isOwner } = useAuth();
  const { projects, removeProject } = useDataStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)),
    [projects],
  );

  const availableCategories = useMemo(() => {
    const cats = new Set(sortedProjects.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [sortedProjects]);

  const filtered = useMemo(() => {
    let result = sortedProjects;
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q)) ||
          p.problem.toLowerCase().includes(q),
      );
    }
    return result;
  }, [sortedProjects, activeCategory, searchQuery]);

  const flagship = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p.id !== flagship?.id);

  return (
    <section id="defence" className="relative min-h-screen py-28 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mb-14 text-left">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono mb-6">
            <Target size={14} />
            <span>Engineered Solutions</span>
          </motion.div>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight">
              Engineered Projects
            </motion.h2>
            {isOwner && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              >
                <PenLine size={16} />
                <span className="text-sm font-medium">Add Project</span>
              </motion.button>
            )}
          </div>
          <motion.p variants={fadeUpVariant} className="text-slate-400 max-w-2xl text-base leading-relaxed">
            Robotics and embedded systems case studies — computer vision, control theory, and hardware integration with measurable outcomes.
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row gap-4 mb-12 items-start sm:items-center">
          <motion.div className="relative z-30" whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 px-4 py-2.5 min-w-[160px] text-sm rounded-xl font-medium bg-white/[0.03] text-slate-300 border border-white/[0.06] hover:bg-white/[0.06] transition-all"
            >
              <span>
                <span className="text-slate-500">Category: </span>
                <span className="text-cyan-400">{activeCategory}</span>
              </span>
              <ChevronRight size={16} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 mt-2 min-w-[180px] p-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl z-40"
                >
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all ${
                        activeCategory === cat ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/[0.04]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/30 w-full"
            />
          </div>
        </motion.div>

        <div className="mb-20 min-h-[200px]">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 rounded-3xl border border-dashed border-white/[0.06]"
              >
                <p className="text-lg text-slate-300">No projects found</p>
              </motion.div>
            ) : (
              <motion.div key={activeCategory + searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {flagship && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProjectCard
                      project={flagship}
                      featured
                      onClick={() => setSelectedProject(flagship)}
                      isOwner={isOwner}
                      onDelete={() => removeProject(flagship.id)}
                    />
                  </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProjectCard
                        project={project}
                        onClick={() => setSelectedProject(project)}
                        isOwner={isOwner}
                        onDelete={() => removeProject(project.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/[0.06] pt-16 text-left"
        >
          <h3 className="text-2xl font-bold mb-8">Certifications & Achievements</h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <motion.div
              whileHover={{ y: -3 }}
              className="flex items-center space-x-4 glass-card p-5 rounded-2xl border-emerald-500/30 flex-1 min-w-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Target size={22} />
              </div>
              <div>
                <motion.div className="font-bold text-white" whileHover={{ x: 2 }}>Best Hardware Design</motion.div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Awarded Best Hardware Design at ARC&apos;26 for a semi-autonomous robotics hardware concept integrating sensing, embedded control, and real-time targeting.
                </p>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="flex items-center space-x-4 glass-card-thin p-4 rounded-2xl opacity-70 flex-1 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 shrink-0">
                <Code size={18} />
              </div>
              <motion.div initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
                <motion.div className="font-medium text-slate-400 text-sm">100 Days of Code</motion.div>
                <div className="text-xs text-slate-600">Python Bootcamp</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedProject.title}</h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 shrink-0"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                <ProjectVisual project={selectedProject} featured />

                <div className="space-y-7">
                  {[
                    { label: 'Problem', content: selectedProject.longProblem },
                    { label: 'What I Built', content: selectedProject.whatBuilt },
                    { label: 'Engineering Challenge', content: selectedProject.challenge },
                    { label: 'Result', content: selectedProject.result },
                  ].map(({ label, content }) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</h4>
                      <p className="text-slate-300 leading-relaxed text-[15px]">{content}</p>
                    </motion.div>
                  ))}

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tech Stack</h4>
                    <motion.div className="flex flex-wrap gap-2" variants={staggerContainer} initial="hidden" animate="visible">
                      {selectedProject.tech.map((t) => (
                        <motion.span
                          key={t}
                          variants={fadeUpVariant}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 text-sm font-mono rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>

                  {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Key Highlights</h4>
                      <ul className="space-y-2">
                        {selectedProject.highlights.map((item) => (
                          <li key={item} className="text-slate-300 text-[15px] flex gap-2 leading-relaxed">
                            <span className="text-cyan-400 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.datasheets.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Component Datasheets</h4>
                      <motion.div className="flex flex-wrap gap-3" variants={staggerContainer} initial="hidden" animate="visible">
                        {selectedProject.datasheets.map((ds) => (
                          <motion.a
                            key={ds.name}
                            variants={fadeUpVariant}
                            whileHover={{ y: -2 }}
                            href={ds.link}
                            className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-300"
                          >
                            <FileText size={16} className="text-slate-400" />
                            <span>{ds.name}</span>
                          </motion.a>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-white/[0.06] flex flex-wrap gap-3">
                    {selectedProject.github && selectedProject.github !== '#' && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors"
                      >
                        <Github size={18} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {selectedProject.previewUrl && selectedProject.previewUrl !== '#' && (
                      <a
                        href={selectedProject.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold"
                      >
                        <ExternalLink size={18} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddProjectModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </section>
  );
}
