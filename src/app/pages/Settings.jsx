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
}
