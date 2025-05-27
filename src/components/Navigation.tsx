"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Menu, X, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  // Helper function to create navigation links
  const createNavLink = (section: string, label: string) => {
    if (pathname === '/') {
      // If on home page, use anchor link
      return (
        <a href={`#${section}`} className="text-foreground hover:text-gold transition-colors">
          {label}
        </a>
      );
    } else {
      // If on other pages, navigate to home page with section
      return (
        <Link href={`/#${section}`} className="text-foreground hover:text-gold transition-colors">
          {label}
        </Link>
      );
    }
  };

  const createMobileNavLink = (section: string, label: string) => {
    if (pathname === '/') {
      // If on home page, use anchor link
      return (
        <a 
          href={`#${section}`}
          className="text-foreground hover:text-gold transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          {label}
        </a>
      );
    } else {
      // If on other pages, navigate to home page with section
      return (
        <Link 
          href={`/#${section}`}
          className="text-foreground hover:text-gold transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          {label}
        </Link>
      );
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Scale className="h-8 w-8 text-gold" />
                <span className="text-2xl font-bold text-gradient">JuridX</span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              {createNavLink("services", "Services")}
              {createNavLink("about", "À Propos")}
              <Link href="/blog" className="text-foreground hover:text-gold transition-colors">
                Blog
              </Link>
              {createNavLink("testimonials", "Témoignages")}
              {createNavLink("contact", "Contact")}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Bonjour, {user?.name || user?.email}
                  </span>
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-outline-gold"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-outline-gold"
                      onClick={() => window.open('/admin', '_blank')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="btn-outline-gold"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAuthClick('login')}
                    className="btn-outline-gold"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                  <Button 
                    onClick={() => handleAuthClick('register')}
                    className="btn-gold"
                  >
                    Inscription
                  </Button>
                </div>
              )}
              
              <Link href="/consultation">
                <Button className="btn-gold">
                  Consultation Gratuite
                </Button>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-border"
            >
              <div className="flex flex-col space-y-4 pt-4">
                {createMobileNavLink("services", "Services")}
                {createMobileNavLink("about", "À Propos")}
                <Link 
                  href="/blog" 
                  className="text-foreground hover:text-gold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                {createMobileNavLink("testimonials", "Témoignages")}
                {createMobileNavLink("contact", "Contact")}
                
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      Connecté en tant que {user?.name || user?.email}
                    </span>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        size="sm"
                        className="btn-outline-gold w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Mon Profil
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="btn-outline-gold w-full"
                        onClick={() => {
                          window.open('/admin', '_blank');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="btn-outline-gold w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleAuthClick('login');
                        setIsMenuOpen(false);
                      }}
                      className="btn-outline-gold w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Connexion
                    </Button>
                    <Button 
                      onClick={() => {
                        handleAuthClick('register');
                        setIsMenuOpen(false);
                      }}
                      className="btn-gold w-full"
                    >
                      Inscription
                    </Button>
                  </div>
                )}
                
                <Link href="/consultation">
                  <Button 
                    className="btn-gold w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Consultation Gratuite
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
} 