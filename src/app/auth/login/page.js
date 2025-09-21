'use client';

import { getCsrfToken, signIn } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Login() {
  const [csrfToken, setCsrfToken] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || '');
    };
    fetchToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
      callbackUrl: '/',
    });

    if (res?.error) {
      if (res.error.toLowerCase().includes('email not verified')) {
        setError('Please verify your email before logging in.');
      } else {
        setError('Invalid email or password');
      }
    } else if (res?.ok) {
      window.location.href = res.url || '/';
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full p-6">
        <h2 className="text-xl font-bold text-white">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input name="csrfToken" type="hidden" value={csrfToken || ''} />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border px-3 py-2 rounded bg-black text-white"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border px-3 py-2 rounded bg-black text-white"
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
          Login
        </button>
        <a className="underline mx-auto" href="/auth/signup">Create new account</a>
      </form>
    </div>
  );
}
