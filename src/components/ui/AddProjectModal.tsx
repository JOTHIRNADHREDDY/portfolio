import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Sparkles } from 'lucide-react';
import { useDataStore } from '../../utils/DataStore';

const themeOptions = [
  { value: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'amber', label: 'Amber', color: 'bg-amber-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
];

const categoryOptions = ['Hardware', 'AI', 'Software', 'Research'];

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { addProject } = useDataStore();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hardware',
    problem: '',
    longProblem: '',
    approach: '',
    learning: '',
    techInput: '',
    tech: [] as string[],
    github: '',
    metricInput: '',
    metricTags: [] as string[],
    theme: 'emerald',
    videoDemo: '',
    datasheets: [{ name: '', link: '' }],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTech = () => {
    if (formData.techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tech: [...prev.tech, prev.techInput.trim()],
        techInput: '',
      }));
    }
  };

  const removeTech = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter((_, i) => i !== idx),
    }));
  };

  const addMetric = () => {
    if (formData.metricInput.trim()) {
      setFormData(prev => ({
        ...prev,
        metricTags: [...prev.metricTags, prev.metricInput.trim()],
        metricInput: '',
      }));
    }
  };

  const removeMetric = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      metricTags: prev.metricTags.filter((_, i) => i !== idx),
    }));
  };

  const addDatasheet = () => {
    setFormData(prev => ({
      ...prev,
      datasheets: [...prev.datasheets, { name: '', link: '' }],
    }));
  };

  const updateDatasheet = (idx: number, field: 'name' | 'link', value: string) => {
    setFormData(prev => ({
      ...prev,
      datasheets: prev.datasheets.map((ds, i) => i === idx ? { ...ds, [field]: value } : ds),
    }));
  };

  const removeDatasheet = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      datasheets: prev.datasheets.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = () => {
    addProject({
      title: formData.title,
      problem: formData.problem,
      longProblem: formData.longProblem,
      approach: formData.approach,
      learning: formData.learning,
      tech: formData.tech,
      github: formData.github || '#',
      metrics: formData.metricTags.reduce((acc, tag) => ({ ...acc, [tag]: 0 }), {} as Record<string, number>),
      theme: formData.theme,
      datasheets: formData.datasheets.filter(ds => ds.name.trim()),
      videoDemo: formData.videoDemo || '',
      category: formData.category,
    });

    setFormData({
      title: '', category: 'Hardware', problem: '', longProblem: '',
      approach: '', learning: '', techInput: '', tech: [], github: '',
      metricInput: '', metricTags: [], theme: 'emerald',
      videoDemo: '', datasheets: [{ name: '', link: '' }],
    });
    setStep(1);
    onClose();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm";
  const labelClass = "text-sm font-medium text-slate-400 mb-2 block";

  const canProceedStep1 = formData.title.trim() && formData.problem.trim();
  const canProceedStep2 = formData.approach.trim() && formData.tech.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div className="h-1 bg-slate-800 rounded-t-2xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Add Project</h3>
                    <p className="text-sm text-slate-500">Step {step} of {totalSteps}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div>
                      <label className={labelClass}>Project Title *</label>
                      <input className={inputClass} value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="e.g., Autonomous Drone Navigation System" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Category *</label>
                        <div className="flex flex-wrap gap-2">
                          {categoryOptions.map(cat => (
                            <button key={cat} onClick={() => updateField('category', cat)}
                              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${formData.category === cat ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Theme Color</label>
                        <div className="flex gap-2">
                          {themeOptions.map(t => (
                            <button key={t.value} onClick={() => updateField('theme', t.value)}
                              className={`w-8 h-8 rounded-full ${t.color} transition-all ${formData.theme === t.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-60 hover:opacity-100'}`}
                              title={t.label} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Short Problem Statement *</label>
                      <input className={inputClass} value={formData.problem} onChange={e => updateField('problem', e.target.value)} placeholder="One-line problem description..." />
                    </div>

                    <div>
                      <label className={labelClass}>Detailed Problem</label>
                      <textarea className={`${inputClass} resize-none h-24`} value={formData.longProblem} onChange={e => updateField('longProblem', e.target.value)} placeholder="Elaborate on the problem..." />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Technical Details */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div>
                      <label className={labelClass}>Approach *</label>
                      <textarea className={`${inputClass} resize-none h-20`} value={formData.approach} onChange={e => updateField('approach', e.target.value)} placeholder="Describe your solution approach..." />
                    </div>

                    <div>
                      <label className={labelClass}>Learning Outcomes</label>
                      <textarea className={`${inputClass} resize-none h-20`} value={formData.learning} onChange={e => updateField('learning', e.target.value)} placeholder="Key takeaways and skills gained..." />
                    </div>

                    <div>
                      <label className={labelClass}>Technologies *</label>
                      <div className="flex gap-2 mb-2">
                        <input className={`${inputClass} flex-1`} value={formData.techInput} onChange={e => updateField('techInput', e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                          placeholder="Type and press Enter..." />
                        <button onClick={addTech} className="px-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all">
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tech.map((t, i) => (
                          <span key={i} className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                            {t}
                            <button onClick={() => removeTech(i)} className="text-slate-500 hover:text-red-400 transition-colors"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>GitHub URL</label>
                      <input className={inputClass} value={formData.github} onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Metrics & Extras */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div>
                      <label className={labelClass}>Performance Metrics (Tags)</label>
                      <div className="flex gap-2 mb-2">
                        <input className={`${inputClass} flex-1`} value={formData.metricInput} onChange={e => updateField('metricInput', e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMetric(); } }}
                          placeholder="e.g., Accuracy, Efficiency... Type and press Enter" />
                        <button onClick={addMetric} className="px-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all">
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.metricTags.map((m, i) => (
                          <span key={i} className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 capitalize">
                            {m}
                            <button onClick={() => removeMetric(i)} className="text-cyan-500/50 hover:text-red-400 transition-colors"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className={labelClass}>Component Datasheets</label>
                        <button onClick={addDatasheet} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                          <Plus size={12} /> Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.datasheets.map((ds, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input className={`${inputClass} flex-1`} value={ds.name} onChange={e => updateDatasheet(i, 'name', e.target.value)} placeholder="Component name" />
                            <input className={`${inputClass} flex-1`} value={ds.link} onChange={e => updateDatasheet(i, 'link', e.target.value)} 
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDatasheet(); } }}
                              placeholder="Datasheet URL" />
                            {formData.datasheets.length > 1 && (
                              <button onClick={() => removeDatasheet(i)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                <Minus size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Video Demo URL</label>
                      <input className={inputClass} value={formData.videoDemo} onChange={e => updateField('videoDemo', e.target.value)} placeholder="https://..." />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'}`}
                >
                  Back
                </button>

                {/* Step dots */}
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i + 1 === step ? 'bg-cyan-400 w-6' : i + 1 < step ? 'bg-cyan-600' : 'bg-slate-700'}`} />
                  ))}
                </div>

                {step < totalSteps ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 ? !canProceedStep1 : step === 2 ? !canProceedStep2 : false}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-cyan-500 hover:to-blue-500 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button onClick={handleSubmit}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-lg shadow-emerald-500/20">
                    Add Project
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
