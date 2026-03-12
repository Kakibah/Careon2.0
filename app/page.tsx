'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Layers,
  Rocket,
  Users,
  User,
  ExternalLink,
  ArrowRight,
  Clock,
  ShieldCheck,
  Lightbulb,
  Flame,
  Trophy,
  Gift,
  Star
} from 'lucide-react';
import { generateCareerRoadmap } from '@/lib/gemini';
import CareerVisualization from '@/components/CareerVisualization';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// --- Types ---

interface UserData {
  name: string;
  age: string;
  country: string;
  education: string;
  major: string;
  university: string;
  skills: string;
  enjoyedSubjects: string;
  dislikedTopics: string;
  personality: string;
  careerInterests: string;
  preferredIndustries: string;
  salaryExpectations: string;
  workStyle: string;
  ambitions: string;
}

interface Progress {
  skills: string[];
  projects: string[];
  courses: string[];
  internships: string[];
  interviews: string[];
}

// --- Components ---

const InputField = ({ label, name, value, onChange, placeholder, type = "text", required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={3}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900"
    >
      <option value="">Select an option</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function CareerNavigator() {
  const router = useRouter();
  const { user, profile, loading: authLoading, login, logout } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  // Load roadmap from localStorage on mount
  useEffect(() => {
    const savedRoadmap = localStorage.getItem('career_roadmap');
    if (savedRoadmap) {
      try {
        const parsed = JSON.parse(savedRoadmap);
        setRoadmap(parsed);
        
        // Initialize readiness scores if roadmap exists
        const initialScores: Record<string, number> = {};
        parsed.careerPaths.forEach((path: any) => {
          initialScores[path.title] = 15 + Math.floor(Math.random() * 10);
        });
        setReadinessScores(initialScores);
        setStep(3); // Go straight to results
      } catch (e) {
        console.error("Failed to parse saved roadmap", e);
      }
    }

    // Streak Logic
    const lastDate = localStorage.getItem('last_activity_date');
    const currentStreak = parseInt(localStorage.getItem('current_streak') || '0');
    const today = new Date().toISOString().split('T')[0];

    if (lastDate === today) {
      setStreak(currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = 1;
      if (lastDate === yesterdayStr) {
        newStreak = currentStreak + 1;
      }

      setStreak(newStreak);
      localStorage.setItem('current_streak', newStreak.toString());
      localStorage.setItem('last_activity_date', today);
    }
  }, []);
  const [progress, setProgress] = useState<Progress>({
    skills: [],
    projects: [],
    courses: [],
    internships: [],
    interviews: []
  });
  const [readinessScores, setReadinessScores] = useState<Record<string, number>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showMiniReport, setShowMiniReport] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    age: '',
    country: '',
    education: '',
    major: '',
    university: '',
    skills: '',
    enjoyedSubjects: '',
    dislikedTopics: '',
    personality: '',
    careerInterests: '',
    preferredIndustries: '',
    salaryExpectations: '',
    workStyle: '',
    ambitions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateCareerRoadmap(formData);
      
      // Save to localStorage
      localStorage.setItem('career_roadmap', JSON.stringify(result));
      
      // Redirect to pricing
      router.push('/pricing');
    } catch (error) {
      console.error(error);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    {
      title: "Personal Details",
      description: "Tell us about yourself and your background.",
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="22" required />
          <InputField label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="United Kingdom" required />
          <InputField label="University (Optional)" name="university" value={formData.university} onChange={handleChange} placeholder="University of Oxford" />
          <InputField label="Current Education Level" name="education" value={formData.education} onChange={handleChange} placeholder="Undergraduate" required />
          <InputField label="Field of Study / Major" name="major" value={formData.major} onChange={handleChange} placeholder="Computer Science" required />
        </div>
      )
    },
    {
      title: "Skills & Interests",
      description: "What are you good at and what do you enjoy?",
      fields: (
        <div className="space-y-6">
          <TextAreaField label="Skills (Technical & Soft)" name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, Data Analysis, Public Speaking, Teamwork..." required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextAreaField label="Subjects You Enjoy" name="enjoyedSubjects" value={formData.enjoyedSubjects} onChange={handleChange} placeholder="Mathematics, Psychology, AI..." required />
            <TextAreaField label="Topics You Dislike" name="dislikedTopics" value={formData.dislikedTopics} onChange={handleChange} placeholder="Accounting, Chemistry..." required />
          </div>
          <InputField label="Personality Traits" name="personality" value={formData.personality} onChange={handleChange} placeholder="Analytical, Creative, Detail-oriented..." required />
        </div>
      )
    },
    {
      title: "Career Goals",
      description: "Where do you see yourself in the future?",
      fields: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Career Interests" name="careerInterests" value={formData.careerInterests} onChange={handleChange} placeholder="Software Engineering, Product Management..." required />
            <InputField label="Preferred Industries" name="preferredIndustries" value={formData.preferredIndustries} onChange={handleChange} placeholder="Tech, Finance, Healthcare..." required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Salary Expectations (Optional)" name="salaryExpectations" value={formData.salaryExpectations} onChange={handleChange} placeholder="e.g. $60k - $80k" />
            <SelectField 
              label="Preferred Work Style" 
              name="workStyle" 
              value={formData.workStyle} 
              onChange={handleChange} 
              options={["Remote", "Corporate", "Startup", "Research", "Entrepreneurship"]} 
              required 
            />
          </div>
          <TextAreaField label="Long-term Ambitions" name="ambitions" value={formData.ambitions} onChange={handleChange} placeholder="I want to lead a tech team or start my own company in the AI space..." required />
        </div>
      )
    }
  ];

  const toggleProgress = (type: keyof Progress, item: string) => {
    setProgress(prev => {
      const current = prev[type];
      const updated = current.includes(item) 
        ? current.filter(i => i !== item) 
        : [...current, item];
      
      const newProgress = { ...prev, [type]: updated };
      
      // Calculate XP
      const xp = (newProgress.skills.length * 50) + 
                 (newProgress.courses.length * 150) + 
                 (newProgress.projects.length * 100) + // Decreased from 300
                 (newProgress.internships.length * 500) + 
                 (newProgress.interviews.length * 200);
      setTotalXP(xp);

      // Recalculate readiness scores locally for immediate feedback
      if (roadmap) {
        const newScores = { ...readinessScores };
        roadmap.careerPaths.forEach((path: any) => {
          const baseFit = 20;
          const skillBonus = updated.length * 5;
          const projectBonus = newProgress.projects.length * 10;
          const courseBonus = newProgress.courses.length * 8;
          newScores[path.title] = Math.min(98, baseFit + skillBonus + projectBonus + courseBonus);
        });
        setReadinessScores(newScores);
      }
      
      return newProgress;
    });
  };

  const getLevelInfo = (xp: number) => {
    const isElite = streak >= 30;
    if (xp < 1000) return { level: 1, name: isElite ? "Elite Beginner" : "Beginner", next: 1000, color: "text-blue-600", bg: "bg-blue-100" };
    if (xp < 3000) return { level: 2, name: isElite ? "Elite Intermediate" : "Intermediate", next: 3000, color: "text-purple-600", bg: "bg-purple-100" };
    return { level: 3, name: isElite ? "Elite Advanced" : "Advanced", next: 6000, color: "text-emerald-600", bg: "bg-emerald-100" };
  };

  const levelInfo = getLevelInfo(totalXP);
  const progressToNext = Math.min(100, (totalXP / levelInfo.next) * 100);

  if (roadmap) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Compass className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Careon</span>
            </Link>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${levelInfo.color}`}>{levelInfo.name}</span>
                    <span className="text-xs font-bold text-slate-900">Lvl {levelInfo.level}</span>
                  </div>
                  <div className="h-1 w-24 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      className={`h-full ${levelInfo.level === 3 ? 'bg-emerald-500' : levelInfo.level === 2 ? 'bg-purple-500' : 'bg-blue-500'}`}
                    />
                  </div>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total XP</span>
                  <span className="text-xs font-black text-slate-900">{totalXP}</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-xl border border-orange-100">
                  <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'}`} />
                  <span className="text-xs font-black text-orange-700">{streak}d</span>
                </div>
              </div>
              <Link href="/pricing" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Pricing</Link>
              {user ? (
                <Link href="/profile" className="flex items-center gap-2 group/profile">
                  <div className="w-8 h-8 bg-slate-100 rounded-full overflow-hidden border-2 border-transparent group-hover/profile:border-emerald-500 transition-all relative">
                    {user.photoURL ? (
                      <Image 
                        src={user.photoURL} 
                        alt={user.displayName || ''} 
                        fill 
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700 hidden lg:block">{user.displayName?.split(' ')[0]}</span>
                </Link>
              ) : (
                <button 
                  onClick={login}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Sign In
                </button>
              )}
              <button 
                onClick={() => { 
                  localStorage.removeItem('career_roadmap');
                  setRoadmap(null); 
                  setStep(0); 
                }}
                className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 pt-12 space-y-12">
          {/* Streak Rewards Header */}
          {streak > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Flame className="w-10 h-10 text-white fill-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">You&apos;re on a {streak}-day streak!</h3>
                  <p className="text-white/80 text-sm font-medium">Keep it up to unlock exclusive career rewards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  disabled={streak < 3}
                  onClick={() => setShowMiniReport(true)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${streak >= 3 ? 'bg-white/20 border-white/40 hover:bg-white/30 cursor-pointer' : 'bg-black/10 border-white/10 opacity-50'}`}
                >
                  <Gift className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">3 Days</span>
                  <span className="text-[8px] opacity-70">View Report</span>
                </button>
                <div className={`flex flex-col items-center p-3 rounded-2xl border ${streak >= 7 ? 'bg-white/20 border-white/40' : 'bg-black/10 border-white/10 opacity-50'}`}>
                  <Trophy className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">7 Days</span>
                  <span className="text-[8px] opacity-70">Bonus Project</span>
                </div>
                <div className={`flex flex-col items-center p-3 rounded-2xl border ${streak >= 30 ? 'bg-white/20 border-white/40' : 'bg-black/10 border-white/10 opacity-50'}`}>
                  <Star className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">30 Days</span>
                  <span className="text-[8px] opacity-70">Elite Title</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mini Report Modal */}
          <AnimatePresence>
            {showMiniReport && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                  <button 
                    onClick={() => setShowMiniReport(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 rotate-45" />
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Gift className="text-orange-600 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Streak Mini-Report</h3>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Unlocked at 3-day streak</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Market Momentum
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Based on your profile, we&apos;ve noticed a 15% increase in demand for {roadmap.careerPaths[0].title} roles in your region this month.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" /> Skill Spotlight
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mastering <strong>{roadmap.skillsRequired[0].technical[0]}</strong> now could put you in the top 5% of entry-level candidates.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowMiniReport(false)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Career Mastery Overview */}
          <section className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-grow space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Rocket className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Career Mastery Journey</h2>
                    <p className="text-emerald-400/80 text-sm font-medium uppercase tracking-widest">Level {levelInfo.level} • {levelInfo.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Progress to Level {levelInfo.level + 1}</span>
                    <span>{totalXP} / {levelInfo.next} XP</span>
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      className={`h-full shadow-[0_0_20px_rgba(16,185,129,0.5)] ${levelInfo.level === 3 ? 'bg-emerald-400' : levelInfo.level === 2 ? 'bg-purple-400' : 'bg-blue-400'}`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skills</span>
                  <span className="text-2xl font-black text-white">{progress.skills.length}</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projects</span>
                  <span className="text-2xl font-black text-white">{progress.projects.length}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Analysis */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-emerald-600 w-6 h-6" />
              <h2 className="text-2xl font-bold">Profile Analysis</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <p className="text-slate-600 leading-relaxed">{roadmap.profileAnalysis.analysis}</p>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Personality Fit</h4>
                  <p className="text-emerald-700 text-sm">{roadmap.profileAnalysis.personalityFit}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.profileAnalysis.coreStrengths.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Potential Weaknesses</h4>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.profileAnalysis.potentialWeaknesses.map((w: string) => (
                      <span key={w} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Visualization */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Compass className="text-emerald-600 w-6 h-6" />
              <h2 className="text-2xl font-bold">Interactive Career Galaxy</h2>
            </div>
            <CareerVisualization roadmap={roadmap} />
          </section>

          {/* Career Paths */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Briefcase className="text-emerald-600 w-6 h-6" />
              <h2 className="text-2xl font-bold">Top 5 Career Paths</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmap.careerPaths.map((path: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{path.title}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${readinessScores[path.title] || 0}%` }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">{readinessScores[path.title] || 0}% Mastery</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        path.futureOutlook === 'growing' ? 'bg-emerald-100 text-emerald-700' : 
                        path.futureOutlook === 'stable' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {path.futureOutlook}
                      </span>
                      {idx > 2 && totalXP < 1500 && (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-amber-600 uppercase bg-amber-50 px-1.5 py-0.5 rounded">
                          <Rocket className="w-2 h-2" /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {idx > 2 && totalXP < 1500 ? (
                    <div className="flex-grow flex flex-col items-center justify-center py-8 text-center px-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Rocket className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bonus Career Path</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Reach 1,500 XP to unlock this advanced career analysis.</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-500 mb-4 flex-grow">{path.whyFit}</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{path.salaryRange.entry} - {path.salaryRange.experienced}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responsibilities</h4>
                          <ul className="text-xs space-y-1">
                            {path.responsibilities.slice(0, 3).map((r: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-slate-600">{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skills Required */}
          <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <Target className="text-emerald-400 w-6 h-6" />
              <h2 className="text-2xl font-bold">Skills Matrix</h2>
            </div>
            <div className="space-y-8 relative z-10">
              {roadmap.skillsRequired.map((skillSet: any, idx: number) => (
                <div key={idx} className="border-b border-white/10 pb-8 last:border-0 last:pb-0">
                  <h3 className="font-bold text-lg mb-4 text-emerald-400">{skillSet.careerTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Technical</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillSet.technical.map((s: string) => (
                          <button 
                            key={s} 
                            onClick={() => toggleProgress('skills', s)}
                            className={`px-2 py-1 rounded-lg text-xs transition-all border ${
                              progress.skills.includes(s) 
                                ? 'bg-emerald-500 border-emerald-400 text-white' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillSet.soft.map((s: string) => (
                          <button 
                            key={s} 
                            onClick={() => toggleProgress('skills', s)}
                            className={`px-2 py-1 rounded-lg text-xs transition-all border ${
                              progress.skills.includes(s) 
                                ? 'bg-emerald-500 border-emerald-400 text-white' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillSet.tools.map((s: string) => (
                          <button 
                            key={s} 
                            onClick={() => toggleProgress('skills', s)}
                            className={`px-2 py-1 rounded-lg text-xs transition-all border ${
                              progress.skills.includes(s) 
                                ? 'bg-emerald-500 border-emerald-400 text-white' 
                                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-emerald-600 w-6 h-6" />
              <h2 className="text-2xl font-bold">12-Month Development Roadmap</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Months 1-3", data: roadmap.developmentRoadmap.months1_3, color: "bg-emerald-50 border-emerald-100 text-emerald-800" },
                { title: "Months 4-6", data: roadmap.developmentRoadmap.months4_6, color: "bg-blue-50 border-blue-100 text-blue-800" },
                { title: "Months 7-9", data: roadmap.developmentRoadmap.months7_9, color: "bg-indigo-50 border-indigo-100 text-indigo-800" },
                { title: "Months 10-12", data: roadmap.developmentRoadmap.months10_12, color: "bg-slate-100 border-slate-200 text-slate-800" }
              ].map((period, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border ${period.color}`}>
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-xs">{idx + 1}</span>
                    {period.title}
                  </h3>
                  <ul className="space-y-3">
                    {period.data.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Rocket className="text-emerald-600 w-6 h-6" />
              <h2 className="text-2xl font-bold">Project Ideas</h2>
            </div>
            <div className="space-y-12">
              {roadmap.projectIdeas.map((group: any, gIdx: number) => (
                <div key={gIdx} className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">{group.careerPath}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {group.projects.map((project: any, pIdx: number) => (
                      <div 
                        key={pIdx} 
                        onClick={() => toggleProgress('projects', project.title)}
                        className={`bg-white rounded-3xl p-6 shadow-sm border transition-all cursor-pointer group flex flex-col gap-4 ${
                          progress.projects.includes(project.title) ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-base">{project.title}</h4>
                            {progress.projects.includes(project.title) && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                          <p className="text-slate-600 text-xs mb-4 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skillsDemonstrated.map((s: string) => (
                              <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                          <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio Value</h5>
                          <p className="text-[10px] text-slate-500 italic">&quot;{project.portfolioValue}&quot;</p>
                        </div>
                      </div>
                    ))}
                    {streak >= 7 && (
                      <div 
                        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 shadow-sm border-2 border-dashed border-orange-200 transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-2">
                          <Trophy className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-base text-orange-900">Bonus: {group.careerPath} Capstone</h4>
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold uppercase tracking-wider">Expert</span>
                          </div>
                          <p className="text-orange-800 text-xs mb-4 leading-relaxed">A high-impact project unlocked by your 7-day streak. Build a production-ready system that demonstrates mastery of {group.careerPath} fundamentals.</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-white/50 border border-orange-100 text-orange-600 rounded text-[10px] font-bold uppercase tracking-wider">Advanced Architecture</span>
                            <span className="px-2 py-0.5 bg-white/50 border border-orange-100 text-orange-600 rounded text-[10px] font-bold uppercase tracking-wider">Production Deployment</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-orange-100">
                          <h5 className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-1">Streak Reward</h5>
                          <p className="text-[10px] text-orange-600 italic">&quot;This project is designed to be the centerpiece of your portfolio.&quot;</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Internship & Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="text-emerald-600 w-6 h-6" />
                <h2 className="text-xl font-bold">Internship Strategy</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Where to Search</h4>
                  <ul className="text-sm space-y-2">
                    {roadmap.internshipStrategy.whereToSearch.map((s: string) => (
                      <li key={s} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-2 text-slate-600">
                          <ArrowRight className="w-3 h-3 text-emerald-500" /> {s}
                        </div>
                        <button 
                          onClick={() => toggleProgress('internships', s)}
                          className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-all ${
                            progress.internships.includes(s) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          {progress.internships.includes(s) ? 'Completed (+500 XP)' : 'Mark Done'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How to Stand Out</h4>
                  <ul className="text-sm space-y-2">
                    {roadmap.internshipStrategy.howToStandOut.map((s: string) => (
                      <li key={s} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-emerald-600 w-6 h-6" />
                <h2 className="text-xl font-bold">Personalized Resource Library</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roadmap.learningResources.map((resource: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="group p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          resource.type === 'course' ? 'bg-blue-100 text-blue-700' :
                          resource.type === 'book' ? 'bg-amber-100 text-amber-700' :
                          resource.type === 'video' ? 'bg-red-100 text-red-700' :
                          resource.type === 'article' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {resource.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          resource.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                          resource.difficulty === 'intermediate' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {resource.difficulty}
                        </span>
                      </div>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{resource.title}</h3>
                    <p className="text-[10px] font-medium text-slate-400 mb-3">{resource.provider}</p>
                    <p className="text-xs text-slate-600 leading-relaxed flex-grow italic">
                      &quot;{resource.relevance}&quot;
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <button 
                        onClick={() => toggleProgress('courses', resource.title)}
                        className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                          progress.courses.includes(resource.title) ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        {progress.courses.includes(resource.title) ? (
                          <><CheckCircle2 className="w-3 h-3" /> Completed</>
                        ) : (
                          <><Clock className="w-3 h-3" /> Mark as started</>
                        )}
                      </button>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                      >
                        View Resource
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Long Term Trajectory */}
          <section className="bg-emerald-600 text-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="text-emerald-200 w-6 h-6" />
              <h2 className="text-2xl font-bold">10-Year Career Trajectory</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2 z-0" />
              
              {[
                { label: "Year 1-2", title: "Entry-level", content: roadmap.longTermTrajectory.years1_2 },
                { label: "Year 3-5", title: "Mid-level", content: roadmap.longTermTrajectory.years3_5 },
                { label: "Year 6-10", title: "Senior/Specialist", content: roadmap.longTermTrajectory.years6_10 }
              ].map((phase, idx) => (
                <div key={idx} className="relative z-10 bg-emerald-700/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">{phase.label}</span>
                  <h3 className="text-lg font-bold mb-3">{phase.title}</h3>
                  <p className="text-sm text-emerald-50 leading-relaxed">{phase.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Expert Interview Questions (Unlocked at Level 2) */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-600 w-6 h-6" />
                <h2 className="text-2xl font-bold">Expert Interview Prep</h2>
              </div>
              {totalXP < 1000 && (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-100 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Unlocks at Level 2
                </span>
              )}
            </div>

            {totalXP < 1000 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <ShieldCheck className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-400 mb-2 uppercase tracking-tight">Advanced Interview Intelligence</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Complete more skills and projects to reach 1,000 XP. You&apos;ll unlock a curated list of high-stakes interview questions and ideal answers tailored to your roadmap.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roadmap.expertInterviewQuestions.map((q: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">Q: {q.question}</h4>
                      <button 
                        onClick={() => toggleProgress('interviews', q.question)}
                        className={`shrink-0 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-all ${
                          progress.interviews.includes(q.question) ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                        }`}
                      >
                        {progress.interviews.includes(q.question) ? 'Mastered (+200 XP)' : 'Master This'}
                      </button>
                    </div>
                    <div className="space-y-3 flex-grow">
                      <p className="text-xs text-slate-500 italic"><span className="font-bold uppercase text-[10px] tracking-widest text-emerald-600">Why it&apos;s asked:</span> {q.whyItIsAsked}</p>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-700 leading-relaxed"><span className="font-bold uppercase text-[10px] tracking-widest text-slate-400 block mb-1">Ideal Strategy:</span> {q.idealAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Advanced Portfolio Tips (Unlocked at Level 3) */}
          <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -ml-32 -mb-32" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <Lightbulb className="text-emerald-400 w-6 h-6" />
                <h2 className="text-2xl font-bold">Advanced Portfolio Strategy</h2>
              </div>
              {totalXP < 3000 && (
                <span className="px-3 py-1 bg-white/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Unlocks at Level 3
                </span>
              )}
            </div>

            {totalXP < 3000 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto relative z-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                  <Lightbulb className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-bold text-white/40 mb-2 uppercase tracking-tight">Elite Portfolio Tactics</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Reach 3,000 XP to unlock advanced portfolio strategies that will set you apart from 99% of other candidates.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {roadmap.advancedPortfolioTips.map((tip: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Compass className="w-3 h-3" />
            AI-Powered Career Strategist
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
          >
            Navigate Your <span className="text-emerald-600">Future</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Get a structured, data-driven career roadmap tailored to your skills, education, and long-term ambitions.
          </motion.p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 pb-20 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900">{steps[step].title}</h2>
              <p className="text-slate-500">{steps[step].description}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[step].fields}
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : <div />}

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing Profile...
                      </>
                    ) : (
                      <>
                        Generate Roadmap
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            Powered by Gemini 3.1 Pro • Data-Driven Career Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
