import { motion } from 'motion/react';
import { useAuth } from '../../utils/AuthContext';
import { Shield, LogOut } from 'lucide-react';

/**
 * Floating admin indicator that shows when the owner is authenticated.
 * Provides a quick logout button and visual indicator of admin mode.
 */
export function AdminIndicator() {
  const { isOwner, logout } = useAuth();

  if (!isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-xl shadow-lg">
        <div className="relative">
          <Shield size={14} className="text-cyan-400" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-mono text-cyan-300">Owner Mode</span>
        <button
          onClick={logout}
          className="ml-1 p-1 rounded-md hover:bg-white/[0.08] text-slate-400 hover:text-red-400 transition-all"
          title="Logout"
          aria-label="Logout from owner mode"
        >
          <LogOut size={12} />
        </button>
      </div>
    </motion.div>
  );
}
