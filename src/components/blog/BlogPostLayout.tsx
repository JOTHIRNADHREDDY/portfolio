import { MDXProvider } from '@mdx-js/react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const components = {
  h1: (props: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-12 mb-6 text-slate-100" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-8 mb-4 text-slate-200" {...props} />,
  p: (props: any) => <p className="text-slate-300 leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-6 text-slate-300 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-6 text-slate-300 space-y-2" {...props} />,
  a: (props: any) => <a className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-cyan-500 pl-4 py-1 italic text-slate-400 my-6 bg-cyan-500/5 rounded-r-lg" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto my-8" {...props} />
  ),
};

export function BlogPostLayout({ children, title, date, readingTime }: { children: React.ReactNode, title: string, date: string, readingTime: string }) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors mb-12">
          <ChevronLeft size={16} />
          <span>Back to Blog</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{title}</h1>
            <div className="flex items-center space-x-4 text-sm font-mono text-slate-500">
              <span className="text-cyan-400">{date}</span>
              <span>•</span>
              <span>{readingTime}</span>
            </div>
          </header>
          
          <article className="prose prose-invert max-w-none">
            <MDXProvider components={components}>
              {children}
            </MDXProvider>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
