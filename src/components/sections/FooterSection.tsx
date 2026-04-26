import { motion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, Heart } from 'lucide-react';
import { staggerContainer, fadeUpVariant } from '../../utils/animations';

export function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <motion.div variants={fadeUpVariant}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Build the <span className="gradient-text">Future.</span>
              </h2>
              <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                Open to Robotics Internships, Jobs, Entrepreneurship, Research Collaborations, and Advanced Engineering Projects.
              </p>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="https://mail.google.com/mail/?view=cm&fs=1&to=p.jothirnadhreddy@gmail.com&su=Contact%20from%20Portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
              >
                <Mail size={18} />
                <span>Get in Touch</span>
                <ArrowUpRight size={16} />
              </motion.a>
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
            © {new Date().getFullYear()} Peram Jothirnadh Reddy. Built with
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
