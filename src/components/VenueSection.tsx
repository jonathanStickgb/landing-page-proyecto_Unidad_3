import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Check, Copy, AlertCircle, Wifi, Car, ShieldCheck } from 'lucide-react';

export const VenueSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const address = 'Auditorio Paraninfo San Jerónimo, UPTC Campus Central, Avenida Central del Norte # 39-115, Tunja, Boyacá';

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sede" className="py-24 bg-[#0a0705] relative border-t border-[#f89820]/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Col 1: Venue Information */}
          <div className="lg:col-span-6">
            <span className="text-xs font-mono text-[#f89820] tracking-wider uppercase mb-2 block">
              Sede Presencial
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fbf7f2] tracking-tight mb-4">
              Auditorio Paraninfo San Jerónimo · UPTC Tunja
            </h2>
            <p className="text-base text-[#c4b5a5] leading-relaxed mb-8">
              El histórico Paraninfo de la Universidad Pedagógica y Tecnológica de Colombia abre sus puertas a la comunidad de desarrolladores y científicos. Equipado con acústica de concierto, proyección dual 4K y conectividad de alta velocidad.
            </p>

            {/* Address Bar with Copy */}
            <div className="p-4 rounded-xl bg-[#140e0a] border border-[#f89820]/25 flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#f89820] shrink-0" />
                <span className="text-xs text-[#f4efe8] font-mono leading-tight">
                  {address}
                </span>
              </div>
              <button
                onClick={copyAddress}
                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-[#f89820] transition-colors shrink-0 flex items-center gap-1.5"
                title="Copiar dirección"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Key Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#120d0a] border border-white/5">
                <Wifi className="w-4 h-4 text-[#00e676] mb-2" />
                <h4 className="text-xs font-bold text-[#fbf7f2] mb-1">Conectividad</h4>
                <p className="text-[11px] text-[#a8998a]">WiFi 6 eduroam y red libre para participantes.</p>
              </div>

              <div className="p-4 rounded-lg bg-[#120d0a] border border-white/5">
                <Compass className="w-4 h-4 text-[#f89820] mb-2" />
                <h4 className="text-xs font-bold text-[#fbf7f2] mb-1">Clima Tunja</h4>
                <p className="text-[11px] text-[#a8998a]">2.810 msnm. Temperatura 8°C a 17°C. Traer abrigo.</p>
              </div>

              <div className="p-4 rounded-lg bg-[#120d0a] border border-white/5">
                <Car className="w-4 h-4 text-[#5382a1] mb-2" />
                <h4 className="text-xs font-bold text-[#fbf7f2] mb-1">Transporte</h4>
                <p className="text-[11px] text-[#a8998a]">A 10 minutos del Terminal de Transportes de Tunja.</p>
              </div>
            </div>
          </div>

          {/* Col 2: Stylized Interactive Map Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#f89820]/30 bg-[#120d0a] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e676]" />
                  <span className="text-xs font-mono font-bold text-[#fbf7f2]">
                    Campus Central UPTC · Mapa del Evento
                  </span>
                </div>
                <span className="text-xs font-mono text-[#f89820]">Lat: 5.5539° N, Lon: -73.3567° W</span>
              </div>

              {/* Graphic Campus Layout */}
              <div className="relative aspect-[16/10] rounded-xl bg-[#0a0705] border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
                {/* Simulated campus architectural map lines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="campus-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(248,152,32,0.4)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#campus-grid)" />
                    <line x1="20%" y1="0%" x2="80%" y2="100%" stroke="rgba(0,230,118,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <rect x="35%" y="25%" width="30%" height="45%" fill="rgba(248,152,32,0.06)" stroke="rgba(248,152,32,0.5)" strokeWidth="1" />
                  </svg>
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div className="px-2.5 py-1 rounded bg-[#17100b] border border-white/10 text-[10px] font-mono text-[#c4b5a5]">
                    Acceso Peatonal: Av. Central del Norte
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[#00e676]/20 border border-[#00e676]/40 text-[10px] font-mono text-[#00e676]">
                    Punto de Registro Activo
                  </div>
                </div>

                {/* Main Marker in the middle */}
                <div className="relative z-10 self-center text-center my-4">
                  <div className="inline-flex p-3 rounded-full bg-[#f89820] text-black shadow-xl shadow-[#f89820]/30 animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="mt-2 bg-[#0e0a07]/95 border border-[#f89820]/40 rounded-lg px-3 py-1.5 text-xs font-bold text-[#fbf7f2] shadow-lg">
                    Auditorio Paraninfo San Jerónimo
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end text-[10px] font-mono text-[#a8998a]">
                  <span>Parqueadero Vehicular Torre C</span>
                  <a
                    href="https://maps.google.com/?q=UPTC+Tunja+Paraninfo"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#f89820] hover:underline bg-[#17100b] px-2.5 py-1 rounded border border-[#f89820]/30"
                  >
                    <span>Abrir en Google Maps</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#a8998a]">
                <span>Aforo Presencial: 450 asientos numerados</span>
                <span className="text-[#00e676]">Acceso adaptado para movilidad reducida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
