import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText } from 'lucide-react';

export function ResumeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const resumeUrl = "/resume.pdf"; // Path to resume in the public folder

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900 border border-white/[0.08] rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">PERAM JOTHIRNADH REDDY</h3>
                  <p className="text-xs text-slate-400">Curriculum Vitae</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href={resumeUrl}
                  download="PERAM_JOTHIRNADH_REDDY_Resume.pdf"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 hover:text-white transition-all text-sm font-medium"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body - PDF Viewer */}
            <div className="flex-1 bg-slate-950/50 p-4">
              <div className="w-full h-full rounded-xl overflow-hidden border border-white/[0.04] bg-slate-900 relative">
                <iframe 
                  src={`${resumeUrl}#toolbar=0`} 
                  className="w-full h-full absolute inset-0"
                  title="Resume PDF Viewer"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
