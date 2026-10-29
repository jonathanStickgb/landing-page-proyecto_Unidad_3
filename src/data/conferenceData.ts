import { Speaker, Alliance, AgendaItem } from '../types';

export const SPEAKERS: Speaker[] = [
  {
    id: 'carlos-mendoza',
    name: 'Carlos Mendoza',
    role: 'Principal Cloud Architect & Java Champion',
    company: 'Oracle Groundbreaker Ambassador / JUG Lead',
    bio: 'Pionero en la adopción de Java en América Latina con más de 18 años de experiencia en arquitecturas de misión crítica. Miembro activo del Java Community Process (JCP) e impulsor del Project Loom.',
    talkTitle: 'Virtual Threads & Java 25: Re-arquitectando la Concurrencia Masiva',
    talkSummary: 'Análisis profundo de la evolución de Virtual Threads (Loom), Structured Concurrency y Scoped Values en aplicaciones que procesan más de 100k requests simultáneas con consumo mínimo de memoria.',
    track: 'java',
    trackLabel: 'Core Java & Concurrencia',
    image: '/src/assets/images/speaker_portrait_carlos_1793162460213.jpg',
    codeSnippet: 'Thread.ofVirtual().name("loom-worker").start(task);',
    badges: ['Java Champion', 'Keynote Speaker', 'JCP Contributor'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    featured: true
  },
  {
    id: 'valeria-gomez',
    name: 'Ing. Valeria Gómez',
    role: 'Staff AI Systems Architect',
    company: 'Lead LangChain4j Contributor',
    bio: 'Especialista en integración de Large Language Models y arquitecturas RAG empresariales sobre el ecosistema Java. Autora de librerías para streaming de tokens en microservicios reactivos.',
    talkTitle: 'Modelos Fundacionales y LLMs en la JVM con LangChain4j & Spring AI',
    talkSummary: 'Cómo construir agentes de razonamiento autónomo, pipelines RAG deterministas y evaluación de prompts directamente sobre Spring Boot 3.4 y la JVM sin depender de scripts aislados de Python.',
    track: 'ai',
    trackLabel: 'IA Generativa & LangChain4j',
    image: '/src/assets/images/speaker_portrait_valeria_1793162460108.jpg',
    codeSnippet: 'AiServices.builder(Agent.class).chatModel(gemini).build();',
    badges: ['AI Architect', 'Spring AI', 'Open Source'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    featured: true
  },
  {
    id: 'sofia-rincon',
    name: 'Dra. Sofía Rincón',
    role: 'Directora de Computación Inteligente UPTC',
    company: 'UPTC Tunja / Grupo de Investigación SInC',
    bio: 'Doctora en Ciencias de la Computación con posdoctorado en Redes Neuronales Distribuidas. Lidera el observatorio tecnológico de Boyacá y proyectos de machine learning aplicado a la agroindustria y salud regional.',
    talkTitle: 'Agentes Autónomos y Machine Learning en la JVM para la Región',
    talkSummary: 'Estrategias de despliegue de modelos locales (quantized ONNX y TensorFlow Java) en centros de cómputo universitarios y aplicaciones agroindustriales en Boyacá.',
    track: 'ai',
    trackLabel: 'IA Regional & Academia UPTC',
    image: '/src/assets/images/speaker_portrait_sofia_1793162460921.jpg',
    codeSnippet: 'INDArray tensor = Nd4j.create(new float[]{0.92f, 0.15f});',
    badges: ['Investigadora UPTC', 'PhD en IA', 'Líder Científica'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    featured: true
  },
  {
    id: 'diego-albarracin',
    name: 'Diego F. Albarracín',
    role: 'Staff Platform Engineer',
    company: 'Co-Fundador Boyacá Devs',
    bio: 'Egresado de la UPTC radicado en Tunja, con más de 12 años optimizando arquitecturas Kubernetes y GraalVM Native Image para fintechs de alto volumen transaccional en Latinoamérica.',
    talkTitle: 'De Spring Boot a GraalVM Native: Cold Starts en < 15ms',
    talkSummary: 'Deconstrucción paso a paso de la compilación Ahead-Of-Time (AOT), análisis de alcanzabilidad estática, serialización y empaquetado ultraliviano para Serverless en AWS y GCP.',
    track: 'cloud',
    trackLabel: 'GraalVM & Cloud Native',
    image: '',
    codeSnippet: 'native-image -O3 --enable-preview -jar service.jar',
    badges: ['Boyacá Devs', 'GraalVM Specialist', 'Alumni UPTC'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'andrea-parra',
    name: 'Andrea Parra',
    role: 'Senior Data Platform Lead',
    company: 'Globant / Apache Kafka Speaker',
    bio: 'Arquitecta de datos especializada en streaming en tiempo real y bases vectoriales como Qdrant y Milvus con conectores Java de baja latencia.',
    talkTitle: 'Pipelines de RAG de Alta Disponibilidad con Java y Vector DBs',
    talkSummary: 'Patrones de ingesta continua, chunking semántico distribuido con Apache Kafka y búsqueda de similitud coseno de sub-milisegundo para asistentes virtuales a escala empresarial.',
    track: 'ai',
    trackLabel: 'Vector DBs & RAG Empresarial',
    image: '',
    codeSnippet: 'vectorStore.similaritySearch(EmbeddingRequest.of(query));',
    badges: ['Apache Kafka', 'Vector Databases', 'Data Architect'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'mateo-cardenas',
    name: 'Mateo Cárdenas',
    role: 'Principal Security Researcher',
    company: 'JUG Colombia Core Team',
    bio: 'Investigador en ciberseguridad enfocado en la cadena de suministro de software en la JVM, OpenSSF Scorecards y mitigación de inyecciones semánticas en sistemas con agentes LLM.',
    talkTitle: 'Zero-Trust y Hardening en Aplicaciones Java con IA Integrada',
    talkSummary: 'Cómo auditar librerías maven, aislar execution environments para herramientas llamadas por agentes LLM y blindar APIs contra ataques de prompt injection indirecto.',
    track: 'java',
    trackLabel: 'Ciberseguridad & JVM',
    image: '',
    codeSnippet: 'SecurityManager.checkPermission(new RuntimePermission(...));',
    badges: ['JUG Colombia', 'Cybersecurity', 'JVM Security'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  }
];

export const ALLIANCES: Alliance[] = [
  {
    id: 'uptc',
    name: 'UPTC - Universidad Pedagógica y Tecnológica de Colombia',
    type: 'organizador',
    typeLabel: 'Organizador Principal y Sede Académica',
    shortDesc: 'Facultad de Ingeniería · Escuela de Ingeniería de Sistemas y Computación',
    fullDesc: 'Principal casa de estudios superiores de Boyacá y anfitriona del evento. Con más de 70 años de liderazgo académico, la Escuela de Sistemas es cuna del talento tecnológico del departamento.',
    location: 'Tunja, Boyacá',
    website: 'https://www.uptc.edu.co',
    iconType: 'uptc'
  },
  {
    id: 'boyaca-devs',
    name: 'Boyacá Devs Community',
    type: 'organizador',
    typeLabel: 'Comunidad Organizadora Co-Anfitriona',
    shortDesc: 'Red de desarrolladores, ingenieros y entusiastas de Tunja, Duitama y Sogamoso',
    fullDesc: 'Comunidad técnica independiente fundada en Boyacá con más de 2,400 miembros activos. Promueve meetups presenciales, talleres de programación abierta y hackathons de impacto local.',
    location: 'Tunja / Duitama / Sogamoso',
    website: 'https://boyacadevs.org',
    iconType: 'boyaca'
  },
  {
    id: 'jug-colombia',
    name: 'Java Community Colombia (JUG Colombia)',
    type: 'organizador',
    typeLabel: 'Comunidad Nacional Oficial de Java',
    shortDesc: 'Java User Group certificado por el Java Community Process (JCP)',
    fullDesc: 'El grupo de usuarios Java oficial de Colombia. Nuclea a los profesionales, Java Champions y entusiastas del país, llevando conferencias técnicas y conocimiento de vanguardia en la JVM.',
    location: 'Colombia / Presencia Nacional',
    website: 'https://jugcolombia.org',
    iconType: 'jug'
  },
  {
    id: 'ai-colombia',
    name: 'AI Colombia Network',
    type: 'comunidad',
    typeLabel: 'Comunidad de Apoyo en Inteligencia Artificial',
    shortDesc: 'Red nacional de investigadores, ingenieros de Machine Learning y practicantes de IA',
    fullDesc: 'Conecta a laboratorios universitarios e ingenieros de industria para la difusión ética, técnica y aplicada de modelos de lenguaje, visión por computador y robótica en Colombia.',
    location: 'Bogotá / Red Nacional',
    website: 'https://aicolombia.org',
    iconType: 'ai'
  },
  {
    id: 'tunja-tech',
    name: 'Tunja Tech & Innovation Guild',
    type: 'comunidad',
    typeLabel: 'Comunidad de Apoyo Local',
    shortDesc: 'Gremio de startups, desarrolladores y creadores digitales de la capital boyacense',
    fullDesc: 'Espacio de colaboración técnica y mentoría que impulsa el emprendimiento de base tecnológica y el empleo remoto de alto valor desde Tunja.',
    location: 'Tunja, Boyacá',
    website: 'https://tunjatech.co',
    iconType: 'code'
  },
  {
    id: 'semillero-sinc',
    name: 'Semillero SInC - Inteligencia Computacional UPTC',
    type: 'academico',
    typeLabel: 'Aliado Académico de Investigación',
    shortDesc: 'Grupo estudiantil de investigación adscrito a la Facultad de Ingeniería',
    fullDesc: 'Semillero enfocado en el desarrollo de algoritmos genéticos, visión computacional y modelos de inferencia para resolución de problemas agrícolas y logísticos en Boyacá.',
    location: 'UPTC Tunja',
    website: 'https://www.uptc.edu.co/investigacion',
    iconType: 'code'
  },
  {
    id: 'andes-cloud',
    name: 'Andes Cloud Systems & JVM Labs',
    type: 'sponsor',
    typeLabel: 'Patrocinador Tecnológico Oro',
    shortDesc: 'Infraestructura cloud de alta disponibilidad y consultoría de modernización',
    fullDesc: 'Proveedor de soluciones empresariales sobre Kubernetes y Java moderno en Colombia, patrocinador del streaming y acreditaciones del evento.',
    location: 'Colombia',
    website: 'https://andescloud.example.com',
    iconType: 'cloud'
  },
  {
    id: 'boyaca-tech-hub',
    name: 'Boyacá Tech Hub Innovation',
    type: 'sponsor',
    typeLabel: 'Patrocinador del Ecosistema de Innovación',
    shortDesc: 'Aceleradora y espacio de co-working tecnológico en el centro de Tunja',
    fullDesc: 'Impulsa proyectos juveniles y ofrece becas para estudiantes sobresalientes de la UPTC para acceder a certificaciones internacionales de Java y Cloud.',
    location: 'Tunja, Boyacá',
    website: 'https://boyacatechhub.co',
    iconType: 'boyaca'
  }
];

export const AGENDA_ITEMS: AgendaItem[] = [
  // Día 1
  {
    id: 'd1-1',
    day: 1,
    time: '08:00 - 08:45',
    title: 'Acreditación, Entrega de Escarapelas y Café Espresso Boyacense',
    speakerName: 'Comité Organizador UPTC & Boyacá Devs',
    speakerRole: 'Recepción en el Hall Paraninfo',
    room: 'Hall Central San Jerónimo UPTC',
    track: 'general',
    description: 'Registro presencial, networking matutino y degustación de café especial de la cordillera oriental.'
  },
  {
    id: 'd1-2',
    day: 1,
    time: '08:45 - 09:15',
    title: 'Acto de Apertura: El Rol de Boyacá en el Futuro del Software y la IA en Colombia',
    speakerName: 'Decanatura de Ingeniería UPTC & Boyacá Devs',
    speakerRole: 'Apertura Institucional',
    room: 'Auditorio Paraninfo Central',
    track: 'general',
    description: 'Palabras de bienvenida institucional, metas de innovación regional y presentación de los dos días de conferencias.'
  },
  {
    id: 'd1-3',
    day: 1,
    time: '09:15 - 10:15',
    title: 'Keynote Magistral: Virtual Threads & Java 25: Re-arquitectando la Concurrencia Masiva',
    speakerName: 'Carlos Mendoza',
    speakerRole: 'Principal Cloud Architect & Java Champion',
    room: 'Auditorio Paraninfo Central',
    track: 'java',
    description: 'De hilos del kernel a millones de Virtual Threads. Patrones de Structured Concurrency y benchmark en vivo.'
  },
  {
    id: 'd1-4',
    day: 1,
    time: '10:30 - 11:30',
    title: 'De Spring Boot a GraalVM Native Image: Cold Starts en < 15ms',
    speakerName: 'Diego F. Albarracín',
    speakerRole: 'Staff Platform Engineer & Boyacá Devs',
    room: 'Auditorio Paraninfo Central',
    track: 'java',
    description: 'Optimización de consumo de memoria y ejecución Serverless con AOT en Kubernetes.'
  },
  {
    id: 'd1-5',
    day: 1,
    time: '11:45 - 12:45',
    title: 'Zero-Trust y Hardening en Aplicaciones Java con IA Integrada',
    speakerName: 'Mateo Cárdenas',
    speakerRole: 'Principal Security Researcher · JUG Colombia',
    room: 'Auditorio Paraninfo Central',
    track: 'java',
    description: 'Aislamiento de memoria, sandbox para tools de LLMs y seguridad en la cadena de dependencias Maven.'
  },
  {
    id: 'd1-6',
    day: 1,
    time: '14:00 - 16:30',
    title: 'Workshop Práctico: Concurrencia Extrema en Java 25 Hands-on',
    speakerName: 'Carlos Mendoza & Mentores JUG Colombia',
    speakerRole: 'Taller de Laboratorio',
    room: 'Laboratorio de Computación 3 · Edificio Central UPTC',
    track: 'java',
    description: 'Sesión interactiva en terminal: migración de un microservicio reactivo a hilos virtuales y Scoped Values.'
  },
  // Día 2
  {
    id: 'd2-1',
    day: 2,
    time: '08:30 - 09:00',
    title: 'Apertura Día 2: Eje Temático Inteligencia Artificial Generativa',
    speakerName: 'Comité Científico SInC UPTC',
    speakerRole: 'Introducción al Track',
    room: 'Auditorio Paraninfo Central',
    track: 'general',
    description: 'Visión general de las ponencias de IA, orquestación de LLMs y aplicaciones a la industria boyacense.'
  },
  {
    id: 'd2-2',
    day: 2,
    time: '09:00 - 10:15',
    title: 'Keynote: Modelos Fundacionales y LLMs en la JVM con LangChain4j & Spring AI',
    speakerName: 'Ing. Valeria Gómez',
    speakerRole: 'Staff AI Systems Architect',
    room: 'Auditorio Paraninfo Central',
    track: 'ai',
    description: 'Construcción de agentes inteligentes, function calling tipado y streaming reactivo en Java moderno.'
  },
  {
    id: 'd2-3',
    day: 2,
    time: '10:30 - 11:30',
    title: 'Pipelines de RAG de Alta Disponibilidad con Java y Vector DBs',
    speakerName: 'Andrea Parra',
    speakerRole: 'Senior Data Platform Lead · Globant',
    room: 'Auditorio Paraninfo Central',
    track: 'ai',
    description: 'Integración de Qdrant y Milvus con clientes Java de alto rendimiento para búsqueda semántica empresarial.'
  },
  {
    id: 'd2-4',
    day: 2,
    time: '11:45 - 12:45',
    title: 'Agentes Autónomos y Machine Learning en la JVM para la Transformación Regional',
    speakerName: 'Dra. Sofía Rincón',
    speakerRole: 'Directora de Computación Inteligente UPTC',
    room: 'Auditorio Paraninfo Central',
    track: 'ai',
    description: 'Casos reales de inferencia local en Boyacá: predicción de heladas y optimización de cadenas agrícolas.'
  },
  {
    id: 'd2-5',
    day: 2,
    time: '14:00 - 17:00',
    title: 'Mini-Hackathon & Taller: Construye tu Primer Agente de IA en Java',
    speakerName: 'Valeria Gómez, Dra. Sofía Rincón & Mentores Boyacá Devs',
    speakerRole: 'Hackathon con Premios de la Industria',
    room: 'Auditorio Paraninfo & Salas de Cómputo',
    track: 'ai',
    description: 'Reto práctico en equipos: implementar un asistente RAG usando LangChain4j y Spring AI con APIs de Gemini.'
  }
];

export const FAQS = [
  {
    q: '¿El evento Java & AI Day Boyacá 2026 tiene costo de entrada?',
    a: 'No, el evento es 100% gratuito tanto en su modalidad presencial en el Paraninfo de la UPTC como en streaming. Sin embargo, el aforo del auditorio es limitado a 450 personas, por lo que se requiere registro previo y confirmación de escarapela digital.'
  },
  {
    q: '¿Quiénes pueden asistir?',
    a: 'Está abierto a estudiantes universitarios de ingeniería de sistemas y carreras afines, desarrolladores de software de Boyacá y de todo el país, docentes, investigadores y profesionales de la industria tech.'
  },
  {
    q: '¿Se entrega certificado de asistencia institucional?',
    a: 'Sí. La Facultad de Ingeniería de la UPTC junto con Boyacá Devs y JUG Colombia expedirán un certificado oficial de participación académica con código de verificación QR para quienes completen al menos el 80% de asistencia.'
  },
  {
    q: '¿Qué necesito para los workshops prácticos del laboratorio?',
    a: 'Tu computador portátil con JDK 21+ instalado (recomendamos JDK 25 EA o Corretto 21), tu IDE de preferencia (IntelliJ IDEA, VS Code con Java Extension Pack o Eclipse) y Docker instalado para levantar bases de datos vectoriales locales.'
  },
  {
    q: '¿Cómo llegar a la sede en Tunja?',
    a: 'La cita es en el Auditorio Paraninfo San Jerónimo de la UPTC, Campus Central (Avenida Central del Norte # 39-115, Tunja). Desde el Terminal de Transportes de Tunja se llega en 10 minutos en taxi o bus urbano. Tunja está a 2.810 msnm, por lo que recomendamos llevar abrigo para la tarde-noche.'
  }
];
