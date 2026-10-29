import React, { useState } from 'react';
import { ALLIANCES } from '../data/conferenceData';
import { Alliance } from '../types';
import { ExternalLink, Handshake, Users, GraduationCap, Award, CheckCircle2, Send, Building } from 'lucide-react';

export const AlliancesSection: React.FC = () => {
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    organization: '',
    contactName: '',
    email: '',
    type: 'comunidad',
    message: ''
  });

  const organizadores = ALLIANCES.filter((a) => a.type === 'organizador');
  const comunidades = ALLIANCES.filter((a) => a.type === 'comunidad');
  const academicosYSponsors = ALLIANCES.filter((a) => a.type === 'academico' || a.type === 'sponsor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setPartnerModalOpen(false);
      setSubmitted(false);
      setFormData({ organization: '', contactName: '', email: '', type: 'comunidad', message: '' });
    }, 2500);
  };

  const renderIcon = (type: Alliance['iconType']) => {
    switch (type) {
      case 'uptc':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#24170d] border border-[#f89820]/40 flex items-center justify-center text-[#f89820]">
            <GraduationCap className="w-6 h-6" />
          </div>
        );
      case 'boyaca':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#1a1f10] border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
            <Users className="w-6 h-6" />
          </div>
        );
      case 'jug':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#22160d] border border-[#f89820]/50 flex items-center justify-center text-[#f89820]">
            <span className="font-mono font-bold text-lg">&lt;J/&gt;</span>
          </div>
        );
      case 'ai':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#14231b] border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
            <Award className="w-6 h-6" />
          </div>
        );
      case 'cloud':
        return (
          <div className="w-12 h-12 rounded-lg bg-[#121c25] border border-[#5382a1]/40 flex items-center justify-center text-[#5382a1]">
            <Building className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-lg bg-[#24170d] border border-[#f89820]/30 flex items-center justify-center text-[#f89820]">
            <Handshake className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <section id="alianzas" className="py-24 bg-[#0a0705] relative border-t border-[#f89820]/15">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#f89820]/25 bg-[#140e0a] text-xs font-mono text-[#f89820] mb-3">
            <Handshake className="w-3.5 h-3.5 text-[#00e676]" />
            <span>Ecosistema & Alianzas Estratégicas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fbf7f2] tracking-tight mb-4">
            Organizan y Apoyan
          </h2>
          <p className="text-base text-[#c4b5a5]">
            La sinergia entre la universidad pública, las comunidades de código libre y la industria que hace posible el mayor evento de Java e Inteligencia Artificial en Boyacá.
          </p>
        </div>

        {/* Bloque 1: ORGANIZAN (Tarjetas Principales con Borde Dashed en Estilo Crema/Dorado Tenue) */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f89820] font-semibold">
              01. Organizadores Principales
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#f89820]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {organizadores.map((org) => (
              <div
                key={org.id}
                className="alliance-dashed-card p-6 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {renderIcon(org.iconType)}
                    <span className="text-[11px] font-mono text-[#f89820] text-right">
                      {org.location}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#00e676] tracking-wide block mb-1">
                    {org.typeLabel}
                  </span>
                  <h3 className="text-lg font-bold text-[#fbf7f2] mb-2 leading-snug">
                    {org.name}
                  </h3>
                  <p className="text-xs text-[#d1c2b2] leading-relaxed mb-4">
                    {org.fullDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-dashed border-[#f89820]/20 flex items-center justify-between text-xs">
                  <span className="text-[#a8998a] font-mono text-[11px]">{org.shortDesc}</span>
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded hover:bg-[#f89820]/20 text-[#f89820] transition-colors"
                    aria-label={`Visitar sitio de ${org.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 2: COMUNIDADES DE APOYO */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00e676] font-semibold">
              02. Comunidades Tecnológicas de Apoyo
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#00e676]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comunidades.map((com) => (
              <div
                key={com.id}
                className="alliance-dashed-card p-6 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {renderIcon(com.iconType)}
                      <div>
                        <h3 className="text-base font-bold text-[#fbf7f2]">{com.name}</h3>
                        <span className="text-[11px] font-mono text-[#00e676]">{com.typeLabel}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#a8998a]">{com.location}</span>
                  </div>

                  <p className="text-xs text-[#d1c2b2] leading-relaxed mb-4">
                    {com.fullDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#f89820]/20 flex items-center justify-between text-xs">
                  <span className="text-[#a8998a] font-mono text-[11px]">{com.shortDesc}</span>
                  <a
                    href={com.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-[#f89820] hover:underline"
                  >
                    <span>Comunidad</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloque 3: ALIADOS ACADÉMICOS Y SPONSORS */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ffcb77] font-semibold">
              03. Investigación Académica & Patrocinadores
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#ffcb77]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academicosYSponsors.map((item) => (
              <div
                key={item.id}
                className="alliance-dashed-card p-5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {renderIcon(item.iconType)}
                    <span className="text-[10px] font-mono text-[#f89820] px-2 py-0.5 rounded bg-black/40 border border-white/5">
                      {item.typeLabel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#fbf7f2] mb-1">{item.name}</h4>
                  <p className="text-xs text-[#c4b5a5] leading-relaxed mb-3">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#f89820]/15 flex items-center justify-between text-[11px] font-mono text-[#a8998a]">
                  <span>{item.location}</span>
                  <span className="text-[#00e676]">Aliado 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Convocatoria abierta para unirse como comunidad o patrocinador */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#17100b] to-[#120d0a] border border-[#f89820]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#fbf7f2] mb-1">
              ¿Lideras una comunidad tech o quieres vincular tu empresa?
            </h3>
            <p className="text-xs sm:text-sm text-[#c4b5a5]">
              Únete a la red de apoyo para conferencistas, refrigerios, escarapelas y becas de transporte para estudiantes de Boyacá.
            </p>
          </div>
          <button
            onClick={() => setPartnerModalOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-md shadow-[#f89820]/20"
          >
            Postular Comunidad o Alianza
          </button>
        </div>
      </div>

      {/* Modal de Postulación de Alianza */}
      {partnerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg bg-[#140e0a] border border-[#f89820]/40 rounded-2xl p-6 shadow-2xl text-[#f4efe8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#fbf7f2]">
                Postulación de Alianza / Comunidad de Apoyo
              </h3>
              <button
                onClick={() => setPartnerModalOpen(false)}
                className="text-[#a8998a] hover:text-white"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#00e676] mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#fbf7f2]">¡Propuesta Recibida!</h4>
                <p className="text-xs text-[#c4b5a5] mt-1">
                  El comité organizador de UPTC & Boyacá Devs revisará la vinculación y te contactará en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Nombre de la Organización / Comunidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Ej. Sogamoso Tech Labs / Startup X"
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Nombre de Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@comunidad.org"
                      className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Tipo de Vinculación
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  >
                    <option value="comunidad">Comunidad de Software / Estudiantil</option>
                    <option value="sponsor">Patrocinador Corporativo</option>
                    <option value="medios">Media Partner / Difusión</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Mensaje o Propuesta
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos brevemente cómo deseas sumarte al evento..."
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPartnerModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#a8998a] hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Postulación</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
