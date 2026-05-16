import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, User, FolderOpen, Wrench, Mail, BookOpen, Sun, Moon, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../utils/ThemeContext';
import { useDataStore } from '../../utils/DataStore';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { projects, blogPosts } = useDataStore();

  // Build command list
  const commands: CommandItem[] = useMemo(() => {
    const navCommands: CommandItem[] = [
      { id: 'nav-about', label: 'Go to About', description: 'View about section', icon: <User size={16} />, action: () => { navigate('/'); setTimeout(() => document.getElementById('space')?.scrollIntoView({ behavior: 'smooth' }), 100); }, category: 'Navigation' },
      { id: 'nav-projects', label: 'Go to Projects', description: 'View all projects', icon: <FolderOpen size={16} />, action: () => { navigate('/'); setTimeout(() => document.getElementById('defence')?.scrollIntoView({ behavior: 'smooth' }), 100); }, category: 'Navigation' },
      { id: 'nav-skills', label: 'Go to Skills', description: 'View technical skills', icon: <Wrench size={16} />, action: () => { navigate('/'); setTimeout(() => document.getElementById('environment')?.scrollIntoView({ behavior: 'smooth' }), 100); }, category: 'Navigation' },
      { id: 'nav-contact', label: 'Go to Contact', description: 'Get in touch', icon: <Mail size={16} />, action: () => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }, category: 'Navigation' },
      { id: 'nav-blog', label: 'Go to Blog', description: 'Engineering logbook', icon: <BookOpen size={16} />, action: () => navigate('/blog'), category: 'Navigation' },
    ];

    const actionCommands: CommandItem[] = [
      { id: 'toggle-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, description: 'Toggle theme', icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, action: toggleTheme, category: 'Actions' },
      { id: 'github', label: 'Open GitHub', description: 'JOTHIRNADHREDDY', icon: <ExternalLink size={16} />, action: () => window.open('https://github.com/JOTHIRNADHREDDY', '_blank'), category: 'Actions' },
      { id: 'linkedin', label: 'Open LinkedIn', description: 'Professional network', icon: <ExternalLink size={16} />, action: () => window.open('https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/', '_blank'), category: 'Actions' },
    ];

    const projectCommands: CommandItem[] = projects.map(p => ({
      id: `project-${p.id}`,
      label: p.title,
      description: p.category + ' · ' + p.tech.slice(0, 2).join(', '),
      icon: <FolderOpen size={16} />,
      action: () => { navigate('/'); setTimeout(() => document.getElementById('defence')?.scrollIntoView({ behavior: 'smooth' }), 100); },
      category: 'Projects',
    }));

    const blogCommands: CommandItem[] = blogPosts.map(b => ({
      id: `blog-${b.id}`,
      label: b.title,
      description: b.date,
      icon: <BookOpen size={16} />,
      action: () => navigate(`/blog/${b.slug}`),
      category: 'Blog Posts',
    }));

    return [...navCommands, ...actionCommands, ...projectCommands, ...blogCommands];
  }, [navigate, theme, toggleTheme, projects, blogPosts]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [filteredCommands.length]);

  const handleKeyNav = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIdx]) {
      e.preventDefault();
      filteredCommands[selectedIdx].action();
      setIsOpen(false);
    }
  }, [filteredCommands, selectedIdx]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  let runningIdx = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-slate-900/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl shadow-black/40 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center px-5 border-b border-white/[0.06]">
              <Search size={18} className="text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyNav}
                placeholder="Search commands, projects, blog posts..."
                className="flex-1 bg-transparent px-3 py-4 text-white placeholder-slate-500 focus:outline-none text-sm"
              />
              <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-white/[0.04] border border-white/[0.08] rounded-md">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filteredCommands.length === 0 ? (
                <div className="px-5 py-8 text-center text-slate-500 text-sm">
                  No results for "{query}"
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category}>
                    <div className="px-5 py-1.5 text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                      {category}
                    </div>
                    {cmds.map(cmd => {
                      const idx = runningIdx++;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => { cmd.action(); setIsOpen(false); }}
                          onMouseEnter={() => setSelectedIdx(idx)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                            idx === selectedIdx ? 'bg-cyan-500/10 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            idx === selectedIdx ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.04] text-slate-500'
                          }`}>
                            {cmd.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{cmd.label}</div>
                            <div className="text-xs text-slate-500 truncate">{cmd.description}</div>
                          </div>
                          {idx === selectedIdx && (
                            <ArrowRight size={14} className="text-cyan-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.06] text-[10px] text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 font-mono bg-white/[0.04] border border-white/[0.08] rounded">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 font-mono bg-white/[0.04] border border-white/[0.08] rounded">↵</kbd>
                  Select
                </span>
              </div>
              <span className="font-mono">⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
