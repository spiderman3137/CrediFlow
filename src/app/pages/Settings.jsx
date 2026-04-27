import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { userService } from '../../api/userService';
import { getErrorMessage } from '../../api/responseUtils';
import { titleCase } from '../lib/crediflow';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Save,
  Person,
  Security,
  Email,
  Phone,
  Home,
  Lock,
  LockOpen,
  CheckCircle,
} from '@mui/icons-material';

export function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

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
    if (!user?.id) return;
    setProfileLoading(true);
    try {
      await userService.update(user.id, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      });
      toast.success('Profile updated successfully.');
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile.'));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setPasswordLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to change password.'));
    } finally {
      setPasswordLoading(false);
    }
  };

  const displayInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your profile information and account security preferences.
        </Typography>
      </Box>

      {/* User Banner */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: '1.8rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                boxShadow: '0 0 0 4px rgba(168, 85, 247, 0.3)',
              }}
            >
              {displayInitial}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="white">
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
                {user?.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip
                  label={titleCase(user?.role || '')}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(139, 92, 246, 0.3)',
                    color: '#c4b5fd',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
                {user?.emailVerified ? (
                  <Chip
                    label="Email Verified"
                    size="small"
                    icon={<CheckCircle sx={{ fontSize: '14px !important', color: '#86efac !important' }} />}
                    sx={{
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      color: '#86efac',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                    }}
                  />
                ) : (
                  <Chip
                    label="Email Unverified"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(251, 146, 60, 0.2)',
                      color: '#fdba74',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', xl: '1fr 0.9fr' } }}>
        {/* Profile Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Person sx={{ color: '#7c3aed', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Profile Information
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Update your name, email, and contact details
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {profileSaved && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                <AlertTitle>Saved!</AlertTitle>
                Your profile has been updated successfully.
              </Alert>
            )}

            <Stack spacing={2.5}>
              <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: '1fr 1fr' }}>
                <TextField
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  label="Email Address"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  size="small"
                  fullWidth
                  type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  helperText="Changing email resets verification status"
                />
              </Box>
              <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: '1fr 1fr' }}>
                <TextField
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  label="Address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
            </Stack>

            <Button
              variant="contained"
              onClick={handleProfileSave}
              disabled={profileLoading}
              startIcon={profileLoading ? <CircularProgress size={16} color="inherit" /> : <Save />}
              sx={{
                mt: 3,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.2,
                background: 'linear-gradient(135deg, #5B2DFF, #7c3aed)',
                '&:hover': { background: 'linear-gradient(135deg, #4a22d4, #6d28d9)' },
                boxShadow: '0 4px 15px rgba(91,45,255,0.3)',
              }}
            >
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Security sx={{ color: '#d97706', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Security
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Change your password securely
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2.5}>
              <TextField
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpen sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                size="small"
                fullWidth
                helperText="Minimum 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                size="small"
                fullWidth
                error={passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword}
                helperText={
                  passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Stack>

            <Button
              variant="contained"
              onClick={handlePasswordSave}
              disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword}
              startIcon={passwordLoading ? <CircularProgress size={16} color="inherit" /> : <Security />}
              sx={{
                mt: 3,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.2,
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                '&:hover': { background: 'linear-gradient(135deg, #b45309, #92400e)' },
                boxShadow: '0 4px 15px rgba(217,119,6,0.3)',
              }}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
