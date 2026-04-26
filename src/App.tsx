import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import RobotScene from './components/RobotScene';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { FooterSection } from './components/sections/FooterSection';
import { CustomCursor } from './components/ui/CustomCursor';
import { ParticleField } from './components/ui/ParticleField';
import { Navbar } from './components/ui/Navbar';
import { BlogIndex } from './components/blog/BlogIndex';
import { DynamicBlogPost } from './components/blog/DynamicBlogPost';
import { LoginModal } from './components/ui/LoginModal';
import { CommandPalette } from './components/ui/CommandPalette';
import { ScrollToTopFab } from './components/ui/ScrollToTopFab';
import { AdminIndicator } from './components/ui/AdminIndicator';
import WeedDetectionPost from './blog/weed-detection-robot.mdx';

function Home({ activeSection }: { activeSection: string }) {
  return (
    <>
      <RobotScene activeSection={activeSection} />
      <main>
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <FooterSection />
      </main>
    </>
  );
}

/** Animated page transition wrapper */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState('space');
  const location = useLocation();

  const handleScroll = useCallback(() => {
    if (location.pathname !== '/') return;

    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 100) {
      setActiveSection('contact');
      return;
    }

    const sections = ['space', 'defence', 'environment', 'contact'];
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans noise-overlay transition-colors duration-500">
      <CustomCursor />
      <ParticleField />

      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 origin-left z-[1000]"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <Navbar activeSection={activeSection} />

      {/* Global UI overlays */}
      <LoginModal />
      <CommandPalette />
      <ScrollToTopFab />
      <AdminIndicator />

      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<Home activeSection={activeSection} />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/weed-detection-robot" element={<WeedDetectionPost />} />
          <Route path="/blog/:slug" element={<DynamicBlogPost />} />
        </Routes>
      </PageTransition>
    </div>
  );
}
