import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Leaf, Code, Cpu, Target, Wrench, Database, Globe, Github, Linkedin } from 'lucide-react';
import { staggerContainer, fadeUpVariant, scaleInVariant } from '../../utils/animations';

function SkillCategory({ icon, title, skills }: { icon: React.ReactNode; title: string; skills: string[] }) {
  return (
    <motion.div
      variants={scaleInVariant}
      whileHover={{ y: -4 }}
      className="group glass-card-thin glow-card hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300"
    >
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            {icon}
          </motion.div>
        </div>
        <h3 className="font-bold text-lg text-white">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/[0.02] border border-white/[0.04] text-slate-300 group-hover:border-cyan-500/20 group-hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function GitHubGrid() {
  // Memoize the random values so they don't change on re-render
  const cells = useMemo(() => {
    return Array.from({ length: 60 }).map(() => ({
      isCommit: Math.random() > 0.55,
      intensity: Math.random(),
      animDuration: 2.5 + Math.random() * 2,
      animDelay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="grid grid-cols-12 gap-1 mb-6" aria-label="GitHub activity visualization">
      {cells.map((cell, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.008 }}
          animate={cell.isCommit ? { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] } : {}}
          {...(cell.isCommit ? {
            transition: { duration: cell.animDuration, repeat: Infinity, ease: "easeInOut", delay: cell.animDelay }
          } : {})}
          className={`h-3 rounded-sm ${
            cell.isCommit
              ? (cell.intensity > 0.7 ? 'bg-emerald-400' : cell.intensity > 0.4 ? 'bg-emerald-500' : 'bg-emerald-700')
              : 'bg-slate-800/50'
          }`}
        />
      ))}
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="environment" className="relative min-h-screen py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono mb-6 mx-auto">
            <Leaf size={14} />
            <span>Sustainable Robotics Vision</span>
          </motion.div>
          <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Technical Arsenal</motion.h2>
          <motion.div variants={fadeUpVariant} className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-slate-400 text-sm font-medium">
            <span>Precision Agriculture</span>
            <span className="text-slate-700">•</span>
            <span>Waste Management Robotics</span>
            <span className="text-slate-700">•</span>
            <span>Energy-Efficient Systems</span>
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <SkillCategory icon={<Code size={20} />} title="Programming" skills={['C', 'Python']} />
          <SkillCategory icon={<Cpu size={20} />} title="Embedded Systems" skills={['ESP32', 'Arduino', 'Sensor Interfacing', 'PWM Motor Control', 'BTS7960']} />
          <SkillCategory icon={<Target size={20} />} title="Control & AI" skills={['PID Controllers', 'YOLO Basics', 'Computer Vision']} />
          <SkillCategory icon={<Wrench size={20} />} title="Mechanical" skills={['Pneumatic Systems', 'Mechanical Design', 'Kinematics']} />
          <SkillCategory icon={<Database size={20} />} title="CAD & Tools" skills={['SolidWorks', 'LTSpice', 'Arduino IDE', 'VS Code']} />
          <SkillCategory icon={<Globe size={20} />} title="Languages" skills={['English (Fluent)', 'Telugu (Native)', 'Hindi (Conversational)']} />
        </motion.div>

        {/* GitHub & LinkedIn */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeUpVariant} whileHover={{ y: -4 }} className="glass-card-thin glow-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Github className="text-slate-400" size={22} />
                <span>Engineering Activity</span>
              </h3>
            </div>
            <GitHubGrid />
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://github.com/JOTHIRNADHREDDY"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center font-medium transition-all block"
            >
              View GitHub Profile
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUpVariant} whileHover={{ y: -4 }} className="glass-card-thin glow-card p-8 rounded-2xl border-blue-500/10 hover:border-blue-500/20 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center space-x-2 mb-4">
                <Linkedin className="text-blue-400" size={22} />
                <span>Professional Network</span>
              </h3>
              <p className="text-slate-400 mb-6 italic">
                "Autonomous Systems & Intelligent Robotics Engineer"
              </p>
            </div>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-center font-medium transition-all block shadow-lg shadow-blue-500/20"
            >
              Connect on LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
