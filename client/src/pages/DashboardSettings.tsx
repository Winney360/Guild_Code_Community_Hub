import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { ImageCropModal } from '../components/ImageCropModal.js';

export const DashboardSettings: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'account' | 'notifications'>('profile');

  // Profile Tab Form states
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Skills Tab Form states
  const [skillsInput, setSkillsInput] = useState('');

  // Password / Account Tab Form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications Checkbox states
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [collabInvites, setCollabInvites] = useState(true);

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  const triggerToast = (msg: string) => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
      setToastTimer(null);
    }, 5000); // 5 seconds duration
    setToastTimer(timer);
  };

  const cancelToast = () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      setToastTimer(null);
    }
    setToastMessage(null);
  };

  useEffect(() => {
    // Populate form with current user details
    const fetchProfile = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`/api/users/${user._id}`);
        if (res.ok) {
          const data = await res.json();
          const u = data.data;
          setFullName(u.fullName || '');
          setJobTitle(u.specializations || '');
          setBio(u.bio || '');
          setGithub(u.github || '');
          setLinkedin(u.linkedin || '');
          setLocation(u.location || '');
          setProfilePicture(u.profilePicture || '');
          setSkillsInput(u.skills ? u.skills.join(', ') : '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user]);

  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTempImageSrc(event.target.result as string);
        setShowCropModal(true);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);

  const autoSavePhoto = async (newPhotoUrl: string) => {
    if (!user?._id) return;
    setProfilePicture(newPhotoUrl);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: newPhotoUrl }),
      });
      if (res.ok) {
        triggerToast(newPhotoUrl ? 'Profile photo updated and saved!' : 'Profile photo removed!');
        if (checkAuth) await checkAuth();
      }
    } catch (err) {
      console.error('Error auto-saving photo:', err);
    }
  };

  const handleRemovePhoto = () => {
    setShowRemoveConfirmModal(true);
  };

  const confirmRemovePhoto = () => {
    autoSavePhoto('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowRemoveConfirmModal(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setError('');
    setSuccess(false);
    setLoading(true);

    if (bio.length > 300) {
      setError('Bio cannot exceed 300 characters');
      setLoading(false);
      return;
    }

    const payload = {
      fullName,
      specializations: jobTitle,
      bio,
      github,
      linkedin,
      location,
      profilePicture,
    };

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not update profile');
      } else {
        setSuccess(true);
        triggerToast('Profile updated successfully!');
        setIsEditingProfile(false);
        if (checkAuth) {
          await checkAuth();
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setError('');
    setSuccess(false);
    setLoading(true);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not update skills');
      } else {
        setSuccess(true);
        triggerToast('Skills configuration updated!');
        setIsEditingSkills(false);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not update password');
      } else {
        setSuccess(true);
        triggerToast('Password successfully changed!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Title */}
      <div className="flex justify-between items-start select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Settings</h1>
          <p className="text-xs text-[#5c7075]">Manage your account and profile preferences.</p>
        </div>

        {/* Global profile picture at top right */}
        <div className="relative">
          <button 
            onClick={() => setActiveTab('account')}
            className="relative w-12 h-12 rounded-full overflow-hidden bg-[#e6f7f8] border-2 border-[#006655]/20 hover:border-[#006655] shadow-sm select-none cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            title="Manage profile photo"
          >
            {profilePicture ? (
              <img src={profilePicture} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-black text-[#006655] tracking-wider">
                {getInitials(fullName)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hidden Global file input for profile picture management */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Tabs list (matching MemberDashboard-Settings.png) */}
      <div className="flex border-b border-slate-100 select-none">
        <button
          onClick={() => { setActiveTab('profile'); setError(''); setSuccess(false); }}
          className={`px-6 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => { setActiveTab('skills'); setError(''); setSuccess(false); }}
          className={`px-6 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'skills'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Skills & Specializations
        </button>
        <button
          onClick={() => { setActiveTab('account'); setError(''); setSuccess(false); }}
          className={`px-6 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'account'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => { setActiveTab('notifications'); setError(''); setSuccess(false); }}
          className={`px-6 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Notifications
        </button>
      </div>

      {/* Form Area */}
      {activeTab === 'profile' && (
        !isEditingProfile ? (
          /* Read-Only Details Mode */
          <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-2 select-none">
              <div>
                <h3 className="font-extrabold text-sm text-[#091e22]">Personal Information</h3>
                <p className="text-[10px] text-slate-400">Your profile details as visible to the community.</p>
              </div>
              <button
                onClick={() => { setError(''); setSuccess(false); setIsEditingProfile(true); }}
                className="bg-[#006655]/10 hover:bg-[#006655]/20 text-[#006655] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1 select-none">Full Name</span>
                <span className="text-xs font-bold text-[#091e22]">{fullName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1 select-none">Job Title</span>
                <span className="text-xs font-bold text-[#091e22]">{jobTitle || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1 select-none">Location</span>
                <span className="text-xs font-bold text-[#091e22]">{location || 'Not specified'}</span>
              </div>
              <div className="md:col-span-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1 select-none">Bio</span>
                <p className="text-xs font-medium text-[#5c7075] leading-relaxed whitespace-pre-line bg-[#f8fafc] border border-slate-100 p-4 rounded-2xl">
                  {bio || 'No bio description provided yet.'}
                </p>
              </div>
            </div>

            {/* Read-Only Socials */}
            <div className="border-t border-slate-50 pt-6 space-y-4">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider select-none">Social Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl transition-colors font-bold text-xs"
                  >
                    <span className="text-base select-none">🔗</span>
                    <div className="min-w-0 flex-grow">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider select-none">GitHub Profile</span>
                      <span className="text-xs text-[#006655] hover:underline truncate block">{github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50/30 border border-slate-100 rounded-2xl text-slate-400 text-[11px] font-semibold select-none">
                    <span>🔗</span>
                    <span>GitHub link not configured</span>
                  </div>
                )}

                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl transition-colors font-bold text-xs"
                  >
                    <span className="text-base select-none">🔗</span>
                    <div className="min-w-0 flex-grow">
                      <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider select-none">LinkedIn / Website</span>
                      <span className="text-xs text-[#006655] hover:underline truncate block">{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50/30 border border-slate-100 rounded-2xl text-slate-400 text-[11px] font-semibold select-none">
                    <span>🔗</span>
                    <span>LinkedIn/Website not configured</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verified member box */}
            <div className="border border-slate-100 bg-emerald-50/20 rounded-3xl p-6 select-none flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-emerald-800">Verified Member</h4>
                <p className="text-[10px] text-[#5c7075] leading-relaxed mt-1">
                  Your identity has been verified. You have access to exclusive ecosystem rewards.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Editable Form Mode */
          <form onSubmit={handleSaveProfile} className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2 select-none">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1 select-none">Full Name (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={fullName}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-400 select-none outline-none cursor-not-allowed"
                    title="Name changes must be requested through system administration."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-[#5c7075] block">Bio</label>
                  <span className="text-[9px] font-bold text-slate-400 select-none">
                    {bio.length}/250
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={250}
                  rows={4}
                  placeholder="Tell the community about yourself..."
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <span className="text-[9px] text-slate-400 block mt-1 select-none">
                  Brief description for your profile. Maximum 250 characters.
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t border-slate-50 pt-6 space-y-4">
              <h3 className="font-extrabold text-sm select-none">Social Links</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="bg-[#f8fafc] border border-slate-200 p-2 rounded-xl text-slate-400 w-10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="bg-[#f8fafc] border border-slate-200 p-2 rounded-xl text-slate-400 w-10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    placeholder="LinkedIn or Portfolio Website"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save/Cancel Action Row */}
            <div className="flex justify-end gap-3 select-none pt-4 border-t border-slate-50">
              {error && (
                <span className="text-red-500 text-xs self-center flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </span>
              )}
              <button
                type="button"
                onClick={() => { setError(''); setIsEditingProfile(false); }}
                className="bg-slate-50 hover:bg-slate-100 text-[#5c7075] hover:text-[#091e22] py-2.5 px-6 rounded-xl font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )
      )}

      {/* Skills Tab Form */}
      {activeTab === 'skills' && (
        !isEditingSkills ? (
          /* Read-Only Details Mode */
          <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-2 select-none">
              <div>
                <h3 className="font-extrabold text-sm text-[#091e22]">Skills & Specializations</h3>
                <p className="text-[10px] text-slate-400">Your core technologies, tools, and paradigms.</p>
              </div>
              <button
                type="button"
                onClick={() => { setError(''); setSuccess(false); setIsEditingSkills(true); }}
                className="bg-[#006655]/10 hover:bg-[#006655]/20 text-[#006655] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Edit Skills</span>
              </button>
            </div>

            {/* Badges container */}
            <div className="flex flex-wrap gap-2 py-2">
              {skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0).length > 0 ? (
                skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0).map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-1.5 bg-[#006655]/5 border border-[#006655]/10 text-[#006655] rounded-xl text-xs font-bold uppercase select-none transition-all hover:scale-105"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold py-4 select-none">No skills configured yet. Click "Edit Skills" to add your core tech stack.</p>
              )}
            </div>
          </div>
        ) : (
          /* Editable Form Mode */
          <form onSubmit={handleSaveSkills} className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2 select-none">Skills & Specializations</h3>
              <p className="text-xs text-[#5c7075] mb-6">List key languages, tools, and paradigms you excel at.</p>
              
              <label className="text-[10px] font-bold text-[#5c7075] block mb-1">My Skills (Comma separated list)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Rust, Go, Distributed Systems, WebAssembly"
                className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 select-none pt-4 border-t border-slate-50">
              {error && (
                <span className="text-red-500 text-xs self-center flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </span>
              )}
              <button
                type="button"
                onClick={() => { setError(''); setIsEditingSkills(false); }}
                className="bg-slate-50 hover:bg-slate-100 text-[#5c7075] hover:text-[#091e22] py-2.5 px-6 rounded-xl font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Skills'}
              </button>
            </div>
          </form>
        )
      )}

      {/* Password Account Form */}
      {activeTab === 'account' && (
        <div className="max-w-2xl space-y-6 animate-fade-in">
          {/* Profile Photo Management card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-4 select-none">Profile Picture</h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#e6f7f8] dark:bg-[#1a292c] border-2 border-[#006655]/20 flex items-center justify-center shadow-sm select-none">
                {profilePicture ? (
                  <img src={profilePicture} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-[#006655] tracking-wider">
                    {getInitials(fullName)}
                  </span>
                )}
              </div>

              <div className="flex-grow space-y-3 w-full sm:w-auto">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-4 rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{profilePicture ? 'Upload New Photo' : 'Upload Photo'}</span>
                  </button>

                  {profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="bg-slate-50 hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 py-2 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-[#5c7075] select-none">
                  PNG, JPG, WEBP or GIF format. Max file size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Change Password Form card */}
          <form onSubmit={handleSavePassword} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2 select-none">Change Password</h3>
              <p className="text-xs text-[#5c7075] mb-6">Ensure your credentials are secure and updated regularly.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 select-none pt-4 border-t border-slate-50">
              {error && (
                <span className="text-red-500 text-xs self-center flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </span>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-5 rounded-xl font-bold text-xs shadow-sm cursor-pointer"
              >
                {loading ? 'Saving...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 select-none">
          <div>
            <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2">Notification Settings</h3>
            <p className="text-xs text-[#5c7075] mb-6">Manage how you receive alerts and updates from the Guild ecosystem.</p>
            
            <div className="space-y-4 text-xs font-semibold text-[#091e22]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 text-[#006655] focus:ring-[#006655] border-slate-300 rounded"
                />
                <div>
                  <span className="block">Email Notifications</span>
                  <span className="text-[10px] text-slate-400 font-normal">Receive weekly summaries of popular projects and applications.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collabInvites}
                  onChange={(e) => setCollabInvites(e.target.checked)}
                  className="w-4 h-4 text-[#006655] focus:ring-[#006655] border-slate-300 rounded"
                />
                <div>
                  <span className="block">Collaboration Invitations</span>
                  <span className="text-[10px] text-slate-400 font-normal">Allow other project builders to send you invitations to collaborate.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50">
            <button
              onClick={() => { setSuccess(true); triggerToast('Notification preferences updated!'); }}
              className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-5 rounded-xl font-bold text-xs shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {success && <span className="sr-only">Success</span>}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white border border-slate-100 text-[#091e22] px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-slide-in select-none dark:bg-[#121e21] dark:border-[#1e2e30] dark:text-[#f1f5f9]">
          <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="mr-2">{toastMessage}</span>
          <button 
            onClick={cancelToast}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0 p-0.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Dismiss alert"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Confirmation Modal for Profile Photo Removal */}
      {showRemoveConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-center font-extrabold text-base text-[#091e22] mb-2">Remove Profile Photo?</h3>
            <p className="text-center text-xs text-[#5c7075] mb-6 leading-relaxed">
              Are you sure you want to remove your profile photo? Your initials will be displayed instead.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRemoveConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#091e22] font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemovePhoto}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Image Crop & Adjust Modal */}
      {showCropModal && tempImageSrc && (
        <ImageCropModal
          imageSrc={tempImageSrc}
          onClose={() => {
            setShowCropModal(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          onCropComplete={(croppedDataUrl) => {
            autoSavePhoto(croppedDataUrl);
            setShowCropModal(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />
      )}

    </div>
  );
};
export default DashboardSettings;
