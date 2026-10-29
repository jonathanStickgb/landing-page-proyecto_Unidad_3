import React, { useState, useEffect } from 'react';
import {
  AttendeeRecord,
  AttendeeRole,
  AttendeeStatus,
  AttendanceType,
  PrimaryTrack,
} from '../types';
import {
  subscribeToAttendees,
  createAttendee,
  updateAttendee,
  deleteAttendee,
  StorageMode,
  setActiveRepositoryMode,
  getInitialStorageMode,
  localRepo,
} from '../services/attendeeService';
import { POSTGRES_SQL_SCRIPT, DOCKER_POSTGRES_COMMAND } from '../services/postgresScript';
import { JAVA_CLASSES, JavaClassFile } from '../services/javaClasses';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  Edit2,
  Trash2,
  Download,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Code,
  HardDrive,
  Cloud,
  FileCode,
  AlertCircle,
  Terminal,
} from 'lucide-react';

interface CrudDashboardProps {
  onOpenPublicRegister?: () => void;
}

export const CrudDashboard: React.FC<CrudDashboardProps> = () => {
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Storage Mode switcher (Cloud Firestore vs Local Sandbox)
  const [storageMode, setStorageMode] = useState<StorageMode>(getInitialStorageMode);

  // Form Modal state for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttendee, setEditingAttendee] = useState<AttendeeRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [javaModalOpen, setJavaModalOpen] = useState(false);
  const [selectedJavaClass, setSelectedJavaClass] = useState<JavaClassFile>(JAVA_CLASSES[0]);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJava, setCopiedJava] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Estudiante UPTC' as AttendeeRole,
    organization: 'UPTC - Ingeniería de Sistemas',
    attendanceType: 'presencial' as AttendanceType,
    primaryTrack: 'Ambos (Java + IA)' as PrimaryTrack,
    status: 'confirmado' as AttendeeStatus,
    notes: '',
  });

  // Subscribe to real-time changes based on selected storage mode
  useEffect(() => {
    setLoading(true);
    setActiveRepositoryMode(storageMode);

    const unsubscribe = subscribeToAttendees(
      (data) => {
        setAttendees(data);
        setLoading(false);
      },
      (error) => {
        console.warn('Subscription notification:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [storageMode]);

  const toggleStorageMode = (newMode: StorageMode) => {
    setStorageMode(newMode);
  };

  const openCreateModal = () => {
    setEditingAttendee(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'Estudiante UPTC',
      organization: 'UPTC - Ingeniería de Sistemas',
      attendanceType: 'presencial',
      primaryTrack: 'Ambos (Java + IA)',
      status: 'confirmado',
      notes: '',
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (att: AttendeeRecord) => {
    setEditingAttendee(att);
    setFormData({
      fullName: att.fullName,
      email: att.email,
      role: att.role,
      organization: att.organization,
      attendanceType: att.attendanceType,
      primaryTrack: att.primaryTrack,
      status: att.status,
      notes: att.notes || '',
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingAttendee) {
        await updateAttendee(editingAttendee.id, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          organization: formData.organization,
          attendanceType: formData.attendanceType,
          primaryTrack: formData.primaryTrack,
          status: formData.status,
          notes: formData.notes,
        });
      } else {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        await createAttendee({
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          organization: formData.organization,
          attendanceType: formData.attendanceType,
          primaryTrack: formData.primaryTrack,
          ticketNumber: `JAI-BOY-2026-${randomNum}`,
          status: formData.status,
          notes: formData.notes,
        });
      }
      setIsModalOpen(false);
      setEditingAttendee(null);
    } catch (err: any) {
      console.error('Error saving attendee:', err);
      setErrorMessage('Error al persistir registro. Puedes cambiar a "Modo Local" para probar en navegador.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttendee(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting attendee:', err);
      alert('No se pudo eliminar el registro.');
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: AttendeeStatus) => {
    try {
      await updateAttendee(id, { status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const copySqlScript = () => {
    navigator.clipboard.writeText(POSTGRES_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const downloadSqlScript = () => {
    const blob = new Blob([POSTGRES_SQL_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'schema_boyaca2026.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyJavaCode = () => {
    navigator.clipboard.writeText(selectedJavaClass.content);
    setCopiedJava(true);
    setTimeout(() => setCopiedJava(false), 2000);
  };

  const downloadJavaFile = () => {
    const blob = new Blob([selectedJavaClass.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedJavaClass.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Nombre', 'Correo', 'Rol', 'Institución', 'Modalidad', 'Track', 'Ticket', 'Estado', 'Fecha'];
    const rows = attendees.map((a) => [
      `"${a.id}"`,
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.role}"`,
      `"${a.organization}"`,
      `"${a.attendanceType}"`,
      `"${a.primaryTrack}"`,
      `"${a.ticketNumber}"`,
      `"${a.status}"`,
      `"${a.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `asistentes-boyaca2026-${storageMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || a.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const capacityMax = 450;
  const totalRegistered = attendees.length;
  const checkinsCount = attendees.filter((a) => a.status === 'checkin').length;
  const presencialCount = attendees.filter((a) => a.attendanceType === 'presencial').length;
  const occupancyPercentage = Math.min(100, Math.round((presencialCount / capacityMax) * 100));

  const getStatusBadge = (status: AttendeeStatus) => {
    switch (status) {
      case 'checkin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded border border-[#00e676]/30">
            <UserCheck className="w-3 h-3" />
            <span>En Sede</span>
          </span>
        );
      case 'confirmado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#f89820] bg-[#f89820]/10 px-2 py-0.5 rounded border border-[#f89820]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmado</span>
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#ffcb77] bg-[#ffcb77]/10 px-2 py-0.5 rounded border border-[#ffcb77]/30">
            <Clock className="w-3 h-3" />
            <span>Pendiente</span>
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
            <XCircle className="w-3 h-3" />
            <span>Cancelado</span>
          </span>
        );
    }
  };

  return (
    <section id="gestion-crud" className="py-24 bg-[#070503] relative border-t border-[#f89820]/20">
      <div
        className="absolute top-10 left-10 w-96 h-96 bg-[#f89820]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#00e676]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Top Title & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00e676]/30 bg-[#00e676]/5 text-xs font-mono text-[#00e676] mb-3">
              <Database className="w-3.5 h-3.5" />
              <span>Base de Datos Persistente · Modo Nube o Local</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fbf7f2] tracking-tight">
              Gestión de Asistentes, Clases Java & Base de Datos
            </h2>
            <p className="text-sm sm:text-base text-[#c4b5a5] mt-2 max-w-2xl">
              Prueba la persistencia en tiempo real en la nube (Firestore) o de manera 100% local e independiente (LocalStorage / Postgres DDL / Clases Java 21).
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Storage Mode Selector */}
            <div className="flex items-center p-1 bg-[#140e0a] border border-[#f89820]/30 rounded-lg">
              <button
                onClick={() => toggleStorageMode('cloud')}
                className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                  storageMode === 'cloud'
                    ? 'bg-[#f89820] text-black font-semibold'
                    : 'text-[#c4b5a5] hover:text-white'
                }`}
                title="Conectado a la base de datos cloud en vivo"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Nube (Firestore)</span>
              </button>

              <button
                onClick={() => toggleStorageMode('local')}
                className={`px-3 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                  storageMode === 'local'
                    ? 'bg-[#00e676] text-black font-semibold'
                    : 'text-[#c4b5a5] hover:text-white'
                }`}
                title="Modo local sin dependencia de red"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Local Sandbox</span>
              </button>
            </div>

            {/* Standalone Code Buttons */}
            <button
              onClick={() => setSqlModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono text-[#f89820] bg-white/[0.04] hover:bg-white/[0.08] border border-[#f89820]/30 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Script PostgreSQL (.sql)</span>
            </button>

            <button
              onClick={() => setJavaModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono text-[#00e676] bg-white/[0.04] hover:bg-white/[0.08] border border-[#00e676]/30 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Clases Java Independientes</span>
            </button>

            <button
              onClick={() => setSecurityModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono text-[#d1c2b2] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reglas</span>
            </button>

            <button
              onClick={exportToCsv}
              className="px-3 py-1.5 text-xs font-mono text-[#d1c2b2] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-1.5 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-all shadow-md shadow-[#f89820]/25 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#120d0a] border border-[#f89820]/25">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#a8998a] block mb-1">
              Total Registros ({storageMode.toUpperCase()})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#fbf7f2] tabular-nums">
                {totalRegistered}
              </span>
              <span className="text-xs text-[#00e676]">Activos</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#120d0a] border border-[#00e676]/25">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#a8998a] block mb-1">
              Check-in en Sede
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#00e676] tabular-nums">
                {checkinsCount}
              </span>
              <span className="text-xs text-[#a8998a]">acreditados</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#120d0a] border border-[#5382a1]/25">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#a8998a] block mb-1">
              Cupos Paraninfo UPTC
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#fbf7f2] tabular-nums">
                {presencialCount} / {capacityMax}
              </span>
              <span className="text-xs text-[#f89820]">{occupancyPercentage}%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#120d0a] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#a8998a] block mb-1">
                Persistencia Activa
              </span>
              <span className="text-xs font-mono text-[#f4efe8] flex items-center gap-1.5 truncate">
                {storageMode === 'cloud' ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-[#f89820]" />
                    <span>Firestore DB Nube</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-[#00e676]" />
                    <span>Local Sandbox DB</span>
                  </>
                )}
              </span>
            </div>
            {storageMode === 'local' ? (
              <button
                onClick={() => localRepo.resetToDefault()}
                className="text-[11px] font-mono text-[#00e676] hover:underline self-start mt-1"
              >
                Reiniciar datos semilla
              </button>
            ) : currentUser ? (
              <button
                onClick={signOut}
                className="text-[11px] font-mono text-red-400 hover:underline self-start mt-1"
              >
                Cerrar sesión ({currentUser.email?.split('@')[0]})
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="text-[11px] font-mono text-[#f89820] hover:underline self-start mt-1"
              >
                Acceder como Organizador
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-xl bg-[#120d0a] border border-white/10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#a8998a] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, correo o ticket..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#a8998a]">Perfil:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
              >
                <option value="all">Todos los Perfiles</option>
                <option value="Estudiante UPTC">Estudiante UPTC</option>
                <option value="Estudiante Otra Universidad">Estudiante Otra Universidad</option>
                <option value="Desarrollador / Ingeniero">Desarrollador / Ingeniero</option>
                <option value="Docente / Investigador">Docente / Investigador</option>
                <option value="Líder Tech / Empresa">Líder Tech / Empresa</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#a8998a]">Estado:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
              >
                <option value="all">Todos los Estados</option>
                <option value="confirmado">Confirmados</option>
                <option value="checkin">Check-in (En Sede)</option>
                <option value="pendiente">Pendientes</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table with Full CRUD Controls */}
        <div className="rounded-xl border border-white/10 bg-[#100b08] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#160f0a] text-[11px] font-mono uppercase tracking-wider text-[#a8998a]">
                  <th className="py-3 px-4">Asistente</th>
                  <th className="py-3 px-4">Rol / Institución</th>
                  <th className="py-3 px-4">Eje Temático</th>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-[#d1c2b2]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#a8998a]">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#f89820]" />
                      <span>Sincronizando registros ({storageMode})...</span>
                    </td>
                  </tr>
                ) : filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#a8998a]">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-[#f89820]" />
                      <span>No se encontraron registros que coincidan con la búsqueda.</span>
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((att) => (
                    <tr
                      key={att.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#fbf7f2]">{att.fullName}</div>
                        <div className="text-[11px] text-[#a8998a] font-mono">{att.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-white">{att.role}</div>
                        <div className="text-[11px] text-[#a8998a]">{att.organization}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-[#c4b5a5]">{att.primaryTrack}</div>
                        <div className="text-[10px] font-mono text-[#f89820] uppercase">
                          {att.attendanceType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#f89820] text-xs font-semibold">
                        {att.ticketNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(att.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Check-in */}
                          {att.status !== 'checkin' ? (
                            <button
                              onClick={() => handleQuickStatusChange(att.id, 'checkin')}
                              title="Marcar Check-in en Sede"
                              className="p-1.5 rounded bg-[#00e676]/10 hover:bg-[#00e676]/20 text-[#00e676] transition-colors"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleQuickStatusChange(att.id, 'confirmado')}
                              title="Revertir a Confirmado"
                              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#a8998a] transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(att)}
                            title="Editar Asistente"
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#c4b5a5] hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmId(att.id)}
                            title="Eliminar Registro"
                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 bg-[#140e0a] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#a8998a] font-mono">
            <span>
              Mostrando {filteredAttendees.length} de {attendees.length} asistentes registrados ({storageMode})
            </span>
            <span className="text-[#00e676]">
              ● Almacenamiento activo: {storageMode === 'cloud' ? 'Cloud Firestore (ai-studio)' : 'Local Storage Sandbox'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Formulario de Captura de Datos */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg bg-[#140e0a] border border-[#f89820]/40 rounded-2xl p-6 shadow-2xl text-[#f4efe8] my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-[#fbf7f2]">
                  {editingAttendee ? 'Modificar Registro de Asistente' : 'Formulario de Captura de Datos'}
                </h3>
                <span className="text-xs text-[#a8998a] font-mono">
                  {editingAttendee ? `Ticket: ${editingAttendee.ticketNumber}` : `Persistiendo en modo: ${storageMode.toUpperCase()}`}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#a8998a] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Ing. Carlos Mario Salamanca"
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
                  placeholder="carlos.salamanca@uptc.edu.co"
                  className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Rol Institucional
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
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="UPTC / Empresa"
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Modalidad
                  </label>
                  <select
                    value={formData.attendanceType}
                    onChange={(e) => setFormData({ ...formData, attendanceType: e.target.value as AttendanceType })}
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  >
                    <option value="presencial">Presencial (Tunja)</option>
                    <option value="streaming">Streaming Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                    Eje Temático Principal
                  </label>
                  <select
                    value={formData.primaryTrack}
                    onChange={(e) => setFormData({ ...formData, primaryTrack: e.target.value as PrimaryTrack })}
                    className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                  >
                    <option value="Ambos (Java + IA)">Ambos (Java + IA)</option>
                    <option value="Core Java & Loom">Core Java & Loom</option>
                    <option value="IA Generativa & LangChain4j">IA Generativa & LangChain4j</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Estado de Acreditación
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendeeStatus })}
                  className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                >
                  <option value="confirmado">Confirmado</option>
                  <option value="checkin">Check-in (Presente en Sede)</option>
                  <option value="pendiente">Pendiente de Verificación</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a5] mb-1">
                  Observaciones / Notas Internas
                </label>
                <textarea
                  rows={2}
                  maxLength={500}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Requerimientos especiales, participación en talleres, alergias..."
                  className="w-full px-3 py-2 text-xs bg-[#0a0705] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#f89820]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#a8998a] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-black bg-[#f89820] hover:bg-[#ffaa3b] rounded-lg transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{editingAttendee ? 'Guardar Cambios' : 'Registrar Asistente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Script PostgreSQL (.sql) */}
      {sqlModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl bg-[#120d0a] border border-[#f89820]/40 rounded-2xl p-6 shadow-2xl text-[#f4efe8] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#f89820]" />
                <div>
                  <h3 className="text-base font-bold text-[#fbf7f2]">
                    Esquema Independiente PostgreSQL Local (schema_boyaca2026.sql)
                  </h3>
                  <span className="text-xs text-[#a8998a] font-mono">
                    DDL, Tipos Enum, Constraints, Triggers de Auditoría y RLS
                  </span>
                </div>
              </div>
              <button onClick={() => setSqlModalOpen(false)} className="text-[#a8998a] hover:text-white">
                ✕
              </button>
            </div>

            {/* Docker Fast Command Box */}
            <div className="p-3 mb-3 rounded-lg bg-[#0a0705] border border-white/10 text-xs font-mono text-[#00e676]">
              <span className="text-[#a8998a] block mb-1">
                Comando Docker para levantar PostgreSQL 16 en 1 segundo:
              </span>
              <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] text-[#f89820]">
                {DOCKER_POSTGRES_COMMAND}
              </pre>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-y-auto rounded-lg bg-[#070503] border border-white/10 p-4 font-mono text-xs text-[#c4b5a5]">
              <pre className="whitespace-pre-wrap">{POSTGRES_SQL_SCRIPT}</pre>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#a8998a] font-mono">
                Compatible con psql, pgAdmin, DBeaver y Supabase/Cloud SQL
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={copySqlScript}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copiado' : 'Copiar SQL'}</span>
                </button>
                <button
                  onClick={downloadSqlScript}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#f89820] hover:bg-[#ffaa3b] text-black flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar schema_boyaca2026.sql</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Clases Java Independientes */}
      {javaModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl bg-[#120d0a] border border-[#00e676]/40 rounded-2xl p-6 shadow-2xl text-[#f4efe8] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#00e676]" />
                <div>
                  <h3 className="text-base font-bold text-[#fbf7f2]">
                    Clases Java 21 / Spring Boot 3 Independientes
                  </h3>
                  <span className="text-xs text-[#a8998a] font-mono">
                    Entidad JPA, Repositorio, Servicio, Controlador REST y Spring Security
                  </span>
                </div>
              </div>
              <button onClick={() => setJavaModalOpen(false)} className="text-[#a8998a] hover:text-white">
                ✕
              </button>
            </div>

            {/* Class Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 mb-3">
              {JAVA_CLASSES.map((cls) => (
                <button
                  key={cls.name}
                  onClick={() => setSelectedJavaClass(cls)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                    selectedJavaClass.name === cls.name
                      ? 'bg-[#00e676] text-black font-semibold'
                      : 'bg-white/5 text-[#c4b5a5] hover:text-white'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>

            {/* File Path & Description */}
            <div className="mb-2 text-xs flex items-center justify-between font-mono text-[#a8998a]">
              <span>Ruta: {selectedJavaClass.path}</span>
              <span className="text-[#f89820]">{selectedJavaClass.description}</span>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-y-auto rounded-lg bg-[#070503] border border-white/10 p-4 font-mono text-xs text-[#00e676]">
              <pre className="whitespace-pre-wrap">{selectedJavaClass.content}</pre>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#a8998a] font-mono">
                Java 21 · Spring Boot 3.4 · Project Loom (Virtual Threads)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyJavaCode}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-1.5"
                >
                  {copiedJava ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJava ? 'Copiado' : 'Copiar Código'}</span>
                </button>
                <button
                  onClick={downloadJavaFile}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#00e676] hover:bg-[#69f0ae] text-black flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar {selectedJavaClass.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm bg-[#140e0a] border border-red-500/40 rounded-2xl p-6 shadow-2xl text-[#f4efe8]">
            <h3 className="text-base font-bold text-red-400 mb-2">
              ¿Eliminar Registro de Asistente?
            </h3>
            <p className="text-xs text-[#c4b5a5] mb-5">
              Esta acción eliminará de forma permanente el asistente ({storageMode.toUpperCase()}).
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-[#a8998a] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Rules Modal */}
      {securityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-[#120d0a] border border-[#00e676]/40 rounded-2xl p-6 shadow-2xl text-[#f4efe8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#00e676]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#fbf7f2]">
                  Reglas de Seguridad & Modelo de Datos
                </h3>
              </div>
              <button onClick={() => setSecurityModalOpen(false)} className="text-[#a8998a] hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#c4b5a5]">
              <div className="p-3.5 rounded-lg bg-[#0a0705] border border-white/5 space-y-2">
                <span className="font-mono text-[#f89820] font-bold block">
                  1. Modelo de Control de Acceso (ABAC & RLS)
                </span>
                <p>
                  En Cloud Firestore las reglas <code className="text-[#00e676]">isValidAttendee(data)</code> validan formato y tamaño. En PostgreSQL se implementan mediante políticas <code className="text-[#00e676]">ROW LEVEL SECURITY (RLS)</code> y constraints en base de datos.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0a0705] border border-white/5 space-y-2">
                <span className="font-mono text-[#00e676] font-bold block">
                  2. Privilegios de Eliminación y Actualización
                </span>
                <p>
                  Solo administradores autenticados o el propietario pueden eliminar registros. En Spring Security se asegura mediante <code className="text-[#00e676]">hasRole(&apos;ADMIN&apos;)</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0a0705] border border-white/5 space-y-2">
                <span className="font-mono text-[#5382a1] font-bold block">
                  3. Inmutabilidad y Auditoría
                </span>
                <p>
                  Cada registro almacena marcas de tiempo <code className="text-[#f89820]">createdAt</code> y <code className="text-[#f89820]">updatedAt</code>. En PostgreSQL se dispara un trigger a la tabla <code className="text-[#f89820]">attendee_audit_log</code>.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSecurityModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-black bg-[#00e676] hover:bg-[#69f0ae] rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
