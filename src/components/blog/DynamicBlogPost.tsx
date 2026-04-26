import { motion } from 'motion/react';
import { ChevronLeft, Clock, Calendar, Tag } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useDataStore } from '../../utils/DataStore';
import { ReadingProgress } from '../ui/ReadingProgress';

/**
 * Renders custom (non-MDX) blog posts from the DataStore.
 * Supports basic markdown-like formatting: headers, bold, italic, code, lists, blockquotes.
 */
export function DynamicBlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useDataStore();

  const post = blogPosts.find(p => p.slug === slug);

  // If it's a default post without content, redirect won't apply since MDX route handles it
  if (!post || !post.content) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <ReadingProgress />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-slate-500 mb-4">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Calendar size={14} />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <article className="prose prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </article>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Simple markdown renderer that converts basic markdown to React elements.
 */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-2xl font-semibold mt-8 mb-4 text-slate-200">
          {formatInlineMarkdown(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-3xl font-bold mt-12 mb-6 text-slate-100">
          {formatInlineMarkdown(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-4xl md:text-5xl font-bold mb-8 text-white">
          {formatInlineMarkdown(line.slice(2))}
        </h1>
      );
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${i}`} className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto my-8">
          <code className="text-cyan-300 font-mono text-sm">{codeLines.join('\n')}</code>
        </pre>
      );
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-cyan-500 pl-4 py-1 italic text-slate-400 my-6 bg-cyan-500/5 rounded-r-lg">
          {formatInlineMarkdown(line.slice(2))}
        </blockquote>
      );
    }
    // Unordered list items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 mb-6 text-slate-300 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx}>{formatInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      continue;
    }
    // Ordered list items
    else if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-6 mb-6 text-slate-300 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx}>{formatInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      continue;
    }
    // Empty line
    else if (line.trim() === '') {
      // skip
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={i} className="text-slate-300 leading-relaxed mb-6">
          {formatInlineMarkdown(line)}
        </p>
      );
    }

    i++;
  }

  return <>{elements}</>;
}

/**
 * Formats inline markdown: bold, italic, inline code, and links.
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  // Split by inline patterns and build nodes
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic: *text*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Find earliest match
    const matches = [
      { match: boldMatch, type: 'bold' as const },
      { match: italicMatch, type: 'italic' as const },
      { match: codeMatch, type: 'code' as const },
      { match: linkMatch, type: 'link' as const },
    ].filter(m => m.match !== null).sort((a, b) => (a.match!.index || 0) - (b.match!.index || 0));

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0];
    const idx = earliest.match!.index || 0;

    // Text before the match
    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }

    if (earliest.type === 'bold') {
      parts.push(<strong key={`b-${keyIdx++}`} className="text-white font-semibold">{earliest.match![1]}</strong>);
      remaining = remaining.slice(idx + earliest.match![0].length);
    } else if (earliest.type === 'italic') {
      parts.push(<em key={`i-${keyIdx++}`} className="text-slate-200">{earliest.match![1]}</em>);
      remaining = remaining.slice(idx + earliest.match![0].length);
    } else if (earliest.type === 'code') {
      parts.push(
        <code key={`c-${keyIdx++}`} className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm">
          {earliest.match![1]}
        </code>
      );
      remaining = remaining.slice(idx + earliest.match![0].length);
    } else if (earliest.type === 'link') {
      parts.push(
        <a key={`a-${keyIdx++}`} href={earliest.match![2]} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          {earliest.match![1]}
        </a>
      );
      remaining = remaining.slice(idx + earliest.match![0].length);
    }
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}
