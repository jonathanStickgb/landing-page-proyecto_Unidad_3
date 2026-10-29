import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle, Ticket, QrCode, Download, Copy, Check, Sparkles, User, Mail, Building2, Calendar, RefreshCw } from 'lucide-react';
import { AttendeeTicket, AttendeeRole, AttendanceType, PrimaryTrack } from '../types';
import { createAttendee } from '../services/attendeeService';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Estudiante UPTC' as AttendeeRole,
    organization: 'UPTC - Ingeniería de Sistemas',
    attendanceType: 'presencial' as AttendanceType,
    primaryTrack: 'Ambos (Java + IA)' as PrimaryTrack
  });

  const [ticket, setTicket] = useState<AttendeeTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `JAI-BOY-2026-${randomNum}`;

    try {
      // Real database persistence via Firestore
      await createAttendee({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        organization: formData.organization || 'Comunidad Boyacá Devs',
        attendanceType: formData.attendanceType,
        primaryTrack: formData.primaryTrack,
        ticketNumber: ticketCode,
        status: 'confirmado',
        notes: 'Registro generado desde el portal público de la conferencia.',
      });

      const newTicket: AttendeeTicket = {
        ticketNumber: ticketCode,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        organization: formData.organization || 'Comunidad Boyacá Devs',
        primaryTrack: formData.primaryTrack,
        registeredAt: new Date().toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      setTicket(newTicket);

      // Launch celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f89820', '#00e676', '#ffa94d', '#ffffff']
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error('Error saving attendee to Firestore:', err);
      setErrorMsg('No se pudo guardar el registro en la base de datos. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketCode = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(`Java & AI Day Boyacá 2026 - Pase: ${ticket.ticketNumber} para ${ticket.fullName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTicket(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'Estudiante UPTC',
      organization: 'UPTC - Ingeniería de Sistemas',
      attendanceType: 'presencial',
      primaryTrack: 'Ambos (Java + IA)'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-[#140e0a] border border-[#f89820]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#f4efe8] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div
          className="absolute -top-24 -left-24 w-64 h-64 bg-[#f89820]/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#a8998a] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal de registro"
        >
          <X className="w-5 h-5" />
        </button>

        {!ticket ? (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f89820]/10 border border-[#f89820]/30 text-xs font-mono text-[#f89820] mb-2">
                <Ticket className="w-3.5 h-3.5" />
                <span>Registro Oficial de Asistente</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#fbf7f2]">
                Asegura tu Entrada Gratuita
              </h3>
              <p className="text-xs text-[#a8998a] mt-1">
                Aforo limitado a 450 personas en el Auditorio Paraninfo UPTC Tunja. Tu registro incluye certificado digital con código QR.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Nombre Completo (para tu credencial y certificado) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#a8998a] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. María Camila Medina"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Correo Electrónico Institucional o Personal *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#a8998a] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="maria.medina@uptc.edu.co"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Perfil del Asistente
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as AttendeeRole })}
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  >
                    <option value="Estudiante UPTC">Estudiante UPTC</option>
                    <option value="Estudiante Otra Universidad">Estudiante Otra Universidad</option>
                    <option value="Desarrollador / Ingeniero">Desarrollador / Ingeniero</option>
                    <option value="Docente / Investigador">Docente / Investigador</option>
                    <option value="Líder Tech / Empresa">Líder Tech / Empresa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Institución o Empresa
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#a8998a] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="UPTC / Empresa"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Modalidad de Asistencia
                  </label>
                  <select
                    value={formData.attendanceType}
                    onChange={(e) => setFormData({ ...formData, attendanceType: e.target.value as AttendanceType })}
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  >
                    <option value="presencial">Presencial (Auditorio Paraninfo Tunja)</option>
                    <option value="streaming">Streaming en Vivo Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Interés Principal
                  </label>
                  <select
                    value={formData.primaryTrack}
                    onChange={(e) => setFormData({ ...formData, primaryTrack: e.target.value as PrimaryTrack })}
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  >
                    <option value="Ambos (Java + IA)">Ambos (Java + IA)</option>
                    <option value="Core Java & Loom">Core Java & Concurrencia</option>
                    <option value="IA Generativa & LangChain4j">IA Generativa & Agentes</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <span className="text-[11px] text-[#a8998a] font-mono">
                  Entrada 100% gratuita · Certificado UPTC
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] disabled:opacity-50 rounded-lg transition-all shadow-md shadow-[#f89820]/30 transform active:scale-95 flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? 'Guardando en BD...' : 'Generar Mi Escarapela Virtual'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Escarapela / Credencial Virtual Interactiva */
          <div className="text-center">
            <div className="inline-flex p-2 rounded-full bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#fbf7f2] mb-1">
              ¡Registro Confirmado con Éxito!
            </h3>
            <p className="text-xs text-[#c4b5a5] mb-6">
              Presenta esta credencial digital o tu código QR en el acceso al Paraninfo de la UPTC el 4 y 5 de Diciembre.
            </p>

            {/* Virtual Conference Badge */}
            <div className="max-w-sm mx-auto bg-gradient-to-b from-[#1c140e] via-[#120d0a] to-[#0a0705] border-2 border-dashed border-[#f89820]/50 rounded-2xl p-6 shadow-2xl relative text-left mb-6 overflow-hidden">
              {/* Lanyard Hole Clip */}
              <div className="w-12 h-2.5 rounded-full bg-black/60 border border-white/20 mx-auto mb-5" />

              <div className="flex items-center justify-between border-b border-[#f89820]/20 pb-3 mb-4">
                <div className="text-[11px] font-mono font-bold text-[#f89820]">
                  Java & AI Day Boyacá 2026
                </div>
                <div className="text-[10px] font-mono text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded border border-[#00e676]/30">
                  CONFIRMADO
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#a8998a] block">
                  Asistente
                </span>
                <h4 className="text-xl font-extrabold text-[#fbf7f2]">
                  {ticket.fullName}
                </h4>
                <p className="text-xs text-[#d1c2b2] mt-0.5">
                  {ticket.role} · <span className="text-[#a8998a]">{ticket.organization}</span>
                </p>
              </div>

              {/* QR and Ticket Number Strip */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-black/50 border border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#a8998a] block">Código de Pase</span>
                  <span className="text-sm font-bold font-mono text-[#f89820] tracking-wider">
                    {ticket.ticketNumber}
                  </span>
                  <span className="text-[10px] text-[#00e676] block mt-1">
                    UPTC San Jerónimo · Silla Asignada
                  </span>
                </div>

                {/* SVG QR Code Simulation */}
                <div className="w-14 h-14 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-black" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm12-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-6-2h2v2h-2v-2zm0-4h2v2h-2v-2z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#8a7c6f]">
                <span>4-5 DICIEMBRE 2026</span>
                <span>TUNJA, COLOMBIA</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={copyTicketCode}
                className="px-4 py-2 text-xs font-medium text-[#f4efe8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Código Copiado' : 'Copiar Clave de Pase'}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-colors"
              >
                Registrar Otro Asistente
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#a8998a] hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
