'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // ✅ App Router-safe

export default function AuthLayout({ children }) {
  const { status } = useSession();
  const pathname = usePathname(); // ✅ usePathname instead of useRouter

  useEffect(() => {
    if (status === 'unauthenticated') {
    //   alert("Redirecting to login...");
      signIn(undefined, { callbackUrl: pathname });
    }
  }, [status, pathname]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return null;

  return <>{children}</>;
}

