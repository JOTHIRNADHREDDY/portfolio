import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Code, Cpu, Target, Wrench, Box, Github, Linkedin, BookOpen } from 'lucide-react';
import { staggerContainer, fadeUpVariant, scaleInVariant } from '../../utils/animations';

function SkillCategory({ icon, title, skills }: { icon: React.ReactNode; title: string; skills: string[] }) {
  return (
    <motion.div
      variants={scaleInVariant}
      whileHover={{ y: -4 }}
      className="group glass-card-thin glow-card hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 text-left"
    >
      <motion.div
        className="flex items-center space-x-3 mb-5"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-white">{title}</h3>
      </motion.div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.04 }}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/[0.02] border border-white/[0.04] text-slate-300 group-hover:border-cyan-500/20 group-hover:text-cyan-200 transition-all duration-300"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function GitHubGrid() {
  const cells = useMemo(() => {
    return Array.from({ length: 60 }).map(() => ({
      isCommit: Math.random() > 0.55,
      intensity: Math.random(),
      animDuration: 2.5 + Math.random() * 2,
      animDelay: Math.random() * 2,
    }));
  }, []);

  return (
    <motion.div
      className="grid grid-cols-12 gap-1 mb-6"
      aria-label="GitHub activity visualization"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {cells.map((cell, i) => (
        <motion.div
          key={i}
          variants={fadeUpVariant}
          animate={cell.isCommit ? { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] } : {}}
          transition={
            cell.isCommit
              ? { duration: cell.animDuration, repeat: Infinity, ease: 'easeInOut', delay: cell.animDelay }
              : undefined
          }
          className={`h-3 rounded-sm ${
            cell.isCommit
              ? cell.intensity > 0.7
                ? 'bg-emerald-400'
                : cell.intensity > 0.4
                  ? 'bg-emerald-500'
                  : 'bg-emerald-700'
              : 'bg-slate-800/50'
          }`}
        />
      ))}
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section id="environment" className="relative min-h-screen py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-left mb-16 max-w-3xl"
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono mb-6"
          >
            <Target size={14} />
            <span>Technical Skills</span>
          </motion.div>
          <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Technical Arsenal
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-slate-400 text-base leading-relaxed">
            Embedded systems, robotics control, and computer vision for real hardware — with a focus on measurable, testable engineering outcomes.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          <SkillCategory icon={<Code size={20} />} title="Programming" skills={['C', 'Python']} />
          <SkillCategory
            icon={<Target size={20} />}
            title="Robotics & Control"
            skills={['PID Control', 'Kinematics', 'Sensor Fusion', 'Motion Control']}
          />
          <SkillCategory
            icon={<Cpu size={20} />}
            title="Embedded Systems"
            skills={['ESP32', 'Arduino', 'PWM Motor Control', 'Sensor Interfacing', 'BTS7960']}
          />
          <SkillCategory
            icon={<Target size={20} />}
            title="Computer Vision & AI"
            skills={[
              'YOLO object detection',
              'OpenCV basics',
              'Dataset preparation',
              'Real-time targeting',
            ]}
          />
          <SkillCategory
            icon={<Wrench size={20} />}
            title="Mechanical Systems"
            skills={['Pneumatic systems', 'Mechanical design', 'Safety mechanisms']}
          />
          <SkillCategory
            icon={<Box size={20} />}
            title="CAD & Engineering Tools"
            skills={['SolidWorks', 'LTSpice', 'Arduino IDE', 'VS Code']}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-thin glow-card rounded-2xl p-6 mb-6 text-left border-cyan-500/20"
        >
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen size={20} className="text-cyan-400" />
            <h3 className="font-bold text-lg text-white">ROS 2 — Currently Learning</h3>
          </motion.div>
          <p className="text-sm text-slate-400 mb-4">
            Currently learning: ROS 2, SLAM fundamentals, autonomous navigation, and simulation workflows.
          </p>
          <motion.div
            className="flex flex-wrap gap-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              'Nodes & topics',
              'Publishers / subscribers',
              'Basic package structure',
              'Sensor integration fundamentals',
            ].map((skill) => (
              <motion.span
                key={skill}
                variants={fadeUpVariant}
                whileHover={{ scale: 1.04 }}
                className="px-3 py-1.5 text-sm rounded-lg bg-cyan-950/20 border border-cyan-900/30 text-cyan-300"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeUpVariant} whileHover={{ y: -4 }} className="glass-card-thin glow-card p-8 rounded-2xl text-left">
            <h3 className="text-xl font-bold flex items-center space-x-2 mb-6">
              <Github className="text-slate-400" size={22} />
              <span>Engineering Activity</span>
            </h3>
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

          <motion.div
            variants={fadeUpVariant}
            whileHover={{ y: -4 }}
            className="glass-card-thin glow-card p-8 rounded-2xl border-blue-500/10 hover:border-blue-500/20 flex flex-col justify-between text-left"
          >
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h3 className="text-xl font-bold flex items-center space-x-2 mb-4">
                <Linkedin className="text-blue-400" size={22} />
                <span>Professional Network</span>
              </h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Autonomous Systems & Intelligent Robotics Engineer — embedded AI, vision-guided control, and intelligent hardware.
              </p>
            </motion.div>
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
