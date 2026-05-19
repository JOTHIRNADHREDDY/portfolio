import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, Heart, Download } from 'lucide-react';
import { staggerContainer, fadeUpVariant } from '../../utils/animations';
import { useLenis } from 'lenis/react';
import { RESUME_PDF_URL } from '../../utils/DataStore';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function FooterSection() {
  const lenis = useLenis();
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <footer id="contact" className="relative z-10 border-t border-white/[0.04] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <motion.div variants={fadeUpVariant} className="mb-10 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Let&apos;s <span className="gradient-text">Talk.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
              Open to robotics internships, engineering collaborations, and embedded AI projects in autonomous systems, precision agriculture, and intelligent hardware.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3 mb-12">
            <a
              href="mailto:p.jothirnadhreddy@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-sm"
            >
              <Mail size={16} className="text-cyan-400" />
              Email
            </a>
            <a
              href="https://github.com/JOTHIRNADHREDDY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-sm"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-sm"
            >
              <Linkedin size={16} className="text-blue-400" />
              LinkedIn
            </a>
            <a
              href={RESUME_PDF_URL}
              download="PERAM_JOTHIRNADH_REDDY_Resume.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all text-sm font-medium"
            >
              <Download size={16} />
              Download Resume
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-resume'))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-sm"
            >
              Preview CV
            </button>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div className="glass-card p-6 rounded-2xl border-white/[0.06] text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Send a message</h3>
              <form
                action="https://formspree.io/f/YOUR_FORM_ID"
                method="POST"
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="Your name"
                    />
                  </motion.div>
                  <motion.div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="you@email.com"
                    />
                  </motion.div>
                </motion.div>
                <motion.div>
                  <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    placeholder="Hello, I'd like to discuss a robotics project..."
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-60"
                >
                  <span>{formStatus === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  <ArrowUpRight size={16} />
                </motion.button>
                {formStatus === 'success' && (
                  <p className="text-sm text-emerald-400" role="status">
                    Message sent — thank you! I&apos;ll get back to you soon.
                  </p>
                )}
                {formStatus === 'error' && (
                  <p className="text-sm text-red-400" role="alert">
                    Something went wrong. Please email me directly at p.jothirnadhreddy@gmail.com.
                  </p>
                )}
              </form>
            </motion.div>

            <motion.div className="space-y-5 text-left">
              <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-4 text-slate-300">
                <motion.div className="w-12 h-12 rounded-xl glass-card-thin flex items-center justify-center" whileHover={{ rotate: 5 }}>
                  <Mail size={20} className="text-cyan-400" />
                </motion.div>
                <motion.div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                  <a href="mailto:p.jothirnadhreddy@gmail.com" className="hover:text-cyan-400 transition-colors font-medium">
                    p.jothirnadhreddy@gmail.com
                  </a>
                </motion.div>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-4 text-slate-300">
                <motion.div className="w-12 h-12 rounded-xl glass-card-thin flex items-center justify-center" whileHover={{ rotate: -5 }}>
                  <MapPin size={20} className="text-emerald-400" />
                </motion.div>
                <motion.div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="font-medium">Ongole, Andhra Pradesh, India</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04] text-sm text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} PERAM JOTHIRNADH REDDY. Built with
            <Heart size={14} className="text-red-400 inline" />
          </p>
          <motion.div className="flex items-center flex-wrap justify-center gap-4 md:gap-6">
            <a href="https://github.com/JOTHIRNADHREDDY" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Github size={16} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={RESUME_PDF_URL} download className="hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Download size={16} /> Resume
            </a>
          </motion.div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all text-xs font-mono"
            aria-label="Scroll back to top"
          >
            ↑ Back to Top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
