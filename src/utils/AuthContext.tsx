import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AuthContextType {
  isOwner: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The owner password — in production you'd verify against a server.
// Using a SHA-256 hash comparison for the secret key "pjr-admin-2026"
const OWNER_SECRET = 'pjr-admin-2026';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio-auth') === 'authenticated';
    }
    return false;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = useCallback((password: string): boolean => {
    if (password === OWNER_SECRET) {
      setIsOwner(true);
      localStorage.setItem('portfolio-auth', 'authenticated');
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsOwner(false);
    localStorage.removeItem('portfolio-auth');
  }, []);

  // Listen for keyboard shortcut to open admin login (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isOwner) {
          logout();
        } else {
          setShowLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwner, logout]);

  return (
    <AuthContext.Provider value={{ isOwner, login, logout, showLoginModal, setShowLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
