import React, { useState } from 'react';
import { AGENDA_ITEMS } from '../data/conferenceData';
import { Clock, MapPin, Calendar, Download, Sparkles, Code2, Users } from 'lucide-react';

export const AgendaSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);

  const dayItems = AGENDA_ITEMS.filter((item) => item.day === selectedDay);

  const downloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Java & AI Day Boyaca//2026//ES
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Java & AI Day Boyacá 2026 - UPTC Tunja
DESCRIPTION:Conferencia de Arquitectura Java 25, Virtual Threads e Inteligencia Artificial Generativa con LangChain4j y Spring AI en el Paraninfo UPTC.
LOCATION:Auditorio Paraninfo San Jerónimo, UPTC Campus Central, Tunja, Colombia
DTSTART:20261204T130000Z
DTEND:20261205T220000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'java-ai-day-boyaca-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="agenda" className="py-24 bg-[#0d0906] relative border-t border-[#f89820]/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-[#f89820] tracking-wider uppercase mb-2 block">
              Cronograma de Actividades
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fbf7f2] tracking-tight">
              Agenda Técnica
            </h2>
            <p className="text-sm sm:text-base text-[#a8998a] mt-2 max-w-xl">
              Dos días de conferencias magistrales, paneles de discusión, laboratorios hands-on y networking en el Paraninfo de la UPTC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadIcs}
              className="px-3.5 py-2 text-xs font-medium text-[#f4efe8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#f89820]" />
              <span>Añadir a Google / Apple Calendar (.ics)</span>
            </button>
          </div>
        </div>

        {/* Day Switcher Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setSelectedDay(1)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2.5 ${
              selectedDay === 1
                ? 'bg-[#f89820] text-black shadow-lg shadow-[#f89820]/20'
                : 'text-[#c4b5a5] hover:text-white bg-white/[0.02]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Día 1 · Viernes 4 de Diciembre</span>
            <span className="text-xs font-normal opacity-85 hidden sm:inline">(Core Java & Concurrencia)</span>
          </button>

          <button
            onClick={() => setSelectedDay(2)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2.5 ${
              selectedDay === 2
                ? 'bg-[#00e676] text-black shadow-lg shadow-[#00e676]/20'
                : 'text-[#c4b5a5] hover:text-white bg-white/[0.02]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Día 2 · Sábado 5 de Diciembre</span>
            <span className="text-xs font-normal opacity-85 hidden sm:inline">(IA Generativa & Hackathon)</span>
          </button>
        </div>

        {/* Timeline List */}
        <div className="space-y-4">
          {dayItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-[#120d0a] border border-white/5 hover:border-[#f89820]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Time Badge */}
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#f89820] shrink-0 md:w-36 tabular-nums">
                  <Clock className="w-4 h-4 text-[#a8998a]" />
                  <span>{item.time}</span>
                </div>

                {/* Main Content */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#a8998a] mb-1">
                    <span className="text-[#00e676]">{item.room}</span>
                    <span>·</span>
                    <span className="capitalize">{item.track} Track</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#fbf7f2] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#c4b5a5] line-clamp-2 max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Speaker / Host Tag */}
              <div className="shrink-0 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="text-left md:text-right">
                  <span className="block text-xs font-semibold text-[#f4efe8]">
                    {item.speakerName}
                  </span>
                  <span className="block text-[11px] text-[#a8998a]">
                    {item.speakerRole}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
