import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, Terminal, ChevronRight, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  // Real-time countdown to December 4, 2026 08:00 COT
  const targetDate = new Date('2026-12-04T08:00:00-05:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-center overflow-hidden bg-java-espresso ide-grid-pattern">
      {/* Ambient background glows */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-[#f89820]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#00e676]/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#5382a1]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        {/* Floating IDE Code Snippet Header Accent */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#f89820]/25 bg-[#140e0a]/80 text-xs font-mono text-[#d68a2d] mb-6">
          <Terminal className="w-3.5 h-3.5 text-[#f89820]" />
          <span>package co.edu.uptc.javai.day2026;</span>
          <span className="text-[#00e676] font-semibold">// Live on JVM 25</span>
        </div>

        {/* 2-column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column 1: Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Unboxed Metadata Line with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#c4b5a5] mb-4">
              <span className="text-[#f89820] font-semibold">4 y 5 de Diciembre, 2026</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Auditorio Paraninfo UPTC</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Tunja, Boyacá</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="text-[#00e676]">Acceso Libre</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#fbf7f2] leading-[1.1] mb-6" style={{ textWrap: 'balance' }}>
              Donde la potencia de la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f89820] via-[#ffa94d] to-[#ffcb77]">
                JVM
              </span>{' '}
              impulsa la nueva era de la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e676] via-[#69f0ae] to-[#b9f6ca]">
                Inteligencia Artificial
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#d1c2b2] max-w-2xl leading-relaxed mb-8">
              Dos jornadas de inmersión técnica con Java Champions, arquitectos de sistemas de alta escala y líderes de investigación de la UPTC. Concurrencia masiva con Virtual Threads, orquestación de LLMs en Spring AI y LangChain4j para la industria colombiana.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3.5 text-sm font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-all duration-200 transform active:scale-95 shadow-lg shadow-[#f89820]/25 flex items-center gap-2 whitespace-nowrap"
              >
                <span>Asegurar Entrada Gratuita</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="#agenda"
                className="px-5 py-3.5 text-sm font-medium text-[#f4efe8] hover:text-[#f89820] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors whitespace-nowrap"
              >
                Explorar Agenda Técnica
              </a>
            </div>

            {/* Real-time Countdown Metric Strip */}
            <div className="w-full pt-6 border-t border-[#f89820]/15">
              <span className="text-xs uppercase tracking-wider text-[#a8998a] block mb-3 font-mono">
                Inicio del evento en Tunja:
              </span>
              <div className="grid grid-cols-4 gap-3 max-w-md">
                <div className="bg-[#120d0a]/90 border border-[#f89820]/20 rounded-lg p-2.5 text-center">
                  <span className="block text-2xl font-bold font-mono text-[#fbf7f2] tabular-nums">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#a8998a] uppercase tracking-wider">Días</span>
                </div>
                <div className="bg-[#120d0a]/90 border border-[#f89820]/20 rounded-lg p-2.5 text-center">
                  <span className="block text-2xl font-bold font-mono text-[#fbf7f2] tabular-nums">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#a8998a] uppercase tracking-wider">Horas</span>
                </div>
                <div className="bg-[#120d0a]/90 border border-[#f89820]/20 rounded-lg p-2.5 text-center">
                  <span className="block text-2xl font-bold font-mono text-[#fbf7f2] tabular-nums">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#a8998a] uppercase tracking-wider">Min</span>
                </div>
                <div className="bg-[#120d0a]/90 border border-[#f89820]/20 rounded-lg p-2.5 text-center">
                  <span className="block text-2xl font-bold font-mono text-[#00e676] tabular-nums">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#a8998a] uppercase tracking-wider">Seg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: IDE-Themed Hero Asset & Interactive Window */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-[#f89820]/30 bg-[#0e0a07] shadow-2xl overflow-hidden group">
              {/* IDE Top Window Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#17100b] border-b border-[#f89820]/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e3b341]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]" />
                  <span className="ml-2 text-xs font-mono text-[#a8998a]">JavaAIDayBoyaca.java</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#00e676]">JDK 25 · OK</span>
                </div>
              </div>

              {/* Auditorium Visual Showcase */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/src/assets/images/hero_java_ai_boyaca_1793162459332.jpg"
                  alt="Auditorio Paraninfo UPTC Tunja en el evento Java & AI Day"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a07] via-transparent to-black/20" />

                {/* Overlay Code Overlay Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0a0705]/90 backdrop-blur-md border border-[#f89820]/25 rounded-lg p-3 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#a8998a] text-[10px] mb-1">
                    <span>// Virtual Thread + LangChain4j Agent</span>
                    <span className="text-[#f89820]">Tunja, 2.810m</span>
                  </div>
                  <p className="text-[#f4efe8] truncate">
                    <span className="text-[#f89820]">var</span> agent = <span className="text-[#00e676]">JVM</span>.orchestrate(Gemini.flash());
                  </p>
                </div>
              </div>

              {/* IDE Bottom Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#0c0806] border-t border-white/5 text-[11px] font-mono text-[#8a7c6f]">
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>·</span>
                  <span>450 Cupos Paraninfo</span>
                </div>
                <span className="text-[#f89820]">Boyacá Tech Ecosystem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
