import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

export const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form states
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Web' | 'Mobile' | 'Design' | 'AI' | 'Cloud Infrastructure'>('Web');
  const [techInput, setTechInput] = useState(''); // Comma separated
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'in-progress' | 'completed'>('in-progress');
  
  // Links
  const [liveDemo, setLiveDemo] = useState('');
  const [github, setGithub] = useState('');
  const [figma, setFigma] = useState('');
  const [notebook, setNotebook] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // File input ref for cover image browser
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCoverImage(event.target.result as string);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        setFetchLoading(true);
        try {
          const res = await fetch(`/api/projects/${id}`);
          if (res.ok) {
            const data = await res.json();
            const p = data.data;
            setTitle(p.title);
            setShortDescription(p.shortDescription || '');
            setDescription(p.description || '');
            setCategory(p.category);
            setTechInput(p.techStack.join(', '));
            setCoverImage(p.coverImage);
            setStatus(p.status);
            if (p.links) {
              setLiveDemo(p.links.liveDemo || '');
              setGithub(p.links.github || '');
              setFigma(p.links.figma || '');
              setNotebook(p.links.notebook || '');
            }
          } else {
            setError('Failed to fetch project details');
          }
        } catch (err) {
          console.error(err);
          setError('Could not connect to server');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);

  const handleSaveDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter at least a project title to save as a draft.');
      return;
    }
    setError('');
    setSuccess(false);
    setLoading(true);

    const techStack = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      shortDescription: shortDescription || 'Draft project description',
      description: description || 'Draft project details',
      category,
      techStack: techStack.length > 0 ? techStack : ['Draft'],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&h=337&fit=crop',
      status: 'in-progress',
      isVisible: false,
      links: {
        liveDemo,
        github,
        figma,
        notebook,
      },
    };

    try {
      const url = isEditMode ? `/api/projects/${id}` : '/api/projects';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not save draft');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/projects');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to server. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validate techStack count (max 8)
    const techStack = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (techStack.length > 8) {
      setError('Tech stack cannot exceed 8 items');
      setLoading(false);
      return;
    }

    // Publish always sets status to completed and makes project visible
    const payload = {
      title,
      shortDescription,
      description,
      category,
      techStack,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&h=337&fit=crop',
      status: isEditMode ? status : 'completed',
      isVisible: true,
      links: {
        liveDemo,
        github,
        figma,
        notebook,
      },
    };

    try {
      const url = isEditMode ? `/api/projects/${id}` : '/api/projects';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not submit project');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/projects');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to server. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        navigate('/dashboard/projects');
      } else {
        const data = await res.json();
        setError(data.message || 'Could not delete project');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Fetching project details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-6 md:p-8 rounded-3xl shadow-sm font-sans text-[#091e22]">
      {/* Title */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#006655]/30 dark:border-[#00a88a]/40 select-none">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {isEditMode ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-[10px] text-[#5c7075] mt-0.5">
            {isEditMode ? 'Update your build configuration and assets.' : 'Share your build with the Guild Code community.'}
          </p>
        </div>
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Delete Project
          </button>
        )}
      </div>

      <ScrollReveal>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title input with live character counter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-[#5c7075]">Project Title *</label>
            <span className="text-[9px] font-semibold text-slate-400">{title.length}/80 chars</span>
          </div>
          <input
            type="text"
            required
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scalr Edge Routing Protocol"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
          />
        </div>

        {/* Categories & Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="Web">Web App</option>
              <option value="Mobile">Mobile App</option>
              <option value="Design">UI / Design</option>
              <option value="AI">AI & Machine Learning</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="in-progress">{isEditMode ? 'Draft (In-Progress)' : 'Draft'}</option>
              <option value="completed">Published</option>
            </select>
          </div>
        </div>

        {/* Short Description with live character counter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-[#5c7075]">Short Description * (Max 150 chars)</label>
            <span className={`text-[9px] font-semibold ${shortDescription.length >= 140 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
              {shortDescription.length}/150 chars
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={150}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A brief tagline summarizing the project..."
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
          />
        </div>

        {/* Full Description with live character counter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-[#5c7075]">About the Project * (Max 500 chars)</label>
            <span className={`text-[9px] font-semibold ${description.length >= 450 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
              {description.length}/500 chars
            </span>
          </div>
          <textarea
            required
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Detailed description of the architectural decisions, tools used, and mission..."
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
          />
        </div>

        {/* Tech stack tags with item counter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-[#5c7075]">Tech Stack * (Comma separated)</label>
            <span className="text-[9px] font-semibold text-slate-400">
              {techInput.split(',').filter((t) => t.trim()).length}/8 items
            </span>
          </div>
          <input
            type="text"
            required
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. Rust, WebAssembly, gRPC, Docker"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
          />
        </div>

        {/* Cover Image File Browser (Upload from PC or Mobile phone) */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Cover Image *</label>
          <input
            type="file"
            ref={coverImageInputRef}
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="hidden"
          />

          <div className="border-2 border-dashed border-slate-200 hover:border-[#006655]/40 rounded-2xl p-4 bg-[#f8fafc] transition-colors">
            {coverImage ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-40 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm relative">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-grow">
                  <span className="text-xs font-bold text-[#091e22] block">Cover Image Selected</span>
                  <p className="text-[10px] text-[#5c7075]">Image file loaded from your device and ready for submission.</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => coverImageInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#006655] hover:bg-[#004d40] text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-red-600 border border-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 select-none text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#091e22] mb-0.5">Browse cover image file</span>
                <p className="text-[10px] text-slate-400 mb-3">Choose an image from your PC or mobile phone (PNG, JPG, WEBP)</p>
                <button
                  type="button"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="px-4 py-2 bg-[#006655] hover:bg-[#004d40] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Browse File from Device
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conditional Project Links Section based on Category */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-5 space-y-4 bg-slate-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006655] block select-none">
              Project Links ({category} Project)
            </span>
            <span className="text-[9px] text-slate-400 font-semibold">Tailored for {category} builds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category = Web */}
            {category === 'Web' && (
              <>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">Live Web App URL</label>
                  <input
                    type="url"
                    value={liveDemo}
                    onChange={(e) => setLiveDemo(e.target.value)}
                    placeholder="https://my-web-app.vercel.app"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
              </>
            )}

            {/* Category = Mobile */}
            {category === 'Mobile' && (
              <>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">App Store / Play Store / APK URL</label>
                  <input
                    type="url"
                    value={liveDemo}
                    onChange={(e) => setLiveDemo(e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">GitHub / Source Code Repository</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username/mobile-app"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
              </>
            )}

            {/* Category = Design */}
            {category === 'Design' && (
              <>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">Figma / Design Prototype URL</label>
                  <input
                    type="url"
                    value={figma}
                    onChange={(e) => setFigma(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">Dribbble / Behance / Portfolio URL</label>
                  <input
                    type="url"
                    value={liveDemo}
                    onChange={(e) => setLiveDemo(e.target.value)}
                    placeholder="https://dribbble.com/shots/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
              </>
            )}

            {/* Category = AI */}
            {category === 'AI' && (
              <>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">Google Colab / Data Notebook URL</label>
                  <input
                    type="url"
                    value={notebook}
                    onChange={(e) => setNotebook(e.target.value)}
                    placeholder="https://colab.research.google.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">Model Hub / HuggingFace Demo URL</label>
                  <input
                    type="url"
                    value={liveDemo}
                    onChange={(e) => setLiveDemo(e.target.value)}
                    placeholder="https://huggingface.co/spaces/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">GitHub / Code Repository URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username/ai-project"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
              </>
            )}

            {/* Category = Cloud Infrastructure */}
            {category === 'Cloud Infrastructure' && (
              <>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">Live Console / Architecture Demo URL</label>
                  <input
                    type="url"
                    value={liveDemo}
                    onChange={(e) => setLiveDemo(e.target.value)}
                    placeholder="https://console.aws.amazon.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#5c7075] block mb-1">IaC / Infrastructure Code Repo URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username/terraform-infra"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action feedback */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-150 p-3.5 rounded-xl text-xs select-none flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-150 p-3.5 rounded-xl text-xs select-none flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Project configuration {isEditMode ? 'updated' : 'created'} successfully! Redirecting...</span>
          </div>
        )}

        {/* Submit row with Save as Draft option */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#006655]/30 dark:border-[#00a88a]/40 select-none">
          <Link
            to="/dashboard/projects"
            className="w-full sm:w-auto text-center px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={loading}
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#091e22] border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save as Draft</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#006655] hover:bg-[#004d40] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Publish Project')}</span>
            </button>
          </div>
        </div>
      </form>
      </ScrollReveal>
    </div>
  );
};
export default ProjectForm;
