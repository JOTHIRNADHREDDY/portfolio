import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, BookOpen } from 'lucide-react';
import { useDataStore } from '../../utils/DataStore';

interface AddBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tagSuggestions = [
  'Robotics', 'Computer Vision', 'Embedded Systems', 'AI/ML',
  'Agriculture', 'Control Systems', 'IoT', 'CAD', 'Research',
  'Electronics', 'Pneumatics', '3D Printing', 'Drones', 'ROS',
];

export function AddBlogModal({ isOpen, onClose }: AddBlogModalProps) {
  const { addBlogPost } = useDataStore();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: [] as string[],
    customTag: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addCustomTag = () => {
    if (formData.customTag.trim() && !formData.tags.includes(formData.customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.customTag.trim()],
        customTag: '',
      }));
    }
  };

  const handleSubmit = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const wordCount = formData.content.trim().split(/\s+/).length;
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    addBlogPost({
      slug,
      title: formData.title,
      date: dateStr,
      readingTime,
      summary: formData.summary,
      tags: formData.tags,
      content: formData.content,
    });

    setFormData({ title: '', summary: '', content: '', tags: [], customTag: '' });
    onClose();
  };

  const canSubmit = formData.title.trim() && formData.summary.trim() && formData.content.trim();

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm";
  const labelClass = "text-sm font-medium text-slate-400 mb-2 block";

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
            {/* Header gradient */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <BookOpen size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">New Blog Post</h3>
                    <p className="text-sm text-slate-500">Share your engineering insights</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Title *</label>
                  <input className={inputClass} value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="e.g., Deep Dive into PID Tuning for Robotics" />
                </div>

                <div>
                  <label className={labelClass}>Summary *</label>
                  <textarea className={`${inputClass} resize-none h-16`} value={formData.summary} onChange={e => updateField('summary', e.target.value)} placeholder="A brief description of the blog post..." />
                </div>

                <div>
                  <label className={labelClass}>Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagSuggestions.map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 text-xs rounded-lg transition-all ${formData.tags.includes(tag) ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/[0.03] text-slate-500 border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300'}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className={`${inputClass} flex-1`} value={formData.customTag} onChange={e => updateField('customTag', e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
                      placeholder="Custom tag..." />
                    <button onClick={addCustomTag} className="px-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Content * <span className="text-slate-600 font-normal">(Markdown supported)</span></label>
                  <textarea
                    className={`${inputClass} resize-none h-48 font-mono text-xs leading-relaxed`}
                    value={formData.content}
                    onChange={e => updateField('content', e.target.value)}
                    placeholder={`# Introduction\n\nStart writing your engineering blog post here...\n\n## Section 1\n\nUse **bold**, *italic*, and \`code\` formatting.\n\n- Bullet points work too\n- Share your insights`}
                  />
                  {formData.content && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{formData.content.trim().split(/\s+/).length} words</span>
                      <span>{Math.max(1, Math.ceil(formData.content.trim().split(/\s+/).length / 200))} min read</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end mt-8 pt-6 border-t border-white/[0.06]">
                <button onClick={handleSubmit} disabled={!canSubmit}
                  className="px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20">
                  Publish Post
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
