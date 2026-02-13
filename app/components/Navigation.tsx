"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  }, []);

  return (
    <>
      {/* Main Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("hero")}
            className="hover:opacity-80 transition-opacity"
            aria-label="Go to top"
          >
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#3b82f6"/>
                  <stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
                <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Dashed orbits */}
              <ellipse cx="32" cy="32" rx="28" ry="10" stroke="url(#logo-grad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" transform="rotate(-35 32 32)"/>
              <ellipse cx="32" cy="32" rx="28" ry="10" stroke="url(#logo-grad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" transform="rotate(35 32 32)"/>
              {/* Nucleus ring with P */}
              <circle cx="32" cy="32" r="13" stroke="url(#logo-grad)" strokeWidth="2.5" fill="none" filter="url(#logo-glow)"/>
              <text x="32" y="39" textAnchor="middle" fontFamily="ui-sans-serif,system-ui" fontSize="18" fontWeight="800" fill="url(#logo-grad)">P</text>
              {/* Electrons */}
              <circle cx="54" cy="18" r="3" fill="#06b6d4" filter="url(#logo-glow)"/>
              <circle cx="10" cy="46" r="2" fill="#8b5cf6" opacity="0.7"/>
            </svg>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {sections.slice(1).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === id
                    ? "text-accent-blue-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-light/50"
                }`}
              >
                {label}
                {activeSection === id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent-blue rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {sections.slice(1).map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      activeSection === id
                        ? "text-accent-blue-light bg-accent-blue/5"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-light/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Side section indicators */}
      <div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
        aria-label="Section indicators"
      >
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${label}`}
          >
            <span className="absolute right-5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 text-xs text-text-secondary bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap border border-border/50">
              {label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeSection === id
                  ? "w-3 h-3 bg-accent-blue shadow-glow"
                  : "w-2 h-2 bg-border-light hover:bg-text-muted hover:scale-125"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={() => scrollTo("hero")}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-surface/80 backdrop-blur-sm border border-border/50 hover:border-accent-blue/40 hover:shadow-glow transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 16V4M10 4l-6 6M10 4l6 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
