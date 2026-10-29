import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Ponentes', href: '#ponentes' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Organizan y Apoyan', href: '#alianzas' },
    { label: 'Gestión Administrador', href: '#gestion-administrador' },
    { label: 'Sede UPTC', href: '#sede' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0705]/90 backdrop-blur-md border-b border-[#f89820]/15 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-[#f4efe8] hover:text-[#f89820] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-[#f89820]">&lt;</span>
          <span>Java & AI Day Boyacá 2026</span>
          <span className="text-[#00e676]">/&gt;</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#d1c7bd]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#f89820] transition-colors whitespace-nowrap shrink-0 relative py-1 text-xs tracking-wider uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-all transform active:scale-95 whitespace-nowrap shrink-0 shadow-sm shadow-[#f89820]/30"
          >
            Obtener Entrada
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#d1c7bd] hover:text-[#f89820] transition-colors focus:outline-none"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0a07] border-b border-[#f89820]/20 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#d1c7bd] hover:text-[#f89820] transition-colors py-1.5"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-2.5 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg text-center"
              >
                Obtener Entrada Gratuita
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
