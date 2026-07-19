import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';

export const DashboardSettings: React.FC = () => {
  const { user } = useAuth();

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
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Settings</h1>
          <p className="text-xs text-[#5c7075]">Manage your account and profile preferences.</p>
        </div>
      </div>

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
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Personal Info & Socials (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2 select-none">Personal Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
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

              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Bio</label>
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
            <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2 select-none">Social Links</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className="bg-[#f8fafc] border border-slate-200 p-2 rounded-xl text-xs select-none w-10 text-center">💻</span>
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <span className="bg-[#f8fafc] border border-slate-200 p-2 rounded-xl text-xs select-none w-10 text-center">🔗</span>
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

            {/* Save Buttons row */}
            <div className="flex justify-end gap-3 select-none">
              {error && <span className="text-red-500 text-xs self-center">⚠️ {error}</span>}
              {success && <span className="text-green-600 text-xs self-center">✅ Profile updated successfully!</span>}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Profile photo sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm text-center flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 block select-none">Profile Photo</span>
              
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-150 mb-6 border border-slate-100">
                {profilePicture ? (
                  <img src={profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                <input
                  type="url"
                  placeholder="Paste Profile Photo URL"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-[10px] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setProfilePicture('')}
                  className="text-red-500 hover:underline text-[10px] font-semibold block mx-auto select-none"
                >
                  Remove
                </button>
              </div>

              <span className="text-[9px] text-[#5c7075] mt-6 select-none leading-relaxed">
                PNG or JPG format. Make sure the URL points to a valid image address.
              </span>
            </div>

            {/* Verified member box */}
            <div className="border border-slate-100 bg-emerald-50/20 rounded-3xl p-6 select-none flex items-start gap-4">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="font-extrabold text-xs text-emerald-800">Verified Member</h4>
                <p className="text-[10px] text-[#5c7075] leading-relaxed mt-1">
                  Your identity has been verified. You have access to exclusive ecosystem rewards.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Skills Tab Form */}
      {activeTab === 'skills' && (
        <form onSubmit={handleSaveSkills} className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
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
            {error && <span className="text-red-500 text-xs self-center">⚠️ {error}</span>}
            {success && <span className="text-green-600 text-xs self-center">✅ Skills configuration updated!</span>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-5 rounded-xl font-bold text-xs shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Skills'}
            </button>
          </div>
        </form>
      )}

      {/* Password Account Form */}
      {activeTab === 'account' && (
        <form onSubmit={handleSavePassword} className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
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
            {error && <span className="text-red-500 text-xs self-center">⚠️ {error}</span>}
            {success && <span className="text-green-600 text-xs self-center">✅ Password successfully changed!</span>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-5 rounded-xl font-bold text-xs shadow-sm"
            >
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
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
              onClick={() => { setSuccess(true); setTimeout(() => setSuccess(false), 2000); }}
              className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-5 rounded-xl font-bold text-xs shadow-sm"
            >
              Save Preferences
            </button>
          </div>
          {success && <p className="text-green-600 text-xs text-right mt-2">✅ Notification preferences updated!</p>}
        </div>
      )}

    </div>
  );
};
export default DashboardSettings;
