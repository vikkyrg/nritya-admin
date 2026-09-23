import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-espresso p-4">
      <div className="w-full max-w-md animate-fade-up">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <img src="/logo.png" alt="Nrithya Degula" className="mx-auto mb-6 h-16 w-auto object-contain" />
          <h1 className="font-serif text-4xl tracking-[0.14em] text-goldlight">NRITHYA DEGULA</h1>
          <p className="mt-2 text-xs tracking-[0.5em] text-cream/45 uppercase">School of Dance · Admin</p>
        </div>

        <div className="gold-divider mb-8">
          <span className="size-1.5 rotate-45 bg-gold/60" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs tracking-[0.25em] text-cream/55 uppercase">
              Email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gold/60"
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nrithyadegula.com"
                className="gold-ring w-full rounded-md border border-gold/25 bg-cocoa/60 py-3 pr-4 pl-11 text-sm text-cream transition-colors placeholder:text-cream/30 focus:border-gold/60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs tracking-[0.25em] text-cream/55 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gold/60"
              />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="gold-ring w-full rounded-md border border-gold/25 bg-cocoa/60 py-3 pr-4 pl-11 text-sm text-cream transition-colors placeholder:text-cream/30 focus:border-gold/60"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-300/90">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="gold-ring w-full rounded-md bg-gold py-3 text-sm font-medium tracking-[0.22em] text-espresso uppercase transition-all hover:bg-goldlight disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-cream/35">
          Nrithya Degula School of Dance · Gallery Management
        </p>
      </div>
    </div>
  );
};

export default Login;
