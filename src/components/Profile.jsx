import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import './Profile.css';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sprout,
  Award,
  Layers,
  Camera,
  Trash2,
  Save,
  CheckCircle2,
  Tractor,
  Clock,
  Sparkles,
  ShieldCheck,
  Undo2,
  DollarSign,
  Info,
  ShoppingBag,
  Home,
  Building,
  Navigation,
  Image as ImageIcon,
  Palette,
  X,
  ExternalLink,
} from 'lucide-react';

// Farming type options for Farmer role
const FARMING_TYPES = [
  'Organic',
  'Natural / Zero Budget',
  'Hydroponic',
  'Traditional',
  'Polyhouse / Greenhouse',
  'Permaculture',
  'Mixed Farming',
];

// Curated high quality agricultural & nature cover presets
const COVER_PRESETS = [
  {
    id: 'lush-fields',
    label: 'Lush Fields',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'golden-harvest',
    label: 'Golden Harvest',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fresh-market',
    label: 'Fresh Produce',
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'morning-valley',
    label: 'Morning Valley',
    url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
  },
];

/**
 * Reusable, responsive Profile component for both Farmer and Buyer dashboards.
 * Features:
 * - Circular, non-collapsible responsive avatar with fallback initials
 * - Custom background/cover image support (upload file, URL, or preset)
 * - Complete personal, farm, and delivery address management
 * - Fast canvas compression for avatar and banner uploads
 */
