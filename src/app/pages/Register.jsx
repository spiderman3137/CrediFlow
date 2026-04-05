import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('borrower');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    try {
    } finally {
      setLoading(false);
    }
  };

  return (
    </div>
  );
}
