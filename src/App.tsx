import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  Gem,
  Edit3,
  Home,
  BookOpen,
  Gamepad2,
  Pencil,
  Award,
  BarChart2,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  Smile,
  Trophy,
  Trash2,
  Eraser,
  Sparkles,
  ArrowRight,
  Brain,
  Search,
  Lock,
  Star,
  Timer,
  XCircle,
  Eye,
  EyeOff,
  Download,
  Palette,
  Glasses,
  Crown,
  User,
  Ghost,
  HardHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

import Groq from "groq-sdk";

// --- Types ---
type Section = 'home' | 'lessons' | 'games' | 'blackboard' | 'badges' | 'progress' | 'parents' | 'avatar';

interface AvatarConfig {
  color: string;
  accessory: 'none' | 'glasses' | 'crown' | 'hat';
  expression: 'smile' | 'cool' | 'wink' | 'surprised';
}

interface Badge {
  id: string;
  name: string;
  iconId: string;
  unlocked: boolean;
  description: string;
}

// --- Helpers ---
const getBadgeIcon = (iconId: string, className = "w-6 h-6") => {
  switch (iconId) {
    case 'target': return <Target className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'award': return <Award className={className} />;
    case 'pencil': return <Pencil className={className} />;
    default: return <Award className={className} />;
  }
};

