'use client';
import { useRouter } from 'next/navigation';

const useNavigate = () => {
  const router = useRouter();

  const goTo = (path) => {
    router.push(path);
  };

  return goTo;
};



export default useNavigate;
