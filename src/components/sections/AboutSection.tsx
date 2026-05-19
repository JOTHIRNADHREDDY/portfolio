import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, ChevronRight, Github, Linkedin, Download, Cpu, Mail, Bot } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { staggerContainer, fadeUpVariant, fadeRightVariant, fadeLeftVariant, blurFadeVariant } from '../../utils/animations';
import { ResumeModal } from '../ui/ResumeModal';
import { AnimatedName } from '../ui/AnimatedName';
import { RESUME_PDF_URL } from '../../utils/DataStore';

function AnimatedStat({ value, label, suffix = '', decimals = 0 }: { value: number; label: string; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        if (decimals > 0) {
          const steps = 40;
          let step = 0;
          const timer = setInterval(() => {
            step += 1;
            const progress = step / steps;
            setCount(parseFloat((value * progress).toFixed(decimals)));
            if (step >= steps) {
              setCount(value);
              clearInterval(timer);
            }
          }, 30);
        } else {
          let start = 0;
          const increment = value / 40;
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 30);
        }
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, decimals]);

  const display = decimals > 0 ? count.toFixed(decimals) : `${count}`;

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -2 }}
      className="text-left rounded-2xl p-6 glass-card-thin glow-card"
    >
      <motion.div
        className="text-3xl md:text-4xl font-bold font-mono gradient-text tabular-nums leading-none"
        layout
      >
        {display}{suffix}
      </motion.div>
      <div className="text-sm text-slate-400 mt-2 leading-snug">{label}</div>
    </motion.div>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const openResume = () => setIsResumeOpen(true);
    window.addEventListener('open-resume', openResume);
    return () => window.removeEventListener('open-resume', openResume);
  }, []);

  return (
    <section id="space" ref={ref} className="relative min-h-screen pt-20 overflow-hidden">
      <motion.div
        className="absolute top-32 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-32">
          <div className="max-w-4xl text-left">
            <motion.div variants={blurFadeVariant} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-mono mb-8">
              <Bot size={14} />
              <span>Autonomous Systems & Intelligent Robotics Engineer</span>
            </motion.div>

            <motion.div variants={blurFadeVariant}>
              <AnimatedName />
            </motion.div>

            <motion.h1 variants={blurFadeVariant} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-[1.15] text-white">
              Autonomous Systems & Intelligent Robotics Engineer
            </motion.h1>

            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-300 mb-4 max-w-2xl leading-relaxed">
              I build robotic systems that combine embedded control, computer vision, and mechanical design for real-world applications.
            </motion.p>

            <motion.p variants={fadeUpVariant} className="text-base text-slate-500 mb-6 max-w-2xl leading-relaxed">
              Focused on embedded AI, vision-guided control, precision agriculture, and autonomous hardware systems.
            </motion.p>

            <motion.p variants={fadeUpVariant} className="text-[15px] text-slate-400 mb-10 max-w-2xl leading-relaxed">
              I&apos;m Peram Jothirnadh Reddy, a Mechatronics engineer focused on autonomous systems, embedded AI, and intelligent robotics.
              I build real-world robotic prototypes by combining mechanical design, embedded electronics, control systems, and computer vision.
            </motion.p>

            <motion.p variants={fadeUpVariant} className="text-sm text-emerald-400/90 font-mono mb-8 max-w-2xl leading-relaxed">
              Open to robotics internships, engineering collaborations, and embedded AI projects in autonomous systems, precision agriculture, and intelligent hardware.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="#defence"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                <span>View Projects</span>
                <ChevronRight size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href={RESUME_PDF_URL}
                download="PERAM_JOTHIRNADH_REDDY_Resume.pdf"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2"
              >
                <Download size={18} />
                <span>Resume</span>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsResumeOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm text-slate-400"
              >
                Preview CV
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="https://github.com/JOTHIRNADHREDDY"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2"
              >
                <Github size={18} />
                <span>GitHub</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="mailto:p.jothirnadhreddy@gmail.com"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2"
              >
                <Mail size={18} />
                <span>Email</span>
              </motion.a>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-32"
        >
          <AnimatedStat value={7} label="Projects Built" suffix="+" />
          <AnimatedStat value={9.51} label="CGPA" decimals={2} />
          <AnimatedStat value={95} label="YOLO Accuracy" suffix="%" />
          <AnimatedStat value={1} label="Award Won" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-20">
          <motion.div style={{ y: yParallax }} variants={fadeRightVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-left">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center"
                whileHover={{ rotate: 8, scale: 1.05 }}
              >
                <Cpu className="text-cyan-400" size={20} />
              </motion.div>
              <span>Engineering Philosophy</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4 text-[15px]">
              I build robotic systems by combining mechanical design, embedded electronics, and software into testable prototypes, then improve them using measurable performance data.
            </p>
            <p className="text-slate-500 leading-relaxed text-[15px]">
              I approach robotics as an integration problem: the best systems come from mechanical design, electronics, and software working together. My goal is to build practical, testable systems that solve real problems in agriculture, automation, and autonomous machines.
            </p>
            <motion.div className="space-y-4 mt-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-sm font-mono text-slate-500 uppercase tracking-wider">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Autonomous Systems', 'Embedded AI', 'Vision-Guided Control', 'Precision Agriculture', 'Control Systems', 'Intelligent Hardware'].map((interest) => (
                  <motion.span
                    key={interest}
                    variants={fadeUpVariant}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-cyan-950/20 border border-cyan-900/20 text-cyan-300 cursor-default backdrop-blur-sm"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: yParallax }} variants={fadeLeftVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-left">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"
                whileHover={{ rotate: -8, scale: 1.05 }}
              >
                <Terminal className="text-blue-400" size={20} />
              </motion.div>
              <span>Education</span>
            </h2>
            <div className="space-y-4">
              <motion.div whileHover={{ x: 4 }} className="relative pl-6 border-l-2 border-cyan-500/40">
                <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                <div className="glass-card-thin glow-card rounded-xl p-5">
                  <motion.div
                    className="flex items-center justify-between mb-1 flex-wrap gap-2"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="font-bold text-lg text-white">B.Tech Mechatronics</h4>
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-400/10">2024–2028</span>
                  </motion.div>
                  <p className="text-sm text-slate-400 mb-2">SRM Institute of Science and Technology</p>
                  <motion.div
                    className="text-sm font-mono text-cyan-300 font-semibold"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    CGPA: 9.51
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
}