// --- Avatar Helper ---
const AvatarDisplay = ({ config, className = "w-10 h-10" }: { config: AvatarConfig, className?: string }) => {
  return (
    <div className={`${className} rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg border-2 border-white/20`} style={{ backgroundColor: config.color }}>
      {/* Accessory */}
      {config.accessory === 'crown' && <Crown className="absolute -top-1 w-1/2 h-1/2 text-yellow-400 fill-yellow-400 z-10" />}
      {config.accessory === 'glasses' && <Glasses className="absolute top-1/3 w-3/4 h-1/4 text-black z-10" />}
      {config.accessory === 'hat' && <HardHat className="absolute -top-2 w-1/2 h-1/2 text-amber-600 fill-amber-600 z-10" />}

      {/* Expression */}
      {config.expression === 'smile' && <Smile className="w-3/4 h-3/4 text-white" />}
      {config.expression === 'cool' && <Smile className="w-3/4 h-3/4 text-white" />} {/* Could be different icon */}
      {config.expression === 'wink' && <Smile className="w-3/4 h-3/4 text-white" />}
      {config.expression === 'surprised' && <Smile className="w-3/4 h-3/4 text-white" />}

      {!['smile', 'cool', 'wink', 'surprised'].includes(config.expression) && <Smile className="w-3/4 h-3/4 text-white" />}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(5);
  const [dailyGoal, setDailyGoal] = useState(500);
  const [isSaving, setIsSaving] = useState(false);
  const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    color: '#10B981',
    accessory: 'none',
    expression: 'smile'
  });
  const [lessons, setLessons] = useState([
    {
      id: 'fractions-1',
      title: 'Fracciones Nivel 1',
      topic: 'Fracciones',
      level: 1,
      completed: true,
      steps: [
        {
          title: "¿Qué es una fracción?",
          text: "Imagina una pizza deliciosa. Si la cortas en 2 partes iguales, cada parte es una fracción.",
          simplified: "Una fracción es solo una parte de algo completo. ¡Como un trozo de pastel!",
          visual: "🍕 ➡️ 🍕/2"
        },
        {
          title: "El Numerador",
          text: "Es el número de arriba. Nos dice cuántas partes tomamos de la pizza.",
          simplified: "El número de arriba es cuántos trozos te vas a comer.",
          visual: "1 / 2 (El 1 es el numerador)"
        },
        {
          title: "El Denominador",
          text: "Es el número de abajo. Nos dice en cuántas partes iguales cortamos la pizza.",
          simplified: "El número de abajo es en cuántos trozos cortamos la pizza entera.",
          visual: "1 / 2 (El 2 es el denominador)"
        }
      ],
      practice: {
        question: "Si cortamos una pizza en 4 trozos iguales y te comes 1 trozo... ¿Cuál es el denominador?",
        correctAnswer: "4"
      }
    },
    {
      id: 'sums-1',
      title: 'Sumas Divertidas',
      topic: 'Aritmética',
      level: 1,
      completed: true,
      steps: [
        { title: "Sumar es Juntar", text: "Si tienes 2 manzanas y te regalan 1 más, ahora tienes 3.", simplified: "Poner cosas juntas para tener más.", visual: "🍎🍎 + 🍎 = 🍎🍎🍎" }
      ],
      practice: { question: "¿Cuánto es 3 + 2?", correctAnswer: "5" }
    },
    {
      id: 'multi-1',
      title: 'Multiplicación Veloz',
      topic: 'Aritmética',
      level: 2,
      completed: false,
      steps: [
        { title: "Sumas Repetidas", text: "2 x 3 es lo mismo que sumar 2 tres veces: 2+2+2.", simplified: "Sumar el mismo número varias veces.", visual: "2 x 3 = 6" }
      ],
      practice: { question: "¿Cuánto es 4 x 2?", correctAnswer: "8" }
    }
  ]);
  // ... rest of state

  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Súper Foco', iconId: 'target', unlocked: true, description: 'Completaste 5 lecciones sin distraerte.' },
    { id: '2', name: 'Velocista', iconId: 'zap', unlocked: true, description: 'Resolviste 10 problemas en menos de 1 minuto.' },
    { id: '3', name: 'Maestro de Fracciones', iconId: 'award', unlocked: false, description: 'Domina el nivel 3 de fracciones.' },
    { id: '4', name: 'Pizarra Creativa', iconId: 'pencil', unlocked: true, description: 'Usaste la pizarra para resolver un problema difícil.' },
  ]);

  const addXp = (amount: number) => {
    setXp(prev => {
      const newXp = prev + amount;
      const nextLevelThreshold = level * 500;
      if (newXp >= nextLevelThreshold) {
        setLevel(l => l + 1);
        return newXp - nextLevelThreshold;
      }
      return newXp;
    });
  };

  // --- Badge Logic ---
  useEffect(() => {
    const checkBadges = () => {
      let updated = false;
      const newBadges = badges.map(badge => {
        if (badge.unlocked) return badge;

        let shouldUnlock = false;
        if (badge.id === '1') { // Súper Foco: 5 lessons
          const completedCount = lessons.filter((l: any) => l.completed).length;
          if (completedCount >= 5) shouldUnlock = true;
        }
        if (badge.id === '2') { // Velocista: Level 5
          if (level >= 5) shouldUnlock = true;
        }
        if (badge.id === '3') { // Maestro de Fracciones
          const completedFractions = lessons.filter((l: any) => l.completed && l.topic.toLowerCase().includes('fracciones')).length;
          if (completedFractions >= 2) shouldUnlock = true;
        }
        if (badge.id === '4') { // Pizarra Creativa: Level 3
          if (level >= 3) shouldUnlock = true;
        }

        if (shouldUnlock) {
          updated = true;
          return { ...badge, unlocked: true };
        }
        return badge;
      });

      if (updated) {
        setBadges(newBadges);
      }
    };

    checkBadges();
  }, [lessons, level]);

  // --- Persistence ---
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        if (data) {
          setXp(data.xp);
          setLevel(data.level);
          if (data.badges && data.badges.length > 0) setBadges(data.badges);
          if (data.lessons && data.lessons.length > 0) setLessons(data.lessons);
          if (data.avatarConfig) setAvatarConfig(data.avatarConfig);
          if (data.dailyGoal) setDailyGoal(data.dailyGoal);
        }
      } catch (e) {
        console.error("Error fetching progress:", e);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      setIsSaving(true);
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ xp, level, badges, lessons, avatarConfig, dailyGoal })
        });
      } catch (e) {
        console.error("Error saving progress:", e);
      } finally {
        setTimeout(() => setIsSaving(false), 1000);
      }
    };

    const timeout = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timeout);
  }, [xp, level, badges, lessons, avatarConfig, dailyGoal]);

  return (
    <div className="flex h-screen bg-roblox-bg forest-bg overflow-hidden font-sans">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden print:overflow-visible">
        <TopBar xp={xp} level={level} isSaving={isSaving} avatarConfig={avatarConfig} setActiveSection={setActiveSection} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar print:overflow-visible print:p-0">
          <AnimatePresence mode="wait">
            {activeSection === 'home' && <HomeSection key="home" setActiveSection={setActiveSection} xp={xp} level={level} badges={badges} lessons={lessons} avatarConfig={avatarConfig} />}
            {activeSection === 'lessons' && <LessonsSection key="lessons" addXp={addXp} level={level} lessons={lessons} setLessons={setLessons} />}
            {activeSection === 'games' && <GamesSection key="games" addXp={addXp} />}
            {activeSection === 'blackboard' && <BlackboardSection key="blackboard" addXp={addXp} />}
            {activeSection === 'badges' && <BadgesSection key="badges" badges={badges} />}
            {activeSection === 'avatar' && <AvatarSection key="avatar" config={avatarConfig} setConfig={setAvatarConfig} />}
            {activeSection === 'progress' && <ProgressSection key="progress" xp={xp} level={level} lessons={lessons} />}
            {activeSection === 'parents' && (
              <ParentsSection
                key="parents"
                lessons={lessons}
                xp={xp}
                dailyGoal={dailyGoal}
                setDailyGoal={setDailyGoal}
                isAuthenticated={isParentAuthenticated}
                setIsAuthenticated={setIsParentAuthenticated}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- TopBar Component ---
const TopBar = ({ xp, level, isSaving, avatarConfig, setActiveSection }: any) => {
  return (
    <header className="h-14 roblox-glass flex items-center justify-between px-6 z-30 border-b border-white/10 print:hidden">
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-white/10 rounded-md transition-colors group">
          <div className="w-6 h-1 bg-white mb-1 rounded-full group-hover:bg-roblox-blue transition-colors" />
          <div className="w-6 h-1 bg-white mb-1 rounded-full group-hover:bg-roblox-blue transition-colors" />
          <div className="w-6 h-1 bg-white rounded-full group-hover:bg-roblox-blue transition-colors" />
        </button>
        <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-xl border border-white/10 shadow-inner">
          <Gem className="w-4 h-4 text-roblox-blue fill-roblox-blue" />
          <span className="text-white font-black text-sm tracking-tight">{xp} XP 💎</span>
        </div>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-white/50 font-black uppercase tracking-widest flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 animate-spin" />
            Guardando...
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-xl border border-white/10 shadow-inner">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-black text-sm tracking-tight">NIVEL {level} ✨</span>
        </div>
        <button
          onClick={() => setActiveSection('avatar')}
          className="hover:scale-105 transition-transform"
        >
          <AvatarDisplay config={avatarConfig} className="w-10 h-10" />
        </button>
      </div>
    </header>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed }: any) => {
  const menuItems = [
    { id: 'home', label: 'Bosque', icon: <Home className="w-5 h-5" /> },
    { id: 'avatar', label: 'Mi Avatar', icon: <User className="w-5 h-5" /> },
    { id: 'lessons', label: 'Sabiduría', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'games', label: 'Desafíos', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'blackboard', label: 'Pizarra Mágica', icon: <Edit3 className="w-5 h-5" /> },
    { id: 'badges', label: 'Tesoros', icon: <Award className="w-5 h-5" /> },
    { id: 'progress', label: 'Evolución', icon: <Users className="w-5 h-5" /> },
    { id: 'parents', label: 'Guardianes', icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <motion.aside
      animate={{ x: isCollapsed ? -280 : 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed md:relative top-0 left-0 h-full bg-roblox-dark w-[280px] z-40 shadow-2xl flex flex-col print:hidden"
    >
      <div className="h-12 flex items-center px-6 border-b border-white/5">
        <span className="text-white font-black text-lg tracking-tight">ZOE.PEHR-Web</span>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              if (window.innerWidth < 768) setIsCollapsed(true);
            }}
            className={`w-full flex items-center gap-4 p-3 rounded-md transition-all group ${activeSection === item.id
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <div className={`shrink-0 transition-transform group-hover:scale-110 ${activeSection === item.id ? 'text-roblox-blue' : 'text-pastel-blue'}`}>
              {item.icon}
            </div>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
            <Smile className="w-8 h-8 text-roblox-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">Jugador_Pro</div>
            <div className="text-gray-500 text-xs">En línea</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

// --- Home Section ---
const HomeSection = ({ setActiveSection, xp, level, badges, lessons, avatarConfig }: any) => {
  const completedCount = lessons.filter((l: any) => l.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Hero */}
      <div className="roblox-card relative overflow-hidden group bg-gradient-to-br from-white to-roblox-blue/5">
        <div className="absolute inset-0 bg-gradient-to-r from-roblox-blue/10 to-transparent pointer-events-none" />
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-roblox-blue/10 text-roblox-blue rounded-md text-xs font-black uppercase tracking-wider mb-6 border border-roblox-blue/20">
              <Zap className="w-3 h-3 fill-roblox-blue" />
              <span>Nivel {level} ✨</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-roblox-dark leading-tight mb-6 uppercase tracking-tight">
              ¡Hola de nuevo, Explorador! 🌲💎
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md font-bold">
              ¡Tu aventura en el Bosque Esmeralda continúa! Has dominado {completedCount} secretos matemáticos. 🍃✨
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveSection('lessons')}
                className="roblox-button-blue text-lg px-8 py-4 uppercase tracking-widest"
              >
                <Play className="w-5 h-5 fill-white" />
                Jugar Ahora 🚀
              </button>
              <button
                onClick={() => setActiveSection('avatar')}
                className="roblox-button-white text-lg px-8 py-4 uppercase tracking-widest"
              >
                <User className="w-5 h-5" />
                Avatar 🎨
              </button>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="w-72 h-72 mx-auto bg-white rounded-2xl flex items-center justify-center relative shadow-inner border-4 border-roblox-blue/20 overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <AvatarDisplay config={avatarConfig} className="w-48 h-48" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1 rounded-md shadow-sm border border-roblox-blue/20 font-black text-xs text-roblox-blue uppercase tracking-widest">
                Avatar Nivel {level} 🌟
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="roblox-card p-6 bg-white border-pastel-blue/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Experiencia 💎</h3>
            <BarChart2 className="text-roblox-blue w-5 h-5" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-black">
              <span className="text-roblox-dark uppercase tracking-tight">Nivel {level}</span>
              <span className="text-roblox-blue">{xp} / {level * 500} XP</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xp / (level * 500)) * 100}%` }}
                className="h-full bg-roblox-blue"
              />
            </div>
          </div>
        </div>

        <div className="roblox-card p-6 bg-white border-pastel-purple/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Medallas 🏅</h3>
            <Trophy className="text-yellow-500 w-5 h-5" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {badges.filter((b: any) => b.unlocked).slice(0, 5).map((badge: any) => (
              <div key={badge.id} className="w-10 h-10 bg-pastel-purple/10 border border-pastel-purple/20 text-purple-600 rounded-md flex items-center justify-center shadow-sm" title={badge.name}>
                {getBadgeIcon(badge.iconId, "w-5 h-5")}
              </div>
            ))}
            <button
              onClick={() => setActiveSection('badges')}
              className="w-10 h-10 bg-gray-100 text-gray-400 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-roblox-dark p-6 rounded-xl shadow-sm text-white relative overflow-hidden border border-white/5">
          <Sparkles className="absolute -top-4 -right-4 w-20 h-20 text-white/5" />
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Reto del Bosque 🌲✨</h3>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed font-bold">
            ¡Resuelve 3 multiplicaciones para ganar una esmeralda rara! 💎🔥
          </p>
          <button
            onClick={() => setActiveSection('blackboard')}
            className="w-full py-2 bg-roblox-blue text-white font-black text-sm rounded-md hover:brightness-110 transition-colors uppercase tracking-widest"
          >
            Ir a Reto 🚀
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Lessons Section ---
const LessonsSection = ({ addXp, level, lessons, setLessons }: any) => {
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState(0);
  const [isSimplified, setIsSimplified] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const generateLessonWithAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const topic = aiTopic.trim();
    if (!topic) return;

    setIsGenerating(true);
    setShowAiInput(false);
    setAiTopic('');
    console.log("Iniciando generación de lección para:", topic);

    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("API Key de Groq no configurada.");
      }

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const scenarios = ["el espacio exterior con astronautas", "una jungla mágica con animales parlantes", "un castillo de Minecraft con dragones", "una ciudad submarina de sirenas", "un laboratorio secreto de superhéroes", "una pizzería robótica", "un bosque encantado con gnomos", "un mundo de dinosaurios velocistas", "una carrera de autos voladores"];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      const seed = Math.floor(Math.random() * 100000);

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: `Genera una lección de matemáticas TOTALMENTE ÚNICA y NUEVA para niños de primaria sobre el tema: "${topic}". 
        Contextualiza toda la teoría y la práctica en el siguiente escenario interactivo: "${randomScenario}". 
        Usa números al azar (variante: ${seed}) y no repitas historias de sesiones anteriores.
        La respuesta debe ser un objeto JSON con esta estructura exacta:
        {
          "id": "string único",
          "title": "Título divertido (incluye el escenario)",
          "topic": "Tema general",
          "level": 1,
          "completed": false,
          "steps": [
            { "title": "Paso 1", "text": "Explicación muy corta y directa (máximo 2 frases)", "simplified": "Explicación ultra-simple", "visual": "Emoji o texto visual divertido" }
          ],
          "practice": { "question": "Pregunta de práctica matemática", "correctAnswer": "Respuesta (solo el número)", "hint": "Una pista pequeña y divertida con emojis" }
        }
        Asegúrate de que el lenguaje sea muy motivador, puntual (sin rodeos) y adecuado para niños con TDAH (bloques cortos, muchos emojis divertidos). No incluyas markdown, solo el JSON puro.`
        }]
      });

      const text = response.choices[0]?.message?.content || "";
      console.log("Respuesta de IA recibida:", text);

      // Clean potential markdown code blocks
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const newLesson = JSON.parse(jsonStr);
      if (newLesson && newLesson.id && newLesson.steps) {
        setLessons((prev: any) => [newLesson, ...prev]);
        addXp(50);
        console.log("Lección generada con éxito");
      } else {
        throw new Error("Formato de lección inválido");
      }
    } catch (error: any) {
      console.error("AI Lesson Error:", error);
      alert(`¡Ups! No pude crear la lección: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredLessons = lessons.filter((l: any) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setStep(0);
    setShowPractice(false);
    setShowHint(false);
    setFeedback('none');
    setAnswer('');
  };

  const handleNext = () => {
    if (step < activeLesson.steps.length - 1) {
      setStep(step + 1);
      setIsSimplified(false);
    } else {
      setShowPractice(true);
    }
  };

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer === activeLesson.practice.correctAnswer) {
      setFeedback('correct');
      addXp(100);

      // Mark lesson as completed in state
      setLessons((prev: any) => prev.map((l: any) =>
        l.id === activeLesson.id ? { ...l, completed: true } : l
      ));
    } else {
      setFeedback('wrong');
    }
  };

  if (!activeLesson) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Descubrir 📚✨</h2>
              <button
                onClick={() => setShowAiInput(!showAiInput)}
                disabled={isGenerating}
                className={`roblox-button-blue uppercase tracking-widest text-xs ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'Creando Magia...' : 'Nueva Lección IA 🚀'}
              </button>
            </div>

            <AnimatePresence>
              {showAiInput && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={generateLessonWithAI}
                  className="flex gap-2 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="¿Qué quieres aprender? (Ej: Fracciones)"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-md border border-gray-200 focus:border-roblox-blue outline-none bg-white font-bold text-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="roblox-button-blue"
                  >
                    Crear
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tema o curso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-md border border-gray-200 focus:border-roblox-blue outline-none shadow-sm transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson: any) => {
            const isLocked = lesson.level > 1 && level < (lesson.level * 2);
            return (
              <button
                key={lesson.id}
                disabled={isLocked}
                onClick={() => startLesson(lesson)}
                className={`roblox-card p-6 text-left group transition-all relative overflow-hidden ${isLocked ? 'opacity-75 grayscale cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
              >
                <div className="absolute top-0 right-0 p-4 flex gap-2">
                  {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${lesson.level === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    Nivel {lesson.level}
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors border ${isLocked ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-pastel-blue text-blue-700 border-pastel-blue/20 group-hover:bg-roblox-blue group-hover:text-white'
                  }`}>
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-roblox-dark mb-1 uppercase tracking-tight">{lesson.title} 📚✨</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{lesson.topic} 🌈</p>
                <div className={`mt-4 flex items-center gap-2 font-black text-xs uppercase tracking-wider ${isLocked ? 'text-gray-400' : 'text-roblox-blue'
                  }`}>
                  {isLocked ? 'Bloqueado 🔒 Nivel ' + (lesson.level * 2) : '¡Aprender Ahora! 🚀'} <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={() => setActiveLesson(null)}
        className="mb-6 flex items-center gap-2 text-gray-500 font-black uppercase text-xs tracking-widest hover:text-roblox-blue transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Volver a lecciones
      </button>

      {!showPractice ? (
        <div className="roblox-card p-10 bg-white">
          <div className="flex justify-between items-center mb-8">
            <div className="px-3 py-1 bg-roblox-blue/10 text-roblox-blue rounded-md text-[10px] font-black uppercase tracking-widest border border-roblox-blue/20">
              {activeLesson.title}
            </div>
            <div className="flex gap-1">
              {activeLesson.steps.map((_: any, i: number) => (
                <div key={i} className={`w-8 h-2 rounded-full ${i <= step ? 'bg-roblox-blue' : 'bg-gray-100'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step + (isSimplified ? '-simple' : '')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-black text-roblox-dark uppercase tracking-tight">{activeLesson.steps[step].title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-bold">
                {isSimplified ? activeLesson.steps[step].simplified : activeLesson.steps[step].text}
              </p>
              <div className="bg-gray-50 p-12 rounded-xl flex items-center justify-center text-6xl shadow-inner border border-gray-100">
                {activeLesson.steps[step].visual}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsSimplified(!isSimplified)}
              className="roblox-button-white px-6 py-3 text-xs font-black uppercase tracking-widest"
            >
              <Brain className="w-4 h-4" />
              {isSimplified ? 'Ver normal' : 'Explicación simple'}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 roblox-button-blue py-3 text-xs font-black uppercase tracking-widest"
            >
              {step === activeLesson.steps.length - 1 ? '¡A practicar!' : 'Siguiente'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="roblox-card p-10 bg-white text-center">
          <div className="w-20 h-20 bg-roblox-blue/10 text-roblox-blue rounded-2xl flex items-center justify-center mx-auto mb-6 border border-roblox-blue/20">
            <Target className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-roblox-dark uppercase tracking-tight mb-6">¡Mini Práctica!</h2>
          <p className="text-xl text-gray-600 mb-10 font-bold">
            {activeLesson.practice.question}
          </p>

          <form onSubmit={handlePracticeSubmit} className="space-y-8">
            {activeLesson.practice.hint && (
              <div className="flex justify-center">
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="text-[10px] text-roblox-blue font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Ver pista
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-roblox-blue/5 text-roblox-blue p-3 rounded-lg text-[11px] font-bold border border-roblox-blue/10"
                  >
                    💡 {activeLesson.practice.hint}
                  </motion.div>
                )}
              </div>
            )}
            <div className="flex justify-center gap-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full max-w-[200px] h-20 text-4xl text-center border-4 border-gray-100 rounded-xl focus:border-roblox-blue outline-none transition-all font-black"
                placeholder="?"
                autoFocus
              />
            </div>

            {feedback === 'correct' && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 text-green-600 font-black text-lg uppercase tracking-tight">
                <CheckCircle2 className="w-6 h-6" /> ¡Excelente trabajo! +100 XP
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 text-rose-600 font-black text-lg uppercase tracking-tight">
                <AlertCircle className="w-6 h-6" /> ¡Casi! Inténtalo de nuevo.
              </motion.div>
            )}

            <div className="flex gap-4">
              {feedback === 'correct' ? (
                <button
                  type="button"
                  onClick={() => setActiveLesson(null)}
                  className="w-full py-4 roblox-button-blue text-xs font-black uppercase tracking-widest"
                >
                  Terminar Lección
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 roblox-button-blue text-xs font-black uppercase tracking-widest"
                >
                  Comprobar
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

// --- Games Section ---
const GamesSection = ({ addXp }: any) => {
  const [game, setGame] = useState<'menu' | 'race' | 'comparison' | 'sequence' | 'ai-challenge' | 'simon' | 'grid-memory' | 'word-memory' | 'number-recall' | 'memory'>('menu');
  const [gameLevel, setGameLevel] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [initialTime, setInitialTime] = useState(30);
  const [problem, setProblem] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'finished' | 'showing-sequence'>('playing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSimon, setActiveSimon] = useState<number | null>(null);

  const [showHint, setShowHint] = useState(false);

  const startAiChallenge = async () => {
    setIsGenerating(true);
    setShowHint(false);
    console.log("Iniciando generación de reto IA");
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("API Key de Groq no configurada.");
      }

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const challengeThemes = ["piratas contando monedas de oro", "astronautas calculando combustible estelar", "pasteleros midiendo ingredientes monstruosos", "detectives resolviendo un código secreto", "robots arreglando sus engranajes", "exploradores cruzando un puente de lava", "ninjas saltando obstáculos geométricos"];
      const randomTheme = challengeThemes[Math.floor(Math.random() * challengeThemes.length)];
      const seed = Math.floor(Math.random() * 100000);

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: `Genera un reto matemático ÚNICO, INÉDITO y NUEVO para niños de primaria. Debe ser una pregunta de razonamiento matemático interactiva.
          Temática obligatoria: ${randomTheme}. 
          Usa diferentes números en las operaciones para que no se repitan nunca (Semilla lógica: ${seed}).
          Responde EXCLUSIVAMENTE en formato JSON: { "question": "La pregunta...", "correctAnswer": "Solo el número de la respuesta", "hint": "Una pista corta" }. No incluyas markdown ni texto fuera del JSON.`
        }]
      });

      const text = response.choices[0]?.message?.content || "";
      console.log("Reto IA recibido:", text);

      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const challenge = JSON.parse(jsonStr);

      if (challenge && challenge.question) {
        setProblem({ ...challenge, type: 'ai' });
        setGame('ai-challenge');
        setGameState('playing');
        setTimeLeft(60);
        setScore(0);
        console.log("Reto IA cargado con éxito");
      } else {
        throw new Error("Formato de reto inválido");
      }
    } catch (error: any) {
      console.error("AI Challenge Error:", error);
      alert(`No pude generar el reto: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const startGame = (type: any, level: number = 1) => {
    setGame(type);
    setGameLevel(level);
    setScore(0);
    const time = ['memory', 'simon', 'grid-memory', 'word-memory', 'number-recall'].includes(type) ? 60 : 30;
    setTimeLeft(time);
    setInitialTime(time);
    setGameState('playing');
    generateProblem(type, level);
  };

  const generateProblem = (type: string, level: number) => {
    const max = level === 1 ? 10 : level === 2 ? 50 : 100;

    if (type === 'race') {
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      setProblem({ a, b, op: '+', correct: a + b });
    } else if (type === 'comparison') {
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      if (a === b) return generateProblem(type, level);
      setProblem({ a, b, correct: a > b ? 'a' : 'b' });
    } else if (type === 'sequence') {
      const start = Math.floor(Math.random() * 10) + 1;
      const step = Math.floor(Math.random() * (level * 2)) + 2;
      const s = [start, start + step, start + step * 2, start + step * 3];
      setProblem({ seq: s.slice(0, 3), correct: s[3] });
    } else if (type === 'memory') {
      const pairs = level + 2;
      const numbers = Array.from({ length: pairs }, (_, i) => i + 1);
      const cards = [...numbers, ...numbers]
        .sort(() => Math.random() - 0.5)
        .map((n, i) => ({ id: i, val: n, flipped: false, matched: false }));
      setProblem({ cards, selected: [] });
    } else if (type === 'simon') {
      const length = level + 2;
      const seq = Array.from({ length }, () => Math.floor(Math.random() * 4));
      setProblem({ sequence: seq, userSequence: [], step: 0 });
      setGameState('showing-sequence');
      playSimonSequence(seq);
    } else if (type === 'grid-memory') {
      const size = level === 1 ? 2 : level === 2 ? 3 : 4;
      const emojis = ['🍎', '🍌', '🍇', '🍓', '🍕', '🍔', '🍦', '🍩', '🚀', '⭐', '🎈', '🎁', '🐶', '🐱', '🦁', '🐼'];
      const grid = Array.from({ length: size * size }, () => emojis[Math.floor(Math.random() * emojis.length)]);
      const targetIndex = Math.floor(Math.random() * grid.length);
      setProblem({ grid, target: grid[targetIndex], targetIndex, size, showItems: true });
      setTimeout(() => {
        setProblem((prev: any) => ({ ...prev, showItems: false }));
      }, 3000);
    } else if (type === 'word-memory') {
      const allWords = ['Gato', 'Perro', 'Sol', 'Luna', 'Casa', 'Árbol', 'Flor', 'Nube', 'Agua', 'Fuego', 'Libro', 'Lápiz', 'Mesa', 'Silla', 'Pan', 'Leche'];
      const count = level + 2;
      const selectedWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, count);
      const distractors = [...allWords].filter(w => !selectedWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, 4);
      const options = [...selectedWords, ...distractors].sort(() => Math.random() - 0.5);
      setProblem({ words: selectedWords, options, found: [], showWords: true });
      setTimeout(() => {
        setProblem((prev: any) => ({ ...prev, showWords: false }));
      }, 5000);
    } else if (type === 'number-recall') {
      const length = level + 3;
      const sequence = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
      setProblem({ sequence, show: true });
      setTimeout(() => {
        setProblem((prev: any) => ({ ...prev, show: false }));
      }, 3000);
    }
    setAnswer('');
  };

  const playSimonSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActiveSimon(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveSimon(null);
    }
    setGameState('playing');
  };

  const handleSimonClick = (index: number) => {
    if (gameState !== 'playing' || feedback) return;

    setActiveSimon(index);
    setTimeout(() => setActiveSimon(null), 200);

    const nextStep = problem.userSequence.length;
    if (index === problem.sequence[nextStep]) {
      const newSeq = [...problem.userSequence, index];
      if (newSeq.length === problem.sequence.length) {
        setFeedback('correct');
        setScore(s => s + 20);
        setTimeout(() => {
          setFeedback(null);
          const nextLevelSeq = [...problem.sequence, Math.floor(Math.random() * 4)];
          setProblem({ sequence: nextLevelSeq, userSequence: [], step: 0 });
          setGameState('showing-sequence');
          playSimonSequence(nextLevelSeq);
        }, 800);
      } else {
        setProblem({ ...problem, userSequence: newSeq });
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setGameState('finished');
        addXp(score * 5);
      }, 800);
    }
  };

  const handleGridClick = (index: number) => {
    if (problem.showItems || feedback) return;

    if (index === problem.targetIndex) {
      setFeedback('correct');
      setScore(s => s + 25);
      setTimeout(() => {
        setFeedback(null);
        generateProblem('grid-memory', gameLevel);
      }, 800);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  };

  const handleWordClick = (word: string) => {
    if (problem.showWords || feedback || problem.found.includes(word)) return;

    if (problem.words.includes(word)) {
      const newFound = [...problem.found, word];
      setProblem({ ...problem, found: newFound });
      setScore(s => s + 10);
      if (newFound.length === problem.words.length) {
        setFeedback('correct');
        setTimeout(() => {
          setFeedback(null);
          generateProblem('word-memory', gameLevel);
        }, 800);
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  useEffect(() => {
    let timer: any;
    if (game !== 'menu' && gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
      addXp(score * 5);
    }
    return () => clearInterval(timer);
  }, [game, gameState, timeLeft]);

  const handleCardClick = (card: any) => {
    if (problem.selected.length === 2 || card.flipped || card.matched) return;

    const newCards = problem.cards.map((c: any) =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    const newSelected = [...problem.selected, card];

    setProblem({ ...problem, cards: newCards, selected: newSelected });

    if (newSelected.length === 2) {
      if (newSelected[0].val === newSelected[1].val) {
        setTimeout(() => {
          const matchedCards = newCards.map((c: any) =>
            c.val === card.val ? { ...c, matched: true } : c
          );
          setProblem({ ...problem, cards: matchedCards, selected: [] });
          setScore(s => s + 20);
          if (matchedCards.every((c: any) => c.matched)) {
            setGameState('finished');
            addXp(score + 100);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = newCards.map((c: any) =>
            c.matched ? c : { ...c, flipped: false }
          );
          setProblem({ ...problem, cards: resetCards, selected: [] });
        }, 1000);
      }
    }
  };

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = game === 'ai-challenge'
      ? answer.trim().toLowerCase() === problem.correctAnswer.toString().toLowerCase()
      : parseInt(answer) === problem.correct;

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + (game === 'ai-challenge' ? 50 : 10));
      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
        if (game === 'ai-challenge') {
          setGameState('finished');
          addXp(150);
        } else {
          generateProblem(game, gameLevel);
        }
      }, 600);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
      }, 600);
    }
  };

  const handleChoice = (choice: string) => {
    if (choice === problem.correct) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(() => {
        setFeedback(null);
        generateProblem(game, gameLevel);
      }, 600);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Experiencias 🎮✨</h2>
        {game !== 'menu' && (
          <button
            onClick={() => setGame('menu')}
            className="roblox-button-white"
          >
            <ChevronLeft className="w-5 h-5" /> Salir del Juego
          </button>
        )}
      </div>

      {game === 'menu' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'race', title: 'Carrera Matemática 🏎️', icon: <Zap className="w-8 h-8" />, color: 'bg-pastel-blue', textColor: 'text-blue-700', desc: 'Sumas rápidas contra el reloj. ⏱️⚡' },
            { id: 'comparison', title: '¿Cuál es mayor? ⚖️', icon: <Target className="w-8 h-8" />, color: 'bg-pastel-green', textColor: 'text-emerald-700', desc: 'Compara números y elige el más grande. 🐘🐭' },
            { id: 'sequence', title: 'Maestro de Series 🧩', icon: <Star className="w-8 h-8" />, color: 'bg-pastel-yellow', textColor: 'text-amber-700', desc: 'Encuentra el patrón en la secuencia. 🔢🌈' },
            { id: 'memory', title: 'Parejas Locas 🧠', icon: <Brain className="w-8 h-8" />, color: 'bg-pastel-purple', textColor: 'text-purple-700', desc: 'Encuentra las parejas de números. 🃏✨' },
            { id: 'simon', title: 'Simón de Colores 🌈', icon: <Zap className="w-8 h-8" />, color: 'bg-cyan-100', textColor: 'text-cyan-700', desc: 'Repite la secuencia de luces y sonidos. 🎵💡' },
            { id: 'grid-memory', title: '¿Dónde estaba? 🗺️', icon: <Search className="w-8 h-8" />, color: 'bg-violet-100', textColor: 'text-violet-700', desc: 'Recuerda la posición de los objetos. 📍💎' },
            { id: 'word-memory', title: 'Lista de Palabras 📖', icon: <BookOpen className="w-8 h-8" />, color: 'bg-emerald-100', textColor: 'text-emerald-700', desc: 'Memoriza las palabras y encuéntralas. 📝🌟' },
            { id: 'number-recall', title: 'Memoria Numérica 🔢', icon: <Timer className="w-8 h-8" />, color: 'bg-indigo-100', textColor: 'text-indigo-700', desc: 'Recuerda y escribe la serie de números. 🧠🔥' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => startGame(g.id)}
              className="roblox-card group hover:scale-[1.02] transition-all text-left overflow-hidden border-none shadow-md"
            >
              <div className={`h-32 ${g.color} flex items-center justify-center ${g.textColor} relative`}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <div className="relative z-10 transform group-hover:scale-110 transition-transform">
                  {g.icon}
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-lg font-black text-roblox-dark mb-2 uppercase tracking-tight">{g.title}</h3>
                <p className="text-gray-500 text-xs font-bold leading-relaxed">{g.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-roblox-blue font-black text-xs uppercase tracking-widest">
                  ¡Jugar Ahora! 🚀 <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          ))}

          <button
            onClick={startAiChallenge}
            disabled={isGenerating}
            className="roblox-card group hover:scale-[1.02] transition-all text-left bg-roblox-dark border-none overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-br from-roblox-blue to-indigo-600 flex items-center justify-center text-white relative">
              <Sparkles className="w-12 h-12 animate-pulse" />
            </div>
            <div className="p-6 bg-roblox-dark">
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Reto IA Especial ✨🧠</h3>
              <p className="text-gray-400 text-xs font-bold leading-relaxed">Un desafío único generado por nuestra inteligencia artificial. 🌈🚀</p>
              <div className="mt-4 flex items-center gap-2 text-roblox-blue font-black text-xs uppercase tracking-widest">
                {isGenerating ? 'Creando Magia...' : '¡Comenzar Reto!'} <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="roblox-card p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-roblox-blue text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-roblox-dark uppercase tracking-tight">
                    {game === 'race' ? 'Carrera Matemática' :
                      game === 'comparison' ? '¿Cuál es mayor?' :
                        game === 'sequence' ? 'Maestro de Series' :
                          game === 'memory' ? 'Parejas Locas' :
                            game === 'simon' ? 'Simón de Colores' :
                              game === 'grid-memory' ? '¿Dónde estaba?' :
                                game === 'word-memory' ? 'Lista de Palabras' :
                                  game === 'number-recall' ? 'Memoria Numérica' :
                                    'Reto IA'}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Nivel {gameLevel}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-gray-100 px-4 py-2 rounded-md border border-gray-200 flex items-center gap-2">
                  <Timer className={`w-4 h-4 ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-gray-500'}`} />
                  <span className={`font-black text-sm ${timeLeft < 10 ? 'text-rose-500' : 'text-roblox-dark'}`}>{timeLeft}s</span>
                </div>
                <div className="bg-roblox-blue/10 px-4 py-2 rounded-md border border-roblox-blue/20 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-roblox-blue" />
                  <span className="text-roblox-blue font-black text-sm">{score} Puntos</span>
                </div>
              </div>
            </div>

            <div className="min-h-[400px] flex items-center justify-center">
              {gameState === 'finished' ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-6">
                  <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">¡Tiempo Agotado!</h3>
                  <p className="text-gray-500 font-bold">Has conseguido un total de <span className="text-roblox-blue">{score} puntos</span>.</p>
                  <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-md border border-emerald-200 font-black text-sm uppercase tracking-widest">
                    ¡Has ganado +{score * 5} XP!
                  </div>
                  <div className="flex gap-4 justify-center pt-4">
                    <button onClick={() => startGame(game, gameLevel)} className="roblox-button-blue px-8 py-3">Volver a Jugar</button>
                    <button onClick={() => setGame('menu')} className="roblox-button-white px-8 py-3">Menú Principal</button>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full">
                  {(game === 'race' || game === 'sequence') && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                      <div className="bg-gray-50 p-12 rounded-xl border border-gray-200 text-center">
                        <div className="text-6xl font-black text-roblox-dark tracking-tighter">
                          {game === 'race' ? `${problem.a} + ${problem.b}` : problem.seq.join(', ') + ', ?'}
                        </div>
                      </div>
                      <form onSubmit={handleAnswer} className="flex flex-col gap-4 items-center">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className={`w-full max-w-xs h-20 text-4xl text-center border-4 ${feedback === 'incorrect' ? 'border-rose-500 animate-shake' : 'border-gray-100'} rounded-xl focus:border-roblox-blue outline-none shadow-inner transition-all font-black`}
                          placeholder="?"
                          autoFocus
                        />
                        <button type="submit" className="roblox-button-blue w-full max-w-xs py-4 text-xl">Enviar</button>
                      </form>
                    </motion.div>
                  )}

                  {game === 'comparison' && (
                    <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                      <button onClick={() => handleChoice('a')} className="roblox-card p-12 text-5xl font-black text-roblox-dark hover:border-roblox-blue transition-colors relative group">
                        {problem.a}
                        <div className="absolute inset-0 bg-roblox-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button onClick={() => handleChoice('b')} className="roblox-card p-12 text-5xl font-black text-roblox-dark hover:border-roblox-blue transition-colors relative group">
                        {problem.b}
                        <div className="absolute inset-0 bg-roblox-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  )}

                  {game === 'ai-challenge' && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-8"
                    >
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest text-center">Reto de la Inteligencia Artificial</h3>
                      <div className="p-8 bg-gray-50 rounded-xl text-xl font-bold text-roblox-dark leading-relaxed border border-gray-200 relative shadow-inner text-center">
                        {problem.question}
                        {problem.hint && (
                          <div className="mt-6">
                            {!showHint ? (
                              <button
                                onClick={() => setShowHint(true)}
                                className="roblox-button-white text-xs py-2 px-4"
                              >
                                <Sparkles className="w-3 h-3" /> ¿Necesitas una pista?
                              </button>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-roblox-blue italic bg-white p-4 rounded-md border border-roblox-blue/20 mt-4"
                              >
                                💡 Pista: {problem.hint}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleAnswer} className="flex flex-col gap-4 items-center">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className={`w-full max-w-md h-16 text-2xl text-center border-4 ${feedback === 'incorrect' ? 'border-rose-500 animate-shake' : 'border-gray-100'} rounded-xl focus:border-roblox-blue outline-none shadow-inner transition-all font-black`}
                          placeholder="Escribe tu respuesta..."
                          autoFocus
                        />
                        <button type="submit" className="roblox-button-blue w-full max-w-md py-4 text-lg">Enviar Respuesta</button>
                      </form>
                    </motion.div>
                  )}

                  {game === 'memory' && (
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      {problem.cards.map((card: any) => (
                        <button
                          key={card.id}
                          onClick={() => handleCardClick(card)}
                          className={`h-24 rounded-xl text-3xl font-black transition-all transform border-4 ${card.flipped || card.matched
                            ? 'bg-white border-roblox-blue text-roblox-blue rotate-0'
                            : 'bg-roblox-dark border-transparent text-transparent -rotate-3 shadow-lg'
                            } ${card.matched ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95'}`}
                        >
                          {(card.flipped || card.matched) ? card.val : '?'}
                        </button>
                      ))}
                    </div>
                  )}

                  {game === 'simon' && (
                    <div className="space-y-8 text-center">
                      <h3 className="text-xl font-black text-roblox-dark uppercase tracking-tight">
                        {gameState === 'showing-sequence' ? '👀 ¡Mira con atención!' : '👉 ¡Tu turno!'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                        {[
                          { color: 'bg-rose-500', active: 'bg-rose-300 scale-105 brightness-125' },
                          { color: 'bg-roblox-blue', active: 'bg-blue-300 scale-105 brightness-125' },
                          { color: 'bg-emerald-500', active: 'bg-emerald-300 scale-105 brightness-125' },
                          { color: 'bg-amber-500', active: 'bg-amber-300 scale-105 brightness-125' }
                        ].map((btn, i) => (
                          <button
                            key={i}
                            onClick={() => handleSimonClick(i)}
                            disabled={gameState === 'showing-sequence'}
                            className={`w-32 h-32 rounded-2xl shadow-lg transition-all duration-200 border-4 border-white/20 ${activeSimon === i ? btn.active : btn.color
                              } ${gameState === 'showing-sequence' ? 'cursor-default' : 'hover:scale-105 active:scale-95'}`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-400 font-black text-xs uppercase tracking-widest">
                        Secuencia: {problem.userSequence.length} / {problem.sequence.length}
                      </div>
                    </div>
                  )}

                  {game === 'grid-memory' && (
                    <div className="space-y-8 text-center">
                      <h3 className="text-xl font-black text-roblox-dark uppercase tracking-tight">
                        {problem.showItems
                          ? '🧠 ¡Memoriza las posiciones!'
                          : `🔍 ¿Dónde estaba el objeto ${problem.target}?`}
                      </h3>
                      <div
                        className="grid gap-3 mx-auto"
                        style={{
                          gridTemplateColumns: `repeat(${problem.size}, minmax(0, 1fr))`,
                          maxWidth: problem.size * 100
                        }}
                      >
                        {problem.grid.map((item: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => handleGridClick(i)}
                            disabled={problem.showItems}
                            className={`h-20 rounded-xl text-4xl flex items-center justify-center transition-all border-4 ${problem.showItems
                              ? 'bg-white border-gray-100'
                              : 'bg-roblox-dark border-transparent text-transparent hover:bg-gray-800'
                              } ${feedback === 'correct' && i === problem.targetIndex ? 'bg-emerald-500 border-emerald-400 text-white scale-105' : ''}`}
                          >
                            {problem.showItems ? item : (feedback === 'correct' && i === problem.targetIndex ? item : '?')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {game === 'word-memory' && (
                    <div className="space-y-8 text-center">
                      <h3 className="text-xl font-black text-roblox-dark uppercase tracking-tight">
                        {problem.showWords
                          ? '📖 ¡Memoriza estas palabras!'
                          : `✅ Encuentra las ${problem.words.length} palabras`}
                      </h3>

                      {problem.showWords ? (
                        <div className="flex flex-wrap gap-3 justify-center">
                          {problem.words.map((word: string, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="px-6 py-3 bg-roblox-blue/10 text-roblox-blue rounded-md text-xl font-black border border-roblox-blue/20"
                            >
                              {word}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 justify-center">
                          {problem.options.map((word: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => handleWordClick(word)}
                              className={`px-6 py-3 rounded-md text-lg font-black border-2 transition-all ${problem.found.includes(word)
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : 'bg-white border-gray-100 text-roblox-dark hover:border-roblox-blue'
                                }`}
                            >
                              {word}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {game === 'number-recall' && (
                    <div className="space-y-8 text-center">
                      <h3 className="text-xl font-black text-roblox-dark uppercase tracking-tight">
                        {problem.show ? '🔢 ¡Recuerda el número!' : '⌨️ Escribe el número'}
                      </h3>
                      {problem.show ? (
                        <div className="text-7xl font-black text-roblox-blue tracking-widest bg-gray-50 p-12 rounded-xl border border-gray-200">
                          {problem.sequence}
                        </div>
                      ) : (
                        <form onSubmit={handleAnswer} className="flex flex-col gap-4 items-center">
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className={`w-full max-w-md h-20 text-5xl text-center border-4 ${feedback === 'incorrect' ? 'border-rose-500 animate-shake' : 'border-gray-100'} rounded-xl focus:border-roblox-blue outline-none shadow-inner transition-all font-black`}
                            placeholder="?"
                            autoFocus
                          />
                          <button type="submit" className="roblox-button-blue w-full max-w-md py-4 text-xl">Confirmar</button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- Blackboard Section ---
const BlackboardSection = ({ addXp }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4F46E5');
  const [aiSolution, setAiSolution] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState<string | null>(null);
  const detectionTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;

    // Fill background white for better OCR
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();

    // Auto-detect after 1 second of inactivity
    detectionTimeoutRef.current = setTimeout(() => {
      autoDetect();
    }, 1000);
  };

  const autoDetect = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDetecting(true);
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);
      }
      const imageData = tempCanvas.toDataURL('image/jpeg').split(',')[1];
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error("API Key de Groq no configurada.");

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Identifica brevemente qué números o símbolos matemáticos hay en la imagen. Responde SOLO con los números/símbolos encontrados, nada más. Si no hay nada claro, no respondas nada." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } }
            ]
          }
        ]
      });

      const result = response.choices[0]?.message?.content?.trim();
      if (result && result.length < 20) {
        setDetectedText(result);
      }
    } catch (e: any) {
      console.error("Auto-detect error", e);
      setDetectedText(`Error IA: ${e.message || 'Desconocido'}`);
    } finally {
      setIsDetecting(false);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setAiSolution(null);
    setDetectedText(null);
  };

  const solveWithAi = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSolving(true);
    setAiSolution("Analizando tu dibujo...");

    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);
      }
      const imageData = tempCanvas.toDataURL('image/jpeg').split(',')[1];
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error("API Key de Groq no configurada.");

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Eres un tutor de matemáticas para niños con TDAH. Mira la imagen, identifica la operación y resuélvela. Sé EXTREMADAMENTE puntual y directo. Usa este formato: 1. Operación detectada. 2. Pasos cortos (máximo 3). 3. Resultado final con un emoji. No uses párrafos largos." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } }
            ]
          }
        ]
      });

      setAiSolution(response.choices[0]?.message?.content || "No pude entender la operación. ¡Intenta escribirla más clarito!");
      addXp(50);
    } catch (error: any) {
      console.error("AI Error:", error);
      setAiSolution(`¡Ups! Error de IA: ${error.message || 'Desconocido'}`);
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Inventario Creativo 🖍️✨</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Dibuja y resuelve con IA 🧠🌈</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearCanvas} className="roblox-button-white px-6 py-3 uppercase tracking-widest text-xs">
            <Trash2 className="w-4 h-4" /> Borrar 🧹
          </button>
          <button
            onClick={solveWithAi}
            disabled={isSolving}
            className={`roblox-button-blue px-6 py-3 uppercase tracking-widest text-xs ${isSolving ? 'opacity-50' : ''}`}
          >
            {isSolving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isSolving ? 'Analizando...' : 'Resolver con IA 🚀'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="roblox-card p-4 relative bg-white overflow-hidden">
            <AnimatePresence>
              {(detectedText || isDetecting) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`absolute top-8 left-8 ${isDetecting ? 'bg-roblox-dark' : 'bg-roblox-blue'} text-white px-4 py-2 rounded-md font-black text-xs uppercase tracking-widest shadow-lg z-10 flex items-center gap-2 transition-colors border border-white/20`}
                >
                  {isDetecting ? (
                    <>
                      <RotateCcw className="w-3 h-3 animate-spin" />
                      <span>Detectando...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-3 h-3" />
                      <span>Detectado: {detectedText}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-[500px] bg-gray-50 rounded-lg cursor-crosshair touch-none border border-gray-100"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between roblox-card p-6 border-none shadow-md">
            <div className="flex gap-2">
              {['#FF77BC', '#A2D2FF', '#B9FBC0', '#FBF8CC', '#E0C3FC', '#4A154B'].map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-xl border-4 transition-transform ${color === c ? 'border-roblox-blue scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Herramientas de Dibujo ✏️🎨</div>
              <div className="w-px h-8 bg-gray-200" />
              <button className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500 group">
                <Eraser className="w-6 h-6 group-hover:text-roblox-blue" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="roblox-card p-8 min-h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 bg-roblox-blue/10 text-roblox-blue rounded-md flex items-center justify-center border border-roblox-blue/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-roblox-dark uppercase tracking-widest">Explicación IA</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Asistente de Aprendizaje</p>
              </div>
            </div>
            {aiSolution ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 leading-relaxed whitespace-pre-line text-sm font-bold">
                {aiSolution}
              </motion.div>
            ) : (
              <div className="text-gray-400 text-center py-20 italic text-xs font-bold uppercase tracking-widest">
                Escribe una operación en la pizarra y presiona "Resolver con IA"
              </div>
            )}
          </div>

          <div className="bg-roblox-blue p-8 rounded-xl shadow-xl text-white">
            <h3 className="text-sm font-black mb-4 uppercase tracking-widest">Tip de Dibujo</h3>
            <p className="text-blue-100 text-xs font-bold leading-relaxed">
              Usa diferentes colores para el numerador y el denominador. ¡Ayuda a tu cerebro a distinguirlos mejor!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Badges Section ---
const BadgesSection = ({ badges }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Colección de Medallas 🏆✨</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tus logros mágicos en el metaverso matemático 🌈💎</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge: Badge) => (
          <div
            key={badge.id}
            className={`roblox-card p-8 text-center transition-all border-none shadow-md ${badge.unlocked ? 'bg-white' : 'bg-gray-100 opacity-60 grayscale'
              }`}
          >
            <div className={`w-20 h-20 mx-auto rounded-xl flex items-center justify-center mb-6 shadow-lg border-4 border-white ${badge.unlocked ? 'bg-roblox-blue text-white' : 'bg-gray-300 text-gray-500'
              }`}>
              {getBadgeIcon(badge.iconId, "w-10 h-10")}
            </div>
            <h3 className="text-lg font-black text-roblox-dark mb-2 uppercase tracking-tight">{badge.name}</h3>
            <p className="text-gray-500 text-xs font-bold leading-relaxed">{badge.description}</p>
            {!badge.unlocked && (
              <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-500 rounded-md text-[10px] font-black uppercase tracking-widest">
                Bloqueado 🔒
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Avatar Section ---
const AvatarSection = ({ config, setConfig }: any) => {
  const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#064E3B', '#1E3A8A'];
  const accessories = [
    { id: 'none', label: 'Nada', icon: <XCircle className="w-4 h-4" /> },
    { id: 'glasses', label: 'Lentes', icon: <Glasses className="w-4 h-4" /> },
    { id: 'crown', label: 'Corona', icon: <Crown className="w-4 h-4" /> },
    { id: 'hat', label: 'Casco', icon: <HardHat className="w-4 h-4" /> },
  ];
  const expressions = [
    { id: 'smile', label: 'Feliz', icon: <Smile className="w-4 h-4" /> },
    { id: 'cool', label: 'Genial', icon: <Smile className="w-4 h-4" /> },
    { id: 'wink', label: 'Guiño', icon: <Smile className="w-4 h-4" /> },
    { id: 'surprised', label: 'Sorpresa', icon: <Smile className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Personalizar Avatar 🎨✨</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">¡Crea tu explorador único del Bosque Esmeralda! 🌲🌈</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-roblox-blue/10 blur-3xl rounded-full" />
            <AvatarDisplay config={config} className="w-64 h-64 relative z-10 border-8 border-white shadow-2xl" />
          </div>
          <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100 font-black text-roblox-dark uppercase tracking-widest text-sm">
            Explorador Pro ✨
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Palette className="w-4 h-4" /> Color de Piel
            </h3>
            <div className="flex flex-wrap gap-3">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setConfig({ ...config, color: c })}
                  className={`w-10 h-10 rounded-xl border-4 transition-all ${config.color === c ? 'border-roblox-blue scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Crown className="w-4 h-4" /> Accesorios
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {accessories.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setConfig({ ...config, accessory: acc.id })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${config.accessory === acc.id ? 'bg-roblox-blue/10 border-roblox-blue text-roblox-blue' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  {acc.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Smile className="w-4 h-4" /> Expresión
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {expressions.map(exp => (
                <button
                  key={exp.id}
                  onClick={() => setConfig({ ...config, expression: exp.id })}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${config.expression === exp.id ? 'bg-roblox-blue/10 border-roblox-blue text-roblox-blue' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  {exp.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{exp.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Progress Section ---
const ProgressSection = ({ xp, level, lessons }: any) => {
  const completedLessons = lessons.filter((l: any) => l.completed);
  const totalLessons = lessons.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Estadísticas del Jugador 📊✨</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tu progreso en el mundo de ZOE.PEHR-Web 🌍🌈</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="roblox-card p-8 bg-white space-y-6 border-none shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-roblox-dark uppercase tracking-tight">Nivel Actual ✨</h3>
            <div className="w-16 h-16 bg-roblox-blue text-white rounded-xl flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white">
              {level}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between font-black uppercase tracking-widest text-[10px]">
              <span className="text-gray-500">XP Acumulada 🌟</span>
              <span className="text-roblox-blue">{xp} XP</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xp % 1000) / 10}%` }}
                className="h-full bg-roblox-blue"
              />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
              ¡Solo faltan {1000 - (xp % 1000)} XP para el siguiente nivel! 🚀🔥
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-black text-roblox-dark">{completedLessons.length} 📚</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lecciones Dominadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-roblox-dark">{totalLessons} 🗺️</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temas Descubiertos</div>
            </div>
          </div>
        </div>

        <div className="roblox-card p-8 bg-white border-none shadow-md">
          <h3 className="text-xl font-black text-roblox-dark mb-6 uppercase tracking-tight">Temas Dominados 🧠💎</h3>
          <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {lessons.map((lesson: any, i: number) => (
              <div key={lesson.id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-700">{lesson.title} {lesson.completed ? '✅' : '⏳'}</span>
                  <span className="text-gray-400">{lesson.completed ? '100%' : '0%'}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: lesson.completed ? '100%' : '0%' }}
                    className={`h-full ${lesson.completed ? 'bg-pastel-green' : 'bg-gray-200'}`}
                  />
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <p className="text-center text-gray-400 text-xs py-10">¡Aún no has descubierto temas! 🌲</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Parents Section ---
const ParentsSection = ({ lessons, xp, dailyGoal, setDailyGoal, isAuthenticated, setIsAuthenticated }: any) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  const completedLessons = lessons.filter((l: any) => l.completed);
  const pendingLessons = lessons.filter((l: any) => !l.completed);

  const chartData = [
    { name: 'Dominados', value: completedLessons.length, color: '#10B981' },
    { name: 'Pendientes', value: pendingLessons.length, color: '#E5E7EB' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const generateAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error("API Key de Groq no configurada.");

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const prompt = `Como experto en educación para niños con TDAH, analiza el progreso:
      - Temas completados: ${completedLessons.map((l: any) => l.topic).join(', ')}
      - Temas pendientes: ${pendingLessons.map((l: any) => l.topic).join(', ')}
      - XP actual: ${xp}
      Proporciona 3 consejos breves y alentadores para los padres sobre cómo apoyar el aprendizaje del niño esta semana. Usa un tono empático y profesional.`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      });
      setAiAdvice(response.choices[0]?.message?.content || "No se pudo generar el consejo en este momento.");
    } catch (e) {
      console.error(e);
      setAiAdvice("Error al conectar con la IA de orientación.");
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-20"
      >
        <div className="roblox-card p-10 text-center space-y-8">
          <div className="w-20 h-20 bg-roblox-dark text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-roblox-dark uppercase tracking-tight">Acceso Guardianes</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Introduce el PIN para ver reportes</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="PIN (1234)"
                className={`w-full h-16 text-4xl text-center border-4 rounded-xl outline-none transition-all font-black tracking-[1em] pl-4 ${error ? 'border-rose-500 animate-shake' : 'border-gray-100 focus:border-roblox-blue'
                  }`}
                autoFocus
              />
              {error && (
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-2">PIN Incorrecto</p>
              )}
            </div>
            <button type="submit" className="roblox-button-blue w-full py-4 text-xs font-black uppercase tracking-widest">
              Entrar al Panel
            </button>
          </form>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            Este panel es solo para padres y tutores.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-6xl mx-auto pb-20"
      id="parents-report-content"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-roblox-dark uppercase tracking-tight">Panel de Control 👨‍👩‍👧‍👦✨</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Seguimiento detallado del aprendizaje 📊🌈</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="roblox-button-white text-[10px] px-4 py-2 uppercase tracking-widest flex items-center gap-2 print:hidden"
          >
            <Download className="w-3 h-3" /> Imprimir Reporte
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="roblox-button-white text-[10px] px-4 py-2 uppercase tracking-widest"
          >
            Cerrar Sesión 🔒
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Daily Goal & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="roblox-card p-8 bg-white border-none shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-roblox-dark uppercase tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-roblox-blue" /> Meta Diaria de XP
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                  className="w-32 accent-roblox-blue"
                />
                <span className="text-roblox-blue font-black text-sm">{dailyGoal} XP</span>
              </div>
            </div>
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((xp / dailyGoal) * 100, 100)}%` }}
                className="absolute inset-0 bg-roblox-blue shadow-[0_0_10px_rgba(0,162,255,0.5)]"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 text-right">
              {Math.round((xp / dailyGoal) * 100)}% de la meta alcanzada hoy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="roblox-card p-6 bg-white border-none shadow-md flex items-center gap-6">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Temas Masterizados</h4>
                <p className="text-3xl font-black text-roblox-dark">{completedLessons.length} / {lessons.length}</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">¡Buen ritmo! 🚀</p>
              </div>
            </div>

            <div className="roblox-card p-6 bg-white border-none shadow-md flex items-center gap-6">
              <div className="w-16 h-16 bg-roblox-blue/10 rounded-2xl flex items-center justify-center">
                <Timer className="w-8 h-8 text-roblox-blue" />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tiempo de Estudio</h4>
                <p className="text-3xl font-black text-roblox-dark">45 min</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Promedio diario esta semana</p>
              </div>
            </div>
          </div>

          {/* AI Advice Section */}
          <div className="roblox-card p-8 bg-gradient-to-br from-roblox-blue/5 to-white border border-roblox-blue/20 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-roblox-dark uppercase tracking-tight flex items-center gap-2">
                <Brain className="w-5 h-5 text-roblox-blue" /> Orientación IA para Padres
              </h3>
              <button
                onClick={generateAdvice}
                disabled={isGeneratingAdvice}
                className="roblox-button-blue text-[10px] px-4 py-2 uppercase tracking-widest disabled:opacity-50"
              >
                {isGeneratingAdvice ? 'Analizando...' : 'Obtener Consejos ✨'}
              </button>
            </div>

            {aiAdvice ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed"
              >
                <div className="bg-white/50 p-6 rounded-xl border border-white shadow-sm">
                  <ReactMarkdown>{aiAdvice}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Haz clic para recibir consejos personalizados basados en el progreso actual.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Reports */}
        <div className="space-y-6">
          <div className="roblox-card p-6 bg-white border-none shadow-md">
            <h3 className="text-sm font-black text-roblox-dark uppercase tracking-tight mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fortalezas
            </h3>
            <div className="space-y-3">
              {completedLessons.length > 0 ? completedLessons.map((l: any) => (
                <div key={l.id} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-emerald-700">{l.topic}</span>
                </div>
              )) : (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aún no hay temas completados.</p>
              )}
            </div>
          </div>

          <div className="roblox-card p-6 bg-white border-none shadow-md">
            <h3 className="text-sm font-black text-roblox-dark uppercase tracking-tight mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-roblox-blue" /> Temas Pendientes
            </h3>
            <div className="space-y-3">
              {pendingLessons.slice(0, 5).map((l: any) => (
                <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-2 h-2 bg-roblox-blue rounded-full" />
                  <span className="text-xs font-bold text-gray-600">{l.topic}</span>
                </div>
              ))}
              {pendingLessons.length > 5 && (
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">+{pendingLessons.length - 5} temas más</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
