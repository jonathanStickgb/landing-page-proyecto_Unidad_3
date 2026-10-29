import React from 'react';
import { Speaker } from '../types';
import { X, Calendar, MapPin, ExternalLink, Code, Terminal, Check } from 'lucide-react';

interface SpeakerModalProps {
  speaker: Speaker | null;
  onClose: () => void;
}

export const SpeakerModal: React.FC<SpeakerModalProps> = ({ speaker, onClose }) => {
  if (!speaker) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#140e0a] border border-[#f89820]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#f4efe8] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow in modal */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 bg-[#f89820]/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#a8998a] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Portrait and Title */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#1c140e] border border-[#f89820]/30 shrink-0">
            {speaker.image ? (
              <img
                src={speaker.image}
                alt={speaker.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0a0705] text-[#f89820]">
                <Code className="w-10 h-10" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f89820] mb-1">
              <span>{speaker.trackLabel}</span>
              <span className="text-white/30">·</span>
              <span className="text-[#00e676]">UPTC 2026</span>
            </div>
            <h3 className="text-2xl font-bold text-[#fbf7f2] mb-1">{speaker.name}</h3>
            <p className="text-sm text-[#d1c2b2]">{speaker.role}</p>
            <p className="text-xs text-[#a8998a] font-mono mt-0.5">{speaker.company}</p>
          </div>
        </div>

        {/* Talk Details Section */}
        <div className="mb-6 bg-[#0a0705] border border-white/5 rounded-xl p-5">
          <span className="text-[11px] font-mono text-[#f89820] uppercase tracking-wider block mb-1">
            Conferencia Magistral
          </span>
          <h4 className="text-lg font-bold text-[#fbf7f2] mb-2 leading-snug">
            {speaker.talkTitle}
          </h4>
          <p className="text-sm text-[#c4b5a5] leading-relaxed">
            {speaker.talkSummary}
          </p>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-[#00e676]">
            <Terminal className="w-3.5 h-3.5" />
            <code className="truncate">{speaker.codeSnippet}</code>
          </div>
        </div>

        {/* Speaker Bio */}
        <div className="mb-6">
          <h5 className="text-xs font-mono uppercase tracking-wider text-[#a8998a] mb-2">
            Trayectoria Profesional
          </h5>
          <p className="text-sm text-[#d1c2b2] leading-relaxed">
            {speaker.bio}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#a8998a]">
            <span>Auditorio Paraninfo UPTC</span>
            <span>·</span>
            <span>Tunja</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
