import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../../api/authService';
import { getDashboardPath, normalizeRole } from '../lib/crediflow';

/**
 * OAuth2Callback — landed at /oauth2/callback after backend redirects from
 * Google or GitHub OAuth. Query params: token, refreshToken, role.
 */
export function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const roleParam = searchParams.get('role');

    if (!token) {
      // No token — OAuth2 failed
      navigate('/login?error=oauth2_failed', { replace: true });
      return;
    }

    (async () => {
      try {
        // Fetch the current user profile to get full user data
        const profile = await authService.getCurrentUserWithToken(token);
        const role = normalizeRole(profile?.role || roleParam || 'borrower');
        const userPayload = {
          ...profile,
          token,
          refreshToken,
          role,
        };
        loginWithOAuth(userPayload);
        navigate(getDashboardPath(role), { replace: true });
      } catch (err) {
        console.error('OAuth2 callback failed to fetch profile', err);
        // Still store basic session with the token and role hint
        const role = normalizeRole(roleParam || 'borrower');
        loginWithOAuth({ token, refreshToken, role });
        navigate(getDashboardPath(role), { replace: true });
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f3eb]">
      <div className="text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full border-4 border-slate-200 border-t-amber-500 animate-spin" />
        <p className="text-slate-600 font-medium">Completing sign-in…</p>
        <p className="text-sm text-slate-400">Please wait while we set up your session.</p>
      </div>
    </div>
  );
}
