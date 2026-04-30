import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Code, ChevronRight, Github, X, FileText, PenLine, Trash2, Search } from 'lucide-react';
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

const renderTitleWithDate = (title: string) => {
  const match = title.match(/(.*?)\s*(\([^)]+\))$/);
  if (match) {
    return (
      <>
        <span className="block leading-snug">{match[1]}</span>
        <span className="block font-normal opacity-70 text-[0.8em] mt-1 text-slate-300">{match[2]}</span>
      </>
    );
  }
  return title;
};

function ProjectCard({ project, onClick, isOwner, onDelete }: { project: Project; onClick: () => void; isOwner: boolean; onDelete?: () => void }) {
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
      x: ((y - rect.height / 2) / rect.height) * -4,
      y: ((x - rect.width / 2) / rect.width) * 4,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      variants={scaleInVariant}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformPerspective: 800, rotateX: tilt.x, rotateY: tilt.y }}
      className={`group cursor-pointer glass-card ${theme.border} rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl ${theme.glow} relative overflow-hidden flex flex-col h-full`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={`View details for ${project.title}`}
    >
      {/* Mouse follow glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${theme.glowColor}, transparent 40%)` }} />

      {/* Owner delete button for custom projects */}
      {isOwner && isCustom && onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
          title="Remove project"
          aria-label="Remove project"
        >
          <Trash2 size={12} />
        </motion.button>
      )}

      {/* Category badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="px-2.5 py-0.5 text-xs font-mono rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-400">
          {project.category}
        </span>
        <div className={`w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} transition-all duration-300`}>
          <ChevronRight size={14} />
        </div>
      </div>

      <h3 className={`text-lg font-bold text-white ${theme.text} transition-colors duration-300 mb-3 relative z-10`}>{renderTitleWithDate(project.title)}</h3>

      <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
        {project.tech.map((t, i) => (
          <span key={i} className="px-2 py-0.5 text-xs font-mono rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.04]">{t}</span>
        ))}
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 relative z-10 group-hover:text-slate-300 transition-colors duration-300">{project.problem}</p>

      {/* Metrics tags */}
      <div className="mt-auto pt-4 border-t border-white/[0.04] relative z-10 flex flex-wrap gap-2">
        {Object.keys(project.metrics).map((key) => (
          <span key={key} className="px-2.5 py-1 text-[11px] font-mono rounded-full bg-cyan-500/8 border border-cyan-500/15 text-cyan-300/80 uppercase tracking-wider">
            {key}
          </span>
        ))}
      </div>
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

  // Get categories that actually have projects
  const availableCategories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tech.some(t => t.toLowerCase().includes(q)) ||
        p.problem.toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, activeCategory, searchQuery]);

  return (
    <section id="defence" className="relative min-h-screen py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-12">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono mb-6">
            <Target size={14} />
            <span>Engineered Solutions</span>
          </motion.div>
          <div className="flex items-center gap-4 mb-4">
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight">Engineered Projects</motion.h2>
            {/* Owner pencil button to add new project */}
            {isOwner && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 transition-all shadow-lg shadow-emerald-500/10"
                title="Add new project"
                aria-label="Add new project"
              >
                <PenLine size={16} />
                <span className="text-sm font-medium hidden sm:inline">Add Project</span>
              </motion.button>
            )}
          </div>
          <motion.p variants={fadeUpVariant} className="text-slate-400 max-w-2xl">
            Precision systems designed for critical applications, featuring advanced computer vision, robust control theory, and reliable hardware integration.
          </motion.p>
        </motion.div>

        {/* Filter & Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 transition-all w-full sm:w-56"
            />
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  isOwner={isOwner}
                  onDelete={() => removeProject(project.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-center py-16 text-slate-500"
            >
              <p className="text-lg mb-2">No projects found</p>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </motion.div>
          )}
        </motion.div>

        {/* Certifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="border-t border-white/[0.06] pt-16">
          <h3 className="text-2xl font-bold mb-8">Certifications & Achievements</h3>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ y: -3, scale: 1.02 }}
              className="flex items-center space-x-4 glass-card p-5 rounded-2xl border-emerald-500/20 hover:border-emerald-500/40 animate-[badge-glow_3s_ease-in-out_infinite]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Target size={22} />
              </div>
              <div>
                <div className="font-bold text-white">Best Hardware Design</div>
                <div className="text-sm text-slate-500">ARC'26</div>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.02 }}
              className="flex items-center space-x-4 glass-card p-5 rounded-2xl border-emerald-500/20 hover:border-emerald-500/40 animate-[badge-glow_3s_ease-in-out_infinite]"
              style={{ animationDelay: '0.5s' }}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Code size={22} />
              </div>
              <div>
                <div className="font-bold text-white">100 Days of Code</div>
                <div className="text-sm text-slate-500">Python Bootcamp</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
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
            aria-label={`Project details: ${selectedProject.title}`}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">{renderTitleWithDate(selectedProject.title)}</h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Statement</h4>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.longProblem}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Approach</h4>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.approach}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Learning Outcomes</h4>
                    <p className="text-slate-300 leading-relaxed">{selectedProject.learning}</p>
                  </div>

                  {selectedProject.datasheets.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Component Datasheets</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.datasheets.map((ds, i) => (
                          <a key={i} href={ds.link} className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-card hover:border-white/10 transition-all text-sm text-slate-300">
                            <FileText size={16} className="text-slate-400" />
                            <span>{ds.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Key Metrics</h4>
                    <div className="flex flex-wrap gap-3">
                      {Object.keys(selectedProject.metrics).map((metricKey) => (
                        <span key={metricKey} className="px-4 py-2 text-sm font-mono rounded-xl bg-cyan-500/8 border border-cyan-500/15 text-cyan-300 capitalize tracking-wide">
                          {metricKey}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 text-sm font-mono rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]">{t}</span>
                      ))}
                    </div>
                    <a href={selectedProject.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors">
                      <Github size={18} />
                      <span>View Source</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal (owner only) */}
      <AddProjectModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </section>
  );
}
