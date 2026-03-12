'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firebaseUtils';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  BookOpen, 
  Briefcase, 
  Plus, 
  Trash2, 
  Save, 
  LogOut, 
  LogIn,
  ChevronLeft,
  GraduationCap,
  Calendar,
  MapPin,
  FileText,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, profile, loading, login, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localProfile, setLocalProfile] = useState<any>(null);

  React.useEffect(() => {
    if (profile) {
      setLocalProfile(JSON.parse(JSON.stringify(profile)));
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user || !localProfile) return;
    setIsSaving(true);
    try {
      const profileRef = doc(db, 'users', user.uid);
      await updateDoc(profileRef, {
        ...localProfile,
        updatedAt: new Date().toISOString()
      });
      setEditMode(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => {
    setLocalProfile({
      ...localProfile,
      education: [
        ...localProfile.education,
        { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }
      ]
    });
  };

  const removeEducation = (index: number) => {
    const newEdu = [...localProfile.education];
    newEdu.splice(index, 1);
    setLocalProfile({ ...localProfile, education: newEdu });
  };

  const addWork = () => {
    setLocalProfile({
      ...localProfile,
      workExperience: [
        ...localProfile.workExperience,
        { company: '', position: '', location: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };

  const removeWork = (index: number) => {
    const newWork = [...localProfile.workExperience];
    newWork.splice(index, 1);
    setLocalProfile({ ...localProfile, workExperience: newWork });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Join Careon</h1>
        <p className="text-slate-500 mb-8 text-center max-w-xs">Sign in to create your professional profile and track your career journey.</p>
        <button 
          onClick={login}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
        >
          <LogIn className="w-5 h-5" /> Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            <span className="font-bold text-lg tracking-tight text-slate-900">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            {editMode ? (
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </button>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
              >
                Edit Profile
              </button>
            )}
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12 space-y-8">
        {/* Header Section */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center shrink-0 overflow-hidden border-4 border-white shadow-lg relative">
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt={user.displayName || ''} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-12 h-12 text-slate-300" />
              )}
            </div>
            <div className="flex-grow space-y-4">
              <div className="space-y-1">
                {editMode ? (
                  <input 
                    className="text-3xl font-black tracking-tight text-slate-900 w-full bg-slate-50 border-none p-0 focus:ring-0"
                    value={localProfile?.displayName || ''}
                    onChange={(e) => setLocalProfile({ ...localProfile, displayName: e.target.value })}
                  />
                ) : (
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{profile?.displayName}</h1>
                )}
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bio</label>
                {editMode ? (
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-600 resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={localProfile?.bio || ''}
                    onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed">{profile?.bio || 'No bio added yet.'}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education Section */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-blue-600 w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Education</h2>
              </div>
              {editMode && (
                <button 
                  onClick={addEducation}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(editMode ? localProfile?.education : profile?.education)?.map((edu: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                  {editMode ? (
                    <div className="space-y-3">
                      <button 
                        onClick={() => removeEducation(idx)}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <input 
                        placeholder="Institution"
                        className="w-full bg-transparent font-bold text-slate-900 border-none p-0 focus:ring-0"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = [...localProfile.education];
                          newEdu[idx].institution = e.target.value;
                          setLocalProfile({ ...localProfile, education: newEdu });
                        }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          placeholder="Degree"
                          className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...localProfile.education];
                            newEdu[idx].degree = e.target.value;
                            setLocalProfile({ ...localProfile, education: newEdu });
                          }}
                        />
                        <input 
                          placeholder="Field of Study"
                          className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0"
                          value={edu.fieldOfStudy}
                          onChange={(e) => {
                            const newEdu = [...localProfile.education];
                            newEdu[idx].fieldOfStudy = e.target.value;
                            setLocalProfile({ ...localProfile, education: newEdu });
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <input 
                          type="text"
                          placeholder="Start - End"
                          className="bg-transparent border-none p-0 focus:ring-0"
                          value={`${edu.startDate} - ${edu.endDate}`}
                          onChange={(e) => {
                            const [start, end] = e.target.value.split(' - ');
                            const newEdu = [...localProfile.education];
                            newEdu[idx].startDate = start || '';
                            newEdu[idx].endDate = end || '';
                            setLocalProfile({ ...localProfile, education: newEdu });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                      <p className="text-xs text-slate-500">{edu.degree} in {edu.fieldOfStudy}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        <span>{edu.startDate} — {edu.endDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(!editMode && profile?.education?.length === 0) && (
                <p className="text-sm text-slate-400 italic text-center py-4">No education history added.</p>
              )}
            </div>
          </section>

          {/* Work Experience Section */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Briefcase className="text-emerald-600 w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Experience</h2>
              </div>
              {editMode && (
                <button 
                  onClick={addWork}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(editMode ? localProfile?.workExperience : profile?.workExperience)?.map((work: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                  {editMode ? (
                    <div className="space-y-3">
                      <button 
                        onClick={() => removeWork(idx)}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <input 
                        placeholder="Company"
                        className="w-full bg-transparent font-bold text-slate-900 border-none p-0 focus:ring-0"
                        value={work.company}
                        onChange={(e) => {
                          const newWork = [...localProfile.workExperience];
                          newWork[idx].company = e.target.value;
                          setLocalProfile({ ...localProfile, workExperience: newWork });
                        }}
                      />
                      <input 
                        placeholder="Position"
                        className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-full"
                        value={work.position}
                        onChange={(e) => {
                          const newWork = [...localProfile.workExperience];
                          newWork[idx].position = e.target.value;
                          setLocalProfile({ ...localProfile, workExperience: newWork });
                        }}
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <input 
                            placeholder="Location"
                            className="bg-transparent border-none p-0 focus:ring-0"
                            value={work.location}
                            onChange={(e) => {
                              const newWork = [...localProfile.workExperience];
                              newWork[idx].location = e.target.value;
                              setLocalProfile({ ...localProfile, workExperience: newWork });
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <input 
                            placeholder="Start - End"
                            className="bg-transparent border-none p-0 focus:ring-0"
                            value={`${work.startDate} - ${work.endDate}`}
                            onChange={(e) => {
                              const [start, end] = e.target.value.split(' - ');
                              const newWork = [...localProfile.workExperience];
                              newWork[idx].startDate = start || '';
                              newWork[idx].endDate = end || '';
                              setLocalProfile({ ...localProfile, workExperience: newWork });
                            }}
                          />
                        </div>
                      </div>
                      <textarea 
                        placeholder="Description"
                        className="w-full bg-transparent text-xs text-slate-600 border-none p-0 focus:ring-0 resize-none"
                        rows={2}
                        value={work.description}
                        onChange={(e) => {
                          const newWork = [...localProfile.workExperience];
                          newWork[idx].description = e.target.value;
                          setLocalProfile({ ...localProfile, workExperience: newWork });
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900">{work.company}</h3>
                          <p className="text-xs text-slate-500">{work.position}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            <span>{work.startDate} — {work.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider justify-end">
                            <MapPin className="w-3 h-3" />
                            <span>{work.location}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{work.description}</p>
                    </div>
                  )}
                </div>
              ))}
              {(!editMode && profile?.workExperience?.length === 0) && (
                <p className="text-sm text-slate-400 italic text-center py-4">No work experience added.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
