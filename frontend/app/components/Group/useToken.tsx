// components/useToken.ts
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useToken = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const storedToken = localStorage.getItem('token');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
    } else if (storedToken) {
      setToken(storedToken);
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, []);

  return { token, loading };
};
