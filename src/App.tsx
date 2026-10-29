/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EjesTematicos } from './components/EjesTematicos';
import { SpeakersSection } from './components/SpeakersSection';
import { SpeakerModal } from './components/SpeakerModal';
import { AlliancesSection } from './components/AlliancesSection';
import { AgendaSection } from './components/AgendaSection';
import { CrudDashboard } from './components/CrudDashboard';
import { VenueSection } from './components/VenueSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { AuthProvider } from './context/AuthContext';
import { testConnection } from './lib/firebase';
import { Speaker } from './types';
import { Ticket } from 'lucide-react';

export default function App() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    // Validate connection to Firestore on initial boot
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0705] text-[#f4efe8] flex flex-col font-sans selection:bg-[#f89820] selection:text-black">
        {/* Top 3-Zone Bar Contract */}
        <Navbar onOpenRegister={() => setIsRegisterOpen(true)} />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Java & AI Espresso Themed Hero with Code Mesh Grid */}
          <Hero onOpenRegister={() => setIsRegisterOpen(true)} />

          {/* Ejes Temáticos / Core Tracks */}
          <EjesTematicos />

          {/* Ponentes con IntersectionObserver Reveal-on-Scroll (.reveal-card / .revealed) */}
          <SpeakersSection onSelectSpeaker={(speaker) => setSelectedSpeaker(speaker)} />

          {/* Agenda Oficial de 2 Días */}
          <AgendaSection />

          {/* Base de Datos Independiente Persistente · Panel CRUD & Captura de Datos */}
          <CrudDashboard onOpenPublicRegister={() => setIsRegisterOpen(true)} />

          {/* Sección Organizan y Apoyan (Dashed Cards sobre Fondo Dorado/Crema Tenue) */}
          <AlliancesSection />

          {/* Sede UPTC Paraninfo Tunja & Logística */}
          <VenueSection />

          {/* Preguntas Frecuentes */}
          <FaqSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Speaker Abstract & Bio Modal */}
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={() => setSelectedSpeaker(null)}
        />

        {/* Interactive Registration & Virtual Badge Modal with direct persistence */}
        <RegistrationModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
        />

        {/* Floating CTA Pill for Quick Registration */}
        <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2.5 rounded-full bg-[#f89820] text-black font-bold text-xs tracking-wide shadow-xl shadow-[#f89820]/30 hover:bg-[#ffaa3b] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border border-black/10"
          >
            <Ticket className="w-4 h-4" />
            <span>Asegura tu Entrada Libre</span>
          </button>
        </div>
      </div>
    </AuthProvider>
  );
}
