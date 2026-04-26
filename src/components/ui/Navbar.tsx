import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useLenis } from 'lenis/react';

interface NavItem {
  id: string;
  label: string;
  isRoute?: boolean;
  path?: string;
}

const navItems: NavItem[] = [
  { id: 'space', label: 'About' },
  { id: 'defence', label: 'Projects' },
  { id: 'environment', label: 'Skills' },
  { id: 'blog', label: 'Blog', isRoute: true, path: '/blog' },
  { id: 'contact', label: 'Contact' },
];

interface NavbarProps {
  activeSection: string;
}

/**
 * Sticky navigation bar with mobile hamburger menu,
 * glassmorphism effect, and active section highlighting.
 */
export function Navbar({ activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false);
    
    if (item.isRoute) {
      navigate(item.path!);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      // Give it a tiny delay to render the home page before scrolling
      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(`#${item.id}`);
        } else {
          const el = document.getElementById(item.id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (lenis) {
        lenis.scrollTo(`#${item.id}`);
      } else {
        const el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getActiveColor = (id: string) => {
    switch (id) {
      case 'space': return 'text-cyan-400';
      case 'defence': return 'text-green-400';
      case 'environment': return 'text-emerald-400';
      case 'contact': return 'text-white';
      default: return 'text-white';
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/70 backdrop-blur-2xl border-b border-white/[0.04] shadow-lg shadow-black/10'
            : 'bg-transparent border-b border-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#space"
            onClick={(e) => { e.preventDefault(); handleNavClick(navItems[0]); }}
            className="font-mono font-bold text-lg tracking-tighter group"
            aria-label="Go to top"
          >
            <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">PJR</span>
            <span className="text-slate-300 group-hover:text-white transition-colors">.ROBOTICS</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? `${getActiveColor(item.id)}`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-current rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}

            {/* Status indicator */}
            <div className="ml-4 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-emerald-400 rounded-full" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs text-emerald-400 font-mono">Open to Work</span>
            </div>

            {/* Command palette trigger */}
            <button
              onClick={() => { const evt = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }); window.dispatchEvent(evt); }}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all text-xs font-mono"
              title="Search (Ctrl+K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <kbd className="text-[10px] text-slate-600">⌘K</kbd>
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[39] bg-slate-950/95 backdrop-blur-xl md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                  className={`text-2xl font-medium transition-colors ${
                    activeSection === item.id
                      ? getActiveColor(item.id)
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full" />
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-sm text-emerald-400 font-mono">Open to Work</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
