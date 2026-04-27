import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../api/authService';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import { CheckCircle, Error, MarkEmailRead } from '@mui/icons-material';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Token is missing from the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in and access your account.');
      } catch (error) {
        setStatus('error');
        setMessage(
          error?.response?.data?.message ||
          error?.message ||
          'Verification failed. The link may have expired or is invalid.'
        );
      }
    };

    verifyToken();
  }, [token]);

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
          maxWidth: 460,
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
            background:
              status === 'success'
                ? 'linear-gradient(90deg, #059669, #10b981)'
                : status === 'error'
                ? 'linear-gradient(90deg, #e11d48, #f43f5e)'
                : 'linear-gradient(90deg, #5B2DFF, #7c3aed)',
          }}
        />

        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          {/* Icon */}
          <Box sx={{ mb: 3 }}>
            {status === 'loading' && (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                <CircularProgress size={36} sx={{ color: '#7c3aed' }} />
              </Box>
            )}
            {status === 'success' && (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                <CheckCircle sx={{ fontSize: 44, color: '#059669' }} />
              </Box>
            )}
            {status === 'error' && (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffe4e6, #fecdd3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                <Error sx={{ fontSize: 44, color: '#e11d48' }} />
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
            {status === 'loading' && 'Verifying Email…'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            {message}
          </Typography>

          <Stack spacing={1.5}>
            {(status === 'success' || status === 'error') && (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                startIcon={<MarkEmailRead />}
                sx={{
                  borderRadius: 2.5,
                  py: 1.3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  background:
                    status === 'success'
                      ? 'linear-gradient(135deg, #059669, #047857)'
                      : 'linear-gradient(135deg, #5B2DFF, #7c3aed)',
                  boxShadow:
                    status === 'success'
                      ? '0 4px 15px rgba(5,150,105,0.3)'
                      : '0 4px 15px rgba(91,45,255,0.3)',
                  '&:hover': {
                    background:
                      status === 'success'
                        ? 'linear-gradient(135deg, #047857, #065f46)'
                        : 'linear-gradient(135deg, #4a22d4, #6d28d9)',
                  },
                }}
              >
                {status === 'success' ? 'Login to Your Account' : 'Back to Login'}
              </Button>
            )}
            {status === 'error' && (
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#e2e8f0',
                  color: 'text.secondary',
                  '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
                }}
              >
                Create New Account
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
