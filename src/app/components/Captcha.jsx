import { useState } from 'react';
import { Shield, RefreshCw } from 'lucide-react';

export function Captcha({ onVerify }) {
  const [value, setValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [error, setError] = useState('');

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const handleRefresh = () => {
    setCaptchaCode(generateCaptcha());
    setValue('');
    setError('');
    onVerify(false);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    
    if (val.length === 6) {
      if (val === captchaCode) {
        setError('');
        onVerify(true);
      } else {
        setError('Incorrect CAPTCHA. Please try again.');
        onVerify(false);
      }
    } else {
      setError('');
      onVerify(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Verify you're human
      </label>
      
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 p-4 font-mono text-2xl font-bold text-purple-700 tracking-widest select-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          <div className="relative z-10 text-center" style={{ letterSpacing: '0.3em' }}>
            {captchaCode}
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleRefresh}
          className="p-3 border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
          title="Refresh CAPTCHA"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter CAPTCHA code"
        maxLength={6}
        className="w-full input-sharp"
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
