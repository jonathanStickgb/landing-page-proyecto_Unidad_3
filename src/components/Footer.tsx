import React from 'react';
import { ArrowUp, Heart, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070503] border-t border-[#f89820]/15 py-12 text-[#a8998a] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-10 border-b border-white/5">
          {/* Brand & Mission */}
          <div className="md:col-span-5">
            <a
              href="#"
              className="text-lg font-bold text-[#fbf7f2] hover:text-[#f89820] transition-colors inline-block mb-3"
            >
              Java & AI Day Boyacá 2026
            </a>
            <p className="text-xs text-[#c4b5a5] leading-relaxed max-w-sm mb-4">
              Conferencia técnica organizada por la Universidad Pedagógica y Tecnológica de Colombia (UPTC), Boyacá Devs y la Comunidad Java Colombia.
            </p>
            <div className="text-[11px] font-mono text-[#8a7c6f]">
              Auditorio Paraninfo San Jerónimo · Sede Central UPTC · Tunja, Colombia
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-mono text-[#f89820] uppercase tracking-wider block mb-3 text-[11px]">
                Navegación
              </span>
              <ul className="space-y-2">
                <li>
                  <a href="#ponentes" className="hover:text-white transition-colors">
                    Ponentes
                  </a>
                </li>
                <li>
                  <a href="#ejes" className="hover:text-white transition-colors">
                    Ejes Temáticos
                  </a>
                </li>
                <li>
                  <a href="#agenda" className="hover:text-white transition-colors">
                    Agenda Oficial
                  </a>
                </li>
                <li>
                  <a href="#alianzas" className="hover:text-white transition-colors">
                    Organizan y Apoyan
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-mono text-[#00e676] uppercase tracking-wider block mb-3 text-[11px]">
                Comunidades
              </span>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.uptc.edu.co" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    UPTC Ingeniería
                  </a>
                </li>
                <li>
                  <a href="https://boyacadevs.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    Boyacá Devs
                  </a>
                </li>
                <li>
                  <a href="https://jugcolombia.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    JUG Colombia
                  </a>
                </li>
                <li>
                  <a href="#sede" className="hover:text-white transition-colors">
                    Cómo Llegar
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Back to Top */}
          <div className="md:col-span-3 flex md:justify-end">
            <button
              onClick={scrollToTop}
              className="p-3 rounded-lg bg-[#140e0a] border border-white/10 hover:border-[#f89820] hover:text-[#f89820] transition-colors flex items-center gap-2 text-xs font-mono"
              aria-label="Volver arriba"
            >
              <span>Volver Arriba</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a7c6f]">
          <div>
            © 2026 Java & AI Day Boyacá · Conferencia Académica sin ánimo de lucro.
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Desarrollado para la comunidad tech de Boyacá</span>
            <span>·</span>
            <span className="text-[#f89820]">Tunja 2.810m</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
