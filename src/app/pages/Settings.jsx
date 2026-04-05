<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Save, Shield, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { userService } from '../../api/userService';
import { getErrorMessage } from '../../api/responseUtils';
import { titleCase } from '../lib/crediflow';

export function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    try {
      await userService.update(user.id, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success('Password changed successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to change password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your profile and security preferences through the user API.</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
              <p className="text-sm text-slate-500">{titleCase(user?.role)} account</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
              <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="w-full input-sharp" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input value={profile.email} readOnly className="w-full input-sharp bg-slate-50 text-slate-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
              <input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className="w-full input-sharp" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
              <input value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} className="w-full input-sharp" />
            </div>
          </div>

          <button onClick={handleProfileSave} disabled={loading} className="mt-6 btn-primary inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save profile
          </button>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Security</h2>
              <p className="text-sm text-slate-500">Change your password securely.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Current password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
                className="w-full input-sharp"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">New password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
                className="w-full input-sharp"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm new password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
                className="w-full input-sharp"
              />
            </div>
          </div>

          <button onClick={handlePasswordSave} disabled={loading} className="mt-6 btn-primary inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            Update password
          </button>
        </article>
      </section>
    </div>
  );
=======
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

export function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        bio: '',
    });

    const [notifications, setNotifications] = useState({
        emailNotifs: true,
        pushNotifs: true,
        loanUpdates: true,
        paymentReminders: true,
        weeklyDigest: false,
        marketingEmails: false,
    });

    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: '30',
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and configuration</p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Tabs */}
                <div className="w-56 shrink-0">
                    <div className="card-sharp p-2 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-[#5B2DFF] text-white'
                                            : 'text-gray-700 hover:bg-[#F3F0FF]'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="card-sharp p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h2>
                                <p className="text-sm text-gray-500">Update your personal details and contact info</p>
                            </div>

                            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#5B2DFF] to-[#8C6CFF] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {profile.name.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-lg">{profile.name || 'User'}</p>
                                    <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
                                    <button className="mt-2 text-sm text-[#5B2DFF] font-medium hover:text-[#3A1FBF]">
                                        Change avatar
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full input-sharp"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full input-sharp"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full input-sharp"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={user?.role || ''}
                                        disabled
                                        className="w-full input-sharp bg-gray-50 text-gray-500 capitalize cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full input-sharp min-h-[100px] resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="card-sharp p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h2>
                                <p className="text-sm text-gray-500">Choose how and when you want to be notified</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                    { key: 'pushNotifs', label: 'Push Notifications', desc: 'Get push notifications in your browser' },
                                    { key: 'loanUpdates', label: 'Loan Status Updates', desc: 'Get notified about loan status changes' },
                                    { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Receive reminders before payment due dates' },
                                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary of activity' },
                                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content and offers' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-[#5B2DFF]' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="card-sharp p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">Security Settings</h2>
                                <p className="text-sm text-gray-500">Manage your password and account security</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 border-2 border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-1">Change Password</h3>
                                    <p className="text-sm text-gray-500 mb-4">Update your password regularly for better security</p>
                                    <div className="space-y-4 max-w-md">
                                        <input type="password" className="w-full input-sharp" placeholder="Current password" />
                                        <input type="password" className="w-full input-sharp" placeholder="New password" />
                                        <input type="password" className="w-full input-sharp" placeholder="Confirm new password" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                    <button
                                        onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${security.twoFactor ? 'bg-[#5B2DFF]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${security.twoFactor ? 'translate-x-6' : 'translate-x-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (minutes)</label>
                                    <select
                                        value={security.sessionTimeout}
                                        onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                                        className="w-full input-sharp max-w-xs"
                                    >
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                        <option value="120">2 hours</option>
                                        <option value="0">Never</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="card-sharp p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">Appearance</h2>
                                <p className="text-sm text-gray-500">Customize the look and feel of your dashboard</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                                    <div className="flex gap-4">
                                        {['Light', 'Dark', 'System'].map((theme) => (
                                            <button
                                                key={theme}
                                                className={`px-6 py-3 border-2 font-medium transition-colors ${theme === 'Light'
                                                        ? 'border-[#5B2DFF] bg-[#F3F0FF] text-[#5B2DFF]'
                                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Accent Color</label>
                                    <div className="flex gap-3">
                                        {['#5B2DFF', '#2563EB', '#059669', '#DC2626', '#D97706', '#7C3AED'].map((color) => (
                                            <button
                                                key={color}
                                                className={`w-10 h-10 rounded-full border-2 ${color === '#5B2DFF' ? 'border-gray-900 ring-2 ring-offset-2 ring-[#5B2DFF]' : 'border-transparent'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Language</label>
                                    <select className="w-full input-sharp max-w-xs">
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Date Format</label>
                                    <select className="w-full input-sharp max-w-xs">
                                        <option value="mdy">MM/DD/YYYY</option>
                                        <option value="dmy">DD/MM/YYYY</option>
                                        <option value="ymd">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-6 flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                        {saved && (
                            <span className="text-sm text-green-600 font-medium animate-pulse">
                                Settings saved successfully!
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
}
