'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // make sure both are exported from your firebase.js
import { doc, setDoc } from 'firebase/firestore';
import useNavigate from '@/hooks/customHook';


export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await sendEmailVerification(userCredential.user);
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: form.username,
      });

      // Store in Firestore (optional but recommended)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: form.username,
        email: form.email,
        createdAt: Date.now(),
      });

      navigate('/auth/login'); // ✅ Redirect to login
    } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          setError('Email is already registered. Try logging in.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Invalid email format.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters.');
        } else {
          setError('Something went wrong. Please try again.');
        }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleSignup} className="flex flex-col gap-4 max-w-sm w-full p-6">
        <h2 className="text-xl font-bold text-white">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border px-3 py-2 rounded bg-black text-white"
        />
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
          Sign Up
        </button>
        <a className='underline mx-auto' href='/auth/login'>Already have an account</a>
      </form>
    </div>
  );
}
