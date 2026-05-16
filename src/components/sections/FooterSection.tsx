import { motion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, Heart } from 'lucide-react';
import { staggerContainer, fadeUpVariant } from '../../utils/animations';
import { useLenis } from 'lenis/react';

export function FooterSection() {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="relative z-10 border-t border-white/[0.04] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div variants={fadeUpVariant} className="glass-card p-6 rounded-2xl border-white/[0.06]">
              <h2 className="text-2xl font-bold mb-4">
                Let's <span className="gradient-text">Talk.</span>
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Open to Robotics Internships, Jobs, Entrepreneurship, and Advanced Engineering Projects.
              </p>
              
              <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                    <input type="text" id="name" name="name" required className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                    <input type="email" id="email" name="email" required className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                  <textarea id="message" name="message" required rows={3} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none" placeholder="Hello, I'd like to discuss a robotics project..."></textarea>
                </div>
                <button type="submit" className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-[0.98]">
                  <span>Send Message</span>
                  <ArrowUpRight size={16} />
                </button>
              </form>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="space-y-5">
              <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-4 text-slate-300">
                <div className="w-12 h-12 rounded-xl glass-card-thin flex items-center justify-center">
                  <Mail size={20} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</div>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=p.jothirnadhreddy@gmail.com&su=Contact%20from%20Portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors font-medium"
                  >
                    p.jothirnadhreddy@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} className="flex items-center space-x-4 text-slate-300">
                <div className="w-12 h-12 rounded-xl glass-card-thin flex items-center justify-center">
                  <MapPin size={20} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Location</div>
                  <div className="font-medium">Ongole, Andhra Pradesh, India</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04] text-sm text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} PERAM JOTHIRNADH REDDY. Built with
            <Heart size={14} className="text-red-400 inline" />
          </p>

          <div className="flex items-center space-x-6">
            <a href="https://github.com/JOTHIRNADHREDDY" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Github size={16} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/jothirnadhreddy-peram-204025311/" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>

          {/* Back to top */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all text-xs font-mono"
            aria-label="Scroll back to top"
          >
            ↑ Back to Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
