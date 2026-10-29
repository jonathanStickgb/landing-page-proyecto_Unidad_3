import React, { useState } from 'react';
import { Speaker } from '../types';
import { SPEAKERS } from '../data/conferenceData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Terminal, Code, ArrowUpRight, User, Sparkles } from 'lucide-react';

interface SpeakersSectionProps {
  onSelectSpeaker: (speaker: Speaker) => void;
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ onSelectSpeaker }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'java' | 'ai' | 'cloud'>('all');

  const filteredSpeakers = activeFilter === 'all'
    ? SPEAKERS
    : SPEAKERS.filter((s) => s.track === activeFilter);

  // Hook connecting native IntersectionObserver to .reveal-card elements
  useScrollReveal([filteredSpeakers, activeFilter], {
    threshold: 0.12,
    staggerMs: 120
  });

  return (
    <section id="ponentes" className="py-24 bg-[#0a0705] relative overflow-hidden ide-dots-pattern">
      {/* Background glow */}
      <div
        className="absolute top-1/3 -right-24 w-80 h-80 bg-[#f89820]/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-[#00e676] tracking-wider uppercase mb-2 block">
              Líderes de la Industria & Academia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fbf7f2] tracking-tight">
              Ponentes Destacados
            </h2>
            <p className="text-sm sm:text-base text-[#a8998a] mt-2 max-w-xl">
              Aprende directamente de Java Champions, arquitectos de software en producción e investigadoras pioneras en Inteligencia Artificial.
            </p>
          </div>

          {/* Interactive Filter Tabs (Functional segmented buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#140e0a] border border-[#f89820]/20 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#f89820] text-black font-semibold shadow-sm'
                  : 'text-[#c4b5a5] hover:text-white'
              }`}
            >
              Todos ({SPEAKERS.length})
            </button>
            <button
              onClick={() => setActiveFilter('java')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeFilter === 'java'
                  ? 'bg-[#f89820] text-black font-semibold shadow-sm'
                  : 'text-[#c4b5a5] hover:text-white'
              }`}
            >
              Core Java & Concurrencia
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeFilter === 'ai'
                  ? 'bg-[#f89820] text-black font-semibold shadow-sm'
                  : 'text-[#c4b5a5] hover:text-white'
              }`}
            >
              IA & LangChain4j
            </button>
            <button
              onClick={() => setActiveFilter('cloud')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeFilter === 'cloud'
                  ? 'bg-[#f89820] text-black font-semibold shadow-sm'
                  : 'text-[#c4b5a5] hover:text-white'
              }`}
            >
              GraalVM & Cloud
            </button>
          </div>
        </div>

        {/* Speakers Grid with reveal-card class for IntersectionObserver scroll reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpeakers.map((speaker, index) => (
            <div
              key={speaker.id}
              data-delay={((index % 3) * 100).toString()}
              className="reveal-card group bg-[#120d0a] border border-[#f89820]/20 hover:border-[#f89820]/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/40 flex flex-col justify-between"
            >
              <div>
                {/* Speaker Portrait / Headshot Header */}
                <div className="relative aspect-square sm:aspect-[4/3] bg-[#1a120d] overflow-hidden">
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={`Foto de ${speaker.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback container if image fails
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-avatar');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}

                  {/* Fallback avatar container if no photo or error */}
                  <div
                    className={`fallback-avatar ${
                      speaker.image ? 'hidden' : ''
                    } absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1a120d] via-[#120d0a] to-[#0a0705] text-[#d68a2d]`}
                  >
                    <div className="w-16 h-16 rounded-full border border-[#f89820]/30 flex items-center justify-center mb-3 bg-[#0e0a07]">
                      <Code className="w-8 h-8 text-[#f89820]" />
                    </div>
                    <span className="text-xs font-mono text-[#a8998a]">{speaker.company}</span>
                    <span className="text-[11px] font-mono text-[#00e676] mt-1">// Speaker 2026</span>
                  </div>

                  {/* Gradient Scrim for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120d0a] via-transparent to-black/30" />

                  {/* Track Label on the image top left (Clean text on translucent background) */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0a0705]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#f89820]">
                    {speaker.trackLabel}
                  </div>
                </div>

                {/* Speaker Content Info */}
                <div className="p-6">
                  {/* Clean unboxed metadata: tags with bullet separators */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#a8998a] mb-2 font-mono">
                    {speaker.badges.map((badge, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-[#c4b5a5]">{badge}</span>
                        {idx < speaker.badges.length - 1 && <span className="text-white/20">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-[#fbf7f2] group-hover:text-[#f89820] transition-colors mb-1">
                    {speaker.name}
                  </h3>
                  <p className="text-xs font-medium text-[#d1c2b2] mb-3">
                    {speaker.role} · <span className="text-[#a8998a]">{speaker.company}</span>
                  </p>

                  <div className="pt-3 border-t border-white/5 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#f89820] block mb-1">
                      Conferencia:
                    </span>
                    <h4 className="text-sm font-semibold text-[#f4efe8] line-clamp-2 leading-snug">
                      {speaker.talkTitle}
                    </h4>
                  </div>

                  {/* Code snippet representation */}
                  <div className="bg-[#0a0705] border border-white/5 rounded p-2.5 font-mono text-[11px] text-[#00e676] overflow-x-auto select-all">
                    <code>{speaker.codeSnippet}</code>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onSelectSpeaker(speaker)}
                  className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] hover:bg-[#f89820] hover:text-black text-xs font-semibold text-[#f4efe8] border border-white/10 hover:border-[#f89820] transition-all flex items-center justify-center gap-2 group-hover:border-[#f89820]/40"
                >
                  <span>Ver Detalle de Charla y Perfil</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
