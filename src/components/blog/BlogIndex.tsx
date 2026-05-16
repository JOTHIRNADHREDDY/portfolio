import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { fadeUpVariant, staggerContainer } from '../../utils/animations';
import { BookOpen, ArrowRight, PenLine, Trash2, Tag, Search } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { useDataStore, type BlogPost } from '../../utils/DataStore';
import { AddBlogModal } from '../ui/AddBlogModal';
import { ReadingProgress } from '../ui/ReadingProgress';

export function BlogIndex() {
  const { isOwner } = useAuth();
  const { blogPosts, removeBlogPost } = useDataStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach(post => post.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [blogPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = blogPosts;
    if (activeTag) {
      result = result.filter(p => p.tags?.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [blogPosts, activeTag, searchQuery]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <ReadingProgress />
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono mb-6">
            <BookOpen size={14} />
            <span>Research & Teardowns</span>
          </motion.div>

          <div className="flex items-center gap-4 mb-6">
            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold text-white">
              Engineering <span className="text-blue-400">Logbook</span>
            </motion.h1>
            {/* Owner pencil button */}
            {isOwner && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-all shadow-lg shadow-blue-500/10"
                title="Add new blog post"
                aria-label="Add new blog post"
              >
                <PenLine size={16} />
                <span className="text-sm font-medium hidden sm:inline">New Post</span>
              </motion.button>
            )}
          </div>

          <motion.p variants={fadeUpVariant} className="text-slate-400 text-lg max-w-2xl mb-8">
            Detailed teardowns, architectural overviews, and research notes on autonomous systems and robotics.
          </motion.p>

          {/* Search & Tag Filter */}
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </motion.div>

          {/* Tags */}
          {allTags.length > 0 && (
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setActiveTag(null)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                  !activeTag ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/[0.03] text-slate-500 border border-white/[0.06] hover:bg-white/[0.06]'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                    activeTag === tag ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/[0.03] text-slate-500 border border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                >
                  <Tag size={10} />
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={fadeUpVariant}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="relative group">
                  {/* Owner delete button for custom posts */}
                  {isOwner && post.id.startsWith('custom-') && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => removeBlogPost(post.id)}
                      className="absolute top-4 right-4 z-20 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                      title="Remove post"
                      aria-label="Remove post"
                    >
                      <Trash2 size={12} />
                    </motion.button>
                  )}

                  {post.content ? (
                    // Custom blog post - link to dynamic route
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block glass-card hover:border-blue-500/30 rounded-2xl p-8 transition-all duration-300"
                    >
                      <BlogCardContent post={post} />
                    </Link>
                  ) : (
                    // Default MDX post
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block glass-card hover:border-blue-500/30 rounded-2xl p-8 transition-all duration-300"
                    >
                      <BlogCardContent post={post} />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-slate-500"
            >
              <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">No posts found</p>
              <p className="text-sm">Try adjusting your search or tags</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AddBlogModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

function BlogCardContent({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="flex items-center space-x-4 text-sm font-mono text-slate-500 mb-3">
          <span className="text-blue-400">{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
        <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
          {post.title}
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          {post.summary}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="hidden md:flex w-12 h-12 rounded-full bg-white/[0.04] items-center justify-center text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors shrink-0">
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
