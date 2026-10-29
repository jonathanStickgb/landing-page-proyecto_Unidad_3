import React from 'react';
import { Cpu, Brain, Zap, Globe, Layers, CheckCircle } from 'lucide-react';

export const EjesTematicos: React.FC = () => {
  const ejes = [
    {
      number: '01',
      title: 'Concurrencia Masiva & Virtual Threads',
      description: 'Dominando Project Loom en Java 25. Cómo gestionar millones de tareas en paralelo con Scoped Values y Structured Concurrency reduciendo la huella de memoria.',
      topics: ['Virtual Threads vs Platform Threads', 'Scoped Values en APIs de alta concurrencia', 'Benchmark y tuning de Garbage Collection (ZGC)'],
      icon: Cpu,
      accentColor: 'text-[#f89820]',
      borderColor: 'border-[#f89820]/30'
    },
    {
      number: '02',
      title: 'LLMs & Orquestación con Spring AI y LangChain4j',
      description: 'El puente nativo entre modelos fundacionales de última generación y la robustez empresarial de Spring Boot 3.4 y Quarkus sin cambiar a stacks heterogéneos.',
      topics: ['Function Calling tipado con Java Records', 'RAG reactivo con Vector Stores (Qdrant & Milvus)', 'Evaluación de pipelines de inferencia local y cloud'],
      icon: Brain,
      accentColor: 'text-[#00e676]',
      borderColor: 'border-[#00e676]/30'
    },
    {
      number: '03',
      title: 'GraalVM Native Image & Arquitecturas Serverless',
      description: 'Tiempos de arranque en menos de 15 milisegundos y consumo de memoria inferior a 35MB para contenedores en Kubernetes y funciones serverless.',
      topics: ['Compilación Ahead-of-Time (AOT)', 'Reflexión y Reachability Metadata', 'Empaquetado mínimo en distroless containers'],
      icon: Zap,
      accentColor: 'text-[#5382a1]',
      borderColor: 'border-[#5382a1]/30'
    },
    {
      number: '04',
      title: 'Inteligencia Artificial y Desarrollo Regional Boyacá',
      description: 'Investigación aplicada nacida en la UPTC y casos de impacto real en la agroindustria, salud y ciudades inteligentes del altiplano cundiboyacense.',
      topics: ['Modelos de predicción agrometeorológica en Boyacá', 'Transferencia de conocimiento UPTC a la industria', 'Formación de talento especializado en la región'],
      icon: Globe,
      accentColor: 'text-[#ffb74d]',
      borderColor: 'border-[#ffb74d]/30'
    }
  ];

  return (
    <section id="ejes" className="py-24 bg-[#0d0906] relative border-t border-[#f89820]/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16 max-w-3xl">
          <span className="text-xs font-mono text-[#f89820] tracking-wider uppercase mb-2">
            Tracks Académicos & Técnicos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fbf7f2] tracking-tight mb-4">
            Los pilares de la ingeniería de software moderna
          </h2>
          <p className="text-base text-[#c4b5a5]">
            Contenido curado por el comité académico de la Escuela de Sistemas UPTC y líderes de la industria para cerrar la brecha entre la teoría y la producción real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ejes.map((eje) => {
            const Icon = eje.icon;
            return (
              <div
                key={eje.number}
                className={`p-8 rounded-xl bg-[#120d09] border ${eje.borderColor} transition-all duration-300 hover:bg-[#18110c] hover:-translate-y-1 shadow-lg shadow-black/30 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold font-mono text-white/30">
                      {eje.number}.
                    </span>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <Icon className={`w-5 h-5 ${eje.accentColor}`} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#fbf7f2] mb-3">
                    {eje.title}
                  </h3>
                  <p className="text-sm text-[#c4b5a5] leading-relaxed mb-6">
                    {eje.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/5 space-y-2">
                  {eje.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#a8998a]">
                      <span className={`text-sm leading-none ${eje.accentColor}`}>›</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
