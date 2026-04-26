import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, ChevronRight, Github, Linkedin, Download, Cpu, Sparkles, Bot, Zap } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { staggerContainer, fadeUpVariant, fadeRightVariant, fadeLeftVariant, blurFadeVariant } from '../../utils/animations';

function TypeWriter({ texts, speed = 80 }: { texts: string[]; speed?: number }) {
  const [currentTextIdx, setCurrentTextIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentTextIdx];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(current.substring(0, displayedText.length + 1));
        if (displayedText.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayedText(current.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentTextIdx((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIdx, texts, speed]);

  return (
    <span className="text-cyan-400">
      {displayedText}
      <span className="animate-[typing-cursor_0.8s_ease-in-out_infinite] text-cyan-300">|</span>
    </span>
  );
}

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let start = 0;
        const increment = value / 40;
        const timer = setInterval(() => {
          start += increment;
          if (start >= value) { setCount(value); clearInterval(timer); }
          else { setCount(Math.floor(start)); }
        }, 30);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold font-mono gradient-text">{count}{suffix}</div>
      <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="space" ref={ref} className="relative min-h-screen pt-20 overflow-hidden">
      <div className="absolute top-32 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-4xl">
            <motion.div variants={blurFadeVariant} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-mono mb-8">
              <Bot size={14} className="animate-[float_3s_ease-in-out_infinite]" />
              <span>Autonomous Systems & Intelligent Robotics Engineer</span>
            </motion.div>

            <motion.h1 variants={blurFadeVariant} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="block text-cyan-400 text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-normal">PERAM JOTHIRNADH REDDY</span>
              <span className="block text-white">Designing Autonomous</span>
              <span className="block text-white">Robotic Systems for</span>
              <span className="block mt-2">
                <TypeWriter texts={['Earth and Beyond', 'Space Exploration', 'Smart Agriculture', 'Defence Systems']} />
              </span>
            </motion.h1>

            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-400 mb-10 font-light max-w-2xl">
              <span className="inline-flex items-center gap-2"><Zap size={16} className="text-cyan-500" /> Embedded AI</span>
              <span className="text-slate-700 mx-3">•</span>
              <span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-blue-500" /> Vision-Guided Control</span>
              <span className="text-slate-700 mx-3">•</span>
              <span className="inline-flex items-center gap-2"><Cpu size={16} className="text-purple-500" /> Intelligent Mechanical Systems</span>
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3">
              <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href="#defence"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-500/20">
                <span>View Projects</span><ChevronRight size={18} />
              </motion.a>
              <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href="https://github.com/JOTHIRNADHREDDY" target="_blank" rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2">
                <Github size={18} /><span>GitHub</span>
              </motion.a>
              <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href="https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/" target="_blank" rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2">
                <Linkedin size={18} /><span>LinkedIn</span>
              </motion.a>
              <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href="#"
                className="px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2">
                <Download size={18} /><span>Resume</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          <div className="glass-card-thin glow-card rounded-2xl p-6"><AnimatedStat value={4} label="Projects Built" suffix="+" /></div>
          <div className="glass-card-thin glow-card rounded-2xl p-6"><AnimatedStat value={9} label="CGPA" suffix=".51" /></div>
          <div className="glass-card-thin glow-card rounded-2xl p-6"><AnimatedStat value={95} label="YOLO Accuracy" suffix="%" /></div>
          <div className="glass-card-thin glow-card rounded-2xl p-6"><AnimatedStat value={1} label="Award Won" /></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          <motion.div style={{ y: yParallax }} variants={fadeRightVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center"><Cpu className="text-cyan-400" size={20} /></div>
              <span>Engineering Philosophy</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6 text-[15px]">
              Driven by a profound passion for robotics, automation, and AI, I specialize in the seamless integration of mechanical design, electronics, and software. My focus is on developing robust, real-world solutions that push the boundaries of what autonomous systems can achieve.
            </p>
            <div className="space-y-4 mt-8">
              <h3 className="text-sm font-mono text-slate-500 uppercase tracking-wider">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Autonomous Systems', 'Space Robotics', 'Embedded AI', 'Vision-Guided Control', 'Drone Technology', 'Entrepreneurship'].map((interest) => (
                  <motion.span key={interest} whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-cyan-950/20 border border-cyan-900/20 text-cyan-300 cursor-default backdrop-blur-sm">
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ y: yParallax }} variants={fadeLeftVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Terminal className="text-blue-400" size={20} /></div>
              <span>Education</span>
            </h2>
            <div className="space-y-4">
              <motion.div whileHover={{ x: 4 }} className="relative pl-6 border-l-2 border-cyan-500/40">
                <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                <div className="glass-card-thin glow-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <h4 className="font-bold text-lg text-white">B.Tech Mechatronics</h4>
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-400/10">2024–2028</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">SRM Institute of Science and Technology</p>
                  <div className="text-sm font-mono text-cyan-300 font-semibold">CGPA: 9.51</div>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} className="relative pl-6 border-l-2 border-slate-700/60">
                <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-slate-500" />
                <div className="glass-card-thin glow-card rounded-xl p-5">
                  <h4 className="font-bold text-lg mb-1 text-white">Intermediate</h4>
                  <div className="text-sm font-mono text-slate-300">Score: 92.2%</div>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} className="relative pl-6 border-l-2 border-slate-700/60">
                <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-slate-500" />
                <div className="glass-card-thin glow-card rounded-xl p-5">
                  <h4 className="font-bold text-lg mb-1 text-white">Secondary</h4>
                  <div className="text-sm font-mono text-slate-300">Score: 93.5%</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