const Profile = ({
  role: propRole,
  productsCount = 0,
  ordersCount = 0,
  cartCount = 0,
}) => {
  const { user, updateUser } = useAuth();
  const effectiveRole = propRole || user?.role || 'farmer';
  const isFarmer = effectiveRole === 'farmer';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    coverImage: '',
    bio: '',
    // Farmer fields
    farmName: '',
    farmLocation: '',
    farmSize: '',
    farmingType: 'Organic',
    primaryCrops: '',
    experienceYears: 0,
    certifications: '',
    upiId: '',
    // Buyer fields
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Avatar states
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [imgLoadError, setImgLoadError] = useState(false);

  // Background / Cover Image states
  const [coverPreview, setCoverPreview] = useState(null);
  const [isCoverChanged, setIsCoverChanged] = useState(false);
  const [showCoverControls, setShowCoverControls] = useState(false);
  const [showCoverUrlInput, setShowCoverUrlInput] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [coverLoadError, setCoverLoadError] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // File input refs
  const avatarFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const populateForm = (data) => {
    const avatar = data.avatar || '';
    const cover = data.coverImage || data.backgroundImage || '';

    setFormData({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      avatar: avatar,
      coverImage: cover,
      bio: data.bio || '',
      farmName: data.farmName || '',
      farmLocation: data.farmLocation || '',
      farmSize: data.farmSize || '',
      farmingType: data.farmingType || 'Organic',
      primaryCrops: data.primaryCrops || '',
      experienceYears: data.experienceYears ?? 0,
      certifications: data.certifications || '',
      upiId: data.upiId || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
    });

    setPhotoPreview(avatar || null);
    setCoverPreview(cover || null);
    setIsPhotoChanged(false);
    setIsCoverChanged(false);
    setImgLoadError(false);
    setCoverLoadError(false);
  };

  const loadProfile = async () => {
    setFetching(true);
    try {
      const res = await API.get('/auth/me');
      const currentUser = res.data?.data?.user || res.data?.user || user;
      if (currentUser) {
        populateForm(currentUser);
        if (updateUser) updateUser(currentUser);
      }
    } catch {
      if (user) {
        populateForm(user);
      }
    } finally {
      setFetching(false);
    }
  };

  // Load profile from server on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experienceYears' ? Number(value) || 0 : value,
    }));
  };

  // Image compressor for avatar & cover uploads
  const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Avatar file selection
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar size must be less than 5MB');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file, 400, 400, 0.85);
      setPhotoPreview(compressedBase64);
      setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
      setIsPhotoChanged(true);
      setImgLoadError(false);
      toast.success('Profile photo ready! Click Save Changes to apply.');
    } catch {
      toast.error('Failed to process image file.');
    } finally {
      if (avatarFileRef.current) avatarFileRef.current.value = '';
    }
  };

  // Apply custom avatar URL
  const handleApplyAvatarUrl = () => {
    if (!customAvatarUrl.trim()) return;
    try {
      new URL(customAvatarUrl.trim());
      setPhotoPreview(customAvatarUrl.trim());
      setFormData((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
      setIsPhotoChanged(true);
      setShowAvatarUrlInput(false);
      setCustomAvatarUrl('');
      setImgLoadError(false);
      toast.success('Avatar image URL applied!');
    } catch {
      toast.error('Please enter a valid URL (starting with http:// or https://)');
    }
  };

  // Remove avatar
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setIsPhotoChanged(true);
    setImgLoadError(false);
    toast.success('Photo removed. Default fallback avatar will be used.');
  };

  // Revert avatar
  const handleRevertPhoto = () => {
    const originalAvatar = user?.avatar || '';
    setPhotoPreview(originalAvatar || null);
    setFormData((prev) => ({ ...prev, avatar: originalAvatar }));
    setIsPhotoChanged(false);
    setImgLoadError(false);
  };

  // Cover image file selection
  const handleCoverFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Background image must be under 8MB');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file, 1200, 500, 0.8);
      setCoverPreview(compressedBase64);
      setFormData((prev) => ({
        ...prev,
        coverImage: compressedBase64,
      }));
      setIsCoverChanged(true);
      setCoverLoadError(false);
      setShowCoverControls(false);
      toast.success('Cover photo preview updated! Click Save Changes to apply.');
    } catch {
      toast.error('Failed to process background image.');
    } finally {
      if (coverFileRef.current) coverFileRef.current.value = '';
    }
  };

  // Apply custom cover URL
  const handleApplyCoverUrl = () => {
    if (!customCoverUrl.trim()) return;
    try {
      new URL(customCoverUrl.trim());
      setCoverPreview(customCoverUrl.trim());
      setFormData((prev) => ({ ...prev, coverImage: customCoverUrl.trim() }));
      setIsCoverChanged(true);
      setCoverLoadError(false);
      setShowCoverControls(false);
      setCustomCoverUrl('');
      toast.success('Cover photo URL applied!');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  // Select a preset cover
  const handleSelectPresetCover = (presetUrl) => {
    setCoverPreview(presetUrl);
    setFormData((prev) => ({ ...prev, coverImage: presetUrl }));
    setIsCoverChanged(true);
    setCoverLoadError(false);
    setShowCoverControls(false);
    toast.success('Preset cover selected! Click Save to apply.');
  };

  // Remove cover image
  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData((prev) => ({ ...prev, coverImage: '' }));
    setIsCoverChanged(true);
    setCoverLoadError(false);
    setShowCoverControls(false);
    toast.success('Background image removed. Default gradient banner restored.');
  };

  // Revert cover changes
  const handleRevertCover = () => {
    const originalCover = user?.coverImage || user?.backgroundImage || '';
    setCoverPreview(originalCover || null);
    setFormData((prev) => ({ ...prev, coverImage: originalCover }));
    setIsCoverChanged(false);
    setCoverLoadError(false);
  };

  // Submit profile updates
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number cannot be empty');
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar,
        coverImage: formData.coverImage,
        backgroundImage: formData.coverImage,
        bio: formData.bio.trim(),
        ...(isFarmer
          ? {
              farmName: formData.farmName.trim(),
              farmLocation: formData.farmLocation.trim(),
              farmSize: formData.farmSize.trim(),
              farmingType: formData.farmingType,
              primaryCrops: formData.primaryCrops.trim(),
              experienceYears: Number(formData.experienceYears) || 0,
              certifications: formData.certifications.trim(),
              upiId: formData.upiId.trim(),
            }
          : {
              address: formData.address.trim(),
              city: formData.city.trim(),
              state: formData.state.trim(),
              pincode: formData.pincode.trim(),
            }),
      };

      const res = await API.patch('/auth/profile', payload);
      const updatedUser = res.data?.data?.user || res.data?.user;

      if (updatedUser) {
        if (updateUser) updateUser(updatedUser);
        populateForm(updatedUser);
        setIsEditing(false);
        setIsPhotoChanged(false);
        setIsCoverChanged(false);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to update profile. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) populateForm(user);
    setIsEditing(false);
    setIsPhotoChanged(false);
    setIsCoverChanged(false);
  };

  // Initials generator
  const getInitials = (name) => {
    if (!name) return isFarmer ? 'FM' : 'BY';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (fetching) {
    return (
      <div className="profile-container">
        <div className="profile-card p-12 text-center">
          <div className="profile-spinner" />
          <p className="text-gray-600 font-medium text-sm">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const hasCustomCover = Boolean(coverPreview && !coverLoadError);

  return (
    <div className="profile-container">
      {/* ─── HERO BANNER CARD ─── */}
      <div className="profile-card">
        {/* Banner with background image or gradient */}
        <div
          className="profile-banner-container"
          style={
            hasCustomCover
              ? { backgroundImage: `url("${coverPreview}")` }
              : undefined
          }
        >
          {/* Subtle pattern when no photo */}
          {!hasCustomCover && <div className="profile-banner-pattern" />}

          {/* Dark overlay for high contrast text readability */}
          {hasCustomCover && <div className="profile-banner-overlay" />}

          {/* Top banner controls */}
          <div className="profile-banner-top">
            <span className="profile-banner-badge">
              {isFarmer ? (
                <>
                  <Tractor className="w-3.5 h-3.5 text-emerald-300" />
                  Verified Farmer Profile
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
                  Verified Buyer Profile
                </>
              )}
            </span>

            <div className="profile-banner-actions">
              {/* Change Cover / Background Button */}
              <button
                type="button"
                onClick={() => setShowCoverControls(!showCoverControls)}
                className="profile-banner-btn profile-banner-btn-secondary"
                title="Change background cover photo"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Background</span>
              </button>

              {/* Edit Mode Toggle */}
              {isEditing ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Editing
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="profile-banner-btn"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-600" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Banner bottom title */}
          <div className="profile-banner-info">
            <h2 className="profile-banner-title">
              {isFarmer
                ? formData.farmName || `${formData.name || 'Farmer'}'s Farm`
                : formData.name || 'Valued Customer'}
            </h2>
            <p className="profile-banner-subtitle">
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              {isFarmer
                ? formData.farmLocation || 'Farm location not specified'
                : formData.city
                ? `${formData.city}${formData.state ? `, ${formData.state}` : ''}`
                : 'Primary delivery address not set'}
              {isFarmer && formData.farmSize && (
                <>
                  <span className="opacity-60">•</span>
                  <span>{formData.farmSize}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* ─── COVER PHOTO PICKER DRAWER ─── */}
        {showCoverControls && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Customize Background Image
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCoverControls(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => coverFileRef.current?.click()}
                className="profile-action-btn profile-action-btn-primary"
              >
                <Camera className="w-3.5 h-3.5" />
                Upload Photo
              </button>

              <button
                type="button"
                onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
                className="profile-action-btn profile-action-btn-secondary"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Image URL
              </button>

              {coverPreview && (
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="profile-action-btn profile-action-btn-danger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Background
                </button>
              )}

              {isCoverChanged && (
                <button
                  type="button"
                  onClick={handleRevertCover}
                  className="profile-action-btn profile-action-btn-warning"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo
                </button>
              )}
            </div>

            {/* Custom Cover URL Input */}
            {showCoverUrlInput && (
              <div className="mt-3 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="url"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  placeholder="Paste banner image link e.g. https://images.unsplash.com/..."
                  className="profile-input profile-input-no-icon text-xs flex-1"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleApplyCoverUrl}
                    className="profile-submit-btn text-xs py-2 px-3"
                  >
                    Apply URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCoverUrlInput(false)}
                    className="profile-cancel-btn text-xs py-2 px-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Hidden file input for cover */}
            <input
              ref={coverFileRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleCoverFileSelect}
              className="hidden"
            />

            {/* Preset themes selection */}
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-gray-500 mb-1.5">
                Or choose a curated theme:
              </p>
              <div className="profile-cover-presets">
                {COVER_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPresetCover(preset.url)}
                    className="profile-preset-thumb group"
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} loading="lazy" />
                    <span className="profile-preset-label">{preset.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── AVATAR & IDENTITY SECTION ─── */}
        <div className="profile-header-body">
          <div className="profile-header-main">
            {/* Left: Avatar + User Names */}
            <div className="profile-identity-group">
              {/* Circular, non-collapsible responsive avatar */}
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {photoPreview && !imgLoadError ? (
                    <img
                      src={photoPreview}
                      alt={formData.name || 'User Profile Photo'}
                      className="profile-avatar-img"
                      onError={() => setImgLoadError(true)}
                    />
                  ) : (
                    <div
                      className={`profile-avatar-fallback ${
                        !isFarmer ? 'buyer-theme' : ''
                      }`}
                    >
                      <span className="profile-avatar-initials">
                        {getInitials(formData.name)}
                      </span>
                      <span className="profile-avatar-role">
                        {isFarmer ? 'Farmer' : 'Buyer'}
                      </span>
                    </div>
                  )}

                  {/* Photo change indicator */}
                  {isPhotoChanged && (
                    <div
                      className="profile-avatar-status-dot"
                      title="Photo modified - click Save to persist"
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Circular camera action button */}
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="profile-avatar-camera-btn"
                  title="Upload / Change profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={avatarFileRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />
              </div>

              {/* User details */}
              <div className="profile-identity-details">
                <div className="profile-identity-name-row">
                  <h1 className="profile-user-name">
                    {formData.name || (isFarmer ? 'Farmer' : 'Customer')}
                  </h1>
                  <span className="profile-verified-badge">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {isFarmer ? 'Verified Farmer' : 'Verified Buyer'}
                  </span>
                </div>

                <div className="profile-contact-row">
                  <span className="profile-contact-item">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {formData.email || 'No email'}
                  </span>
                  <span>•</span>
                  <span className="profile-contact-item">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {formData.phone || 'No phone'}
                  </span>
                </div>

                {isFarmer && formData.farmingType ? (
                  <div className="profile-specialist-tag">
                    <Sprout className="w-3.5 h-3.5" />
                    <span>{formData.farmingType} Farming Specialist</span>
                  </div>
                ) : !isFarmer ? (
                  <div className="profile-specialist-tag">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Farm2Home Direct Consumer</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right: Avatar Controls */}
            <div className="profile-photo-controls">
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                className="profile-action-btn profile-action-btn-primary"
              >
                <Camera className="w-3.5 h-3.5" />
                Upload Photo
              </button>

              <button
                type="button"
                onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                className="profile-action-btn profile-action-btn-secondary"
              >
                URL
              </button>

              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="profile-action-btn profile-action-btn-danger"
                  title="Remove photo and use initials avatar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}

              {isPhotoChanged && (
                <button
                  type="button"
                  onClick={handleRevertPhoto}
                  className="profile-action-btn profile-action-btn-warning"
                  title="Undo photo changes"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo
                </button>
              )}
            </div>
          </div>

          {/* Photo URL Drawer */}
          {showAvatarUrlInput && (
            <div className="profile-drawer-box">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="Paste direct image link e.g. https://images.unsplash.com/..."
                  className="profile-input profile-input-no-icon text-xs flex-1"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleApplyAvatarUrl}
                    className="profile-submit-btn text-xs py-2 px-3"
                  >
                    Apply URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAvatarUrlInput(false)}
                    className="profile-cancel-btn text-xs py-2 px-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alert if avatar or cover modified but not saved */}
          {(isPhotoChanged || isCoverChanged) && (
            <div className="profile-alert-banner">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Preview active.</strong> Click{' '}
                  <strong>Save Changes</strong> below to persist your new{' '}
                  {isPhotoChanged && isCoverChanged
                    ? 'photo & background image'
                    : isPhotoChanged
                    ? 'profile photo'
                    : 'background image'}
                  !
                </span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="profile-submit-btn text-xs py-1.5 px-3 whitespace-nowrap"
              >
                {loading ? 'Saving...' : 'Save Now'}
              </button>
            </div>
          )}
        </div>

        {/* ─── STATS CHIPS BAR ─── */}
        <div className="profile-stats-bar">
          {isFarmer ? (
            <>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Produce Listed</p>
                <p className="profile-stat-value">
                  {productsCount}{' '}
                  <span className="profile-stat-unit">items</span>
                </p>
              </div>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Orders Received</p>
                <p className="profile-stat-value text-teal-700">
                  {ordersCount}{' '}
                  <span className="profile-stat-unit">orders</span>
                </p>
              </div>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Experience</p>
                <p className="profile-stat-value text-gray-800">
                  {formData.experienceYears || 0}+{' '}
                  <span className="profile-stat-unit">yrs</span>
                </p>
              </div>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Status</p>
                <p className="profile-stat-value text-sm flex items-center justify-center gap-1 text-emerald-600 mt-2">
                  <CheckCircle2 className="w-4 h-4" /> Active Farmer
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Orders Placed</p>
                <p className="profile-stat-value">
                  {ordersCount}{' '}
                  <span className="profile-stat-unit">orders</span>
                </p>
              </div>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Cart Items</p>
                <p className="profile-stat-value text-teal-700">
                  {cartCount} <span className="profile-stat-unit">items</span>
                </p>
              </div>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Delivery City</p>
                <p className="profile-stat-value text-gray-800 truncate px-2 text-lg">
                  {formData.city || 'Not Set'}
                </p>
              </div>
              <div className="profile-stat-box">
                <p className="profile-stat-label">Status</p>
                <p className="profile-stat-value text-sm flex items-center justify-center gap-1 text-emerald-600 mt-2">
                  <CheckCircle2 className="w-4 h-4" /> Active Buyer
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── BIO & PREFERENCES CARD ─── */}
      <div className="profile-card p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="profile-section-title">
            {isFarmer ? (
              <>
                <Sprout className="w-4 h-4 text-emerald-600" />
                Farmer Bio & Farming Mission
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Shopping Preferences & Delivery Notes
              </>
            )}
          </h3>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {isFarmer ? 'Edit Bio' : 'Edit Notes'}
            </button>
          )}
        </div>

        {isEditing ? (
          <div>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder={
                isFarmer
                  ? 'Tell customers about your agricultural journey, organic farming techniques, and quality focus...'
                  : 'Add notes about preferred delivery times, favorite organic produce, dietary preferences...'
              }
              className="profile-textarea"
            />
            <p className="text-right text-[11px] text-gray-400 mt-1">
              {formData.bio?.length || 0} characters
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed italic bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60">
            {formData.bio ||
              (isFarmer
                ? 'No bio written yet. Click "Edit Profile" to share your farming story with customers!'
                : 'No delivery notes added yet. Click "Edit Profile" to add custom shopping preferences!')}
          </p>
        )}
      </div>

      {/* ─── PROFILE DETAILS FORM ─── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="profile-forms-grid">
          {/* Card 1: Personal Information */}
          <div className="profile-card p-6 sm:p-8 space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="profile-section-title">
                <User className="w-4 h-4 text-emerald-600" />
                Personal Information
              </h3>
              <p className="profile-section-desc">
                Your identity and direct contact information
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="profile-field-group">
                <label className="profile-field-label">Full Name *</label>
                <div className="profile-input-wrapper">
                  <User className="profile-input-icon" />
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="profile-input"
                  />
                </div>
              </div>

              {/* Email Address (Read-only account ID) */}
              <div className="profile-field-group">
                <label className="profile-field-label flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-gray-400 lowercase font-normal">
                    (linked to account)
                  </span>
                </label>
                <div className="profile-input-wrapper">
                  <Mail className="profile-input-icon" />
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="profile-input"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="profile-field-group">
                <label className="profile-field-label">Phone Number *</label>
                <div className="profile-input-wrapper">
                  <Phone className="profile-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    className="profile-input"
                  />
                </div>
              </div>

              {/* UPI ID (For Farmer) */}
              {isFarmer && (
                <div className="profile-field-group">
                  <label className="profile-field-label">
                    UPI ID (For Direct Payments)
                  </label>
                  <div className="profile-input-wrapper">
                    <DollarSign className="profile-input-icon" />
                    <input
                      type="text"
                      name="upiId"
                      disabled={!isEditing}
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="e.g. farmer@okaxis"
                      className="profile-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Farm Details (Farmer) OR Delivery Address (Buyer) */}
          <div className="profile-card p-6 sm:p-8 space-y-5">
            {isFarmer ? (
              <>
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="profile-section-title">
                    <Tractor className="w-4 h-4 text-emerald-600" />
                    Farm & Agricultural Details
                  </h3>
                  <p className="profile-section-desc">
                    Produce origin, farm size, and farming techniques
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Farm Name */}
                  <div className="profile-field-group">
                    <label className="profile-field-label">
                      Farm / Enterprise Name
                    </label>
                    <div className="profile-input-wrapper">
                      <Sprout className="profile-input-icon" />
                      <input
                        type="text"
                        name="farmName"
                        disabled={!isEditing}
                        value={formData.farmName}
                        onChange={handleChange}
                        placeholder="e.g. High Range Organic Farm"
                        className="profile-input"
                      />
                    </div>
                  </div>

                  {/* Farm Location */}
                  <div className="profile-field-group">
                    <label className="profile-field-label">
                      Harvest / Farm Location
                    </label>
                    <div className="profile-input-wrapper">
                      <MapPin className="profile-input-icon" />
                      <input
                        type="text"
                        name="farmLocation"
                        disabled={!isEditing}
                        value={formData.farmLocation}
                        onChange={handleChange}
                        placeholder="e.g. Wayanad, Kerala"
                        className="profile-input"
                      />
                    </div>
                  </div>

                  {/* Farm Size & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="profile-field-group">
                      <label className="profile-field-label">Farm Size</label>
                      <div className="profile-input-wrapper">
                        <Layers className="profile-input-icon" />
                        <input
                          type="text"
                          name="farmSize"
                          disabled={!isEditing}
                          value={formData.farmSize}
                          onChange={handleChange}
                          placeholder="e.g. 5 Acres"
                          className="profile-input"
                        />
                      </div>
                    </div>

                    <div className="profile-field-group">
                      <label className="profile-field-label">Farming Type</label>
                      <select
                        name="farmingType"
                        disabled={!isEditing}
                        value={formData.farmingType}
                        onChange={handleChange}
                        className="profile-select"
                      >
                        {FARMING_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Crops & Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 profile-field-group">
                      <label className="profile-field-label">Primary Crops</label>
                      <input
                        type="text"
                        name="primaryCrops"
                        disabled={!isEditing}
                        value={formData.primaryCrops}
                        onChange={handleChange}
                        placeholder="e.g. Tomatoes, Ginger, Pepper"
                        className="profile-input profile-input-no-icon"
                      />
                    </div>

                    <div className="profile-field-group">
                      <label className="profile-field-label">
                        Experience (Yrs)
                      </label>
                      <div className="profile-input-wrapper">
                        <Clock className="profile-input-icon" />
                        <input
                          type="number"
                          name="experienceYears"
                          min={0}
                          disabled={!isEditing}
                          value={formData.experienceYears}
                          onChange={handleChange}
                          placeholder="5"
                          className="profile-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="profile-field-group">
                    <label className="profile-field-label">
                      Certifications & Badges
                    </label>
                    <div className="profile-input-wrapper">
                      <Award className="profile-input-icon" />
                      <input
                        type="text"
                        name="certifications"
                        disabled={!isEditing}
                        value={formData.certifications}
                        onChange={handleChange}
                        placeholder="e.g. PGS-India, NPOP, Jaivik Bharat"
                        className="profile-input"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="profile-section-title">
                    <Home className="w-4 h-4 text-emerald-600" />
                    Default Delivery Address
                  </h3>
                  <p className="profile-section-desc">
                    Used to autofill quick checkout on fresh farm produce
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div className="profile-field-group">
                    <label className="profile-field-label">
                      Street / House Address
                    </label>
                    <div className="profile-input-wrapper">
                      <MapPin className="profile-input-icon" />
                      <input
                        type="text"
                        name="address"
                        disabled={!isEditing}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. Flat 4B, Green Acres, MG Road"
                        className="profile-input"
                      />
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="profile-field-group">
                      <label className="profile-field-label">City / Town</label>
                      <div className="profile-input-wrapper">
                        <Building className="profile-input-icon" />
                        <input
                          type="text"
                          name="city"
                          disabled={!isEditing}
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Kochi"
                          className="profile-input"
                        />
                      </div>
                    </div>

                    <div className="profile-field-group">
                      <label className="profile-field-label">State</label>
                      <div className="profile-input-wrapper">
                        <Navigation className="profile-input-icon" />
                        <input
                          type="text"
                          name="state"
                          disabled={!isEditing}
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="e.g. Kerala"
                          className="profile-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="profile-field-group">
                    <label className="profile-field-label">
                      Postal Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      disabled={!isEditing}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 682001"
                      className="profile-input profile-input-no-icon"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── ACTION BAR (BOTTOM) ─── */}
        <div className="profile-action-bar">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isEditing
                ? 'Make your changes and press "Save Changes" to update your profile.'
                : isFarmer
                ? 'Your profile is displayed to customers browsing your agricultural produce.'
                : 'Your delivery address ensures lightning-fast checkout for farm orders.'}
            </span>
          </div>

          <div className="profile-action-bar-buttons">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="profile-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="profile-submit-btn"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving Profile...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="profile-submit-btn"
              >
                <Save className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
