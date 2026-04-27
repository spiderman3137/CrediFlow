import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../api/authService';
import { toast } from 'sonner';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle, LockReset, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';


export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to reset password. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f3f0ff 0%, #e8dcff 50%, #f0f4ff 100%)',
        p: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient bar */}
        <Box
          sx={{
            height: 6,
            background: submitted
              ? 'linear-gradient(90deg, #059669, #10b981)'
              : 'linear-gradient(90deg, #5B2DFF, #7c3aed)',
          }}
        />

        <CardContent sx={{ p: 5 }}>
          {!submitted ? (
            <>
              {/* Icon */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LockReset sx={{ fontSize: 38, color: '#7c3aed' }} />
                </Box>
              </Box>

              <Typography variant="h5" fontWeight={700} color="text.primary" textAlign="center" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                Enter your new password below to regain access to your account.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    fullWidth
                    size="small"
                    helperText="Minimum 6 characters"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 18 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 18 }} />
                            )}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LockReset />}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      background: 'linear-gradient(135deg, #5B2DFF, #7c3aed)',
                      boxShadow: '0 4px 15px rgba(91,45,255,0.3)',
                      '&:hover': { background: 'linear-gradient(135deg, #4a22d4, #6d28d9)' },
                    }}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>

                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    fullWidth
                    startIcon={<ArrowBack />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: 'text.secondary',
                      borderRadius: 2,
                    }}
                  >
                    Back to Login
                  </Button>
                </Stack>
              </form>
            </>
          ) : (
            <Box textAlign="center">
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 44, color: '#059669' }} />
                </Box>
              </Box>

              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                Password Reset!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Your password has been successfully changed. You can now log in with your new password.
              </Typography>

              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 2.5,
                  py: 1.3,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  boxShadow: '0 4px 15px rgba(5,150,105,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #047857, #065f46)' },
                }}
              >
                Login to Account
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
