"use client"; // Убедитесь, что этот компонент является клиентским

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthChecker = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated");
      if (auth === 'false') {
        router.push('/login');
      }
    };

    // Проверка аутентификации при монтировании компонента
    checkAuth();

    // Установка таймера на 20 минут (1200000 миллисекунд)
    const timer = setInterval(() => {
      localStorage.setItem("isAuthenticated", 'false');
      checkAuth();
    }, 1200000);

    // Очистка таймера при размонтировании компонента
    return () => clearInterval(timer);
  }, [router]);

  return null; // Этот компонент ничего не рендерит
};

export default AuthChecker;