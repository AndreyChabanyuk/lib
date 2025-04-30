"use client"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useMyAxios from "@/composables/useMyAxios";
import Link from "next/link";

export const Header = () => {
  const [error, setError] = useState(""); // исправлено: setError должна изменять значение [error, setError]
  const { request } = useMyAxios();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Убираем вызов localStorage здесь.
  useEffect(() => {
    // Проверяем, что мы в окружении браузера (хотя "use client" уже гарантирует клиентскую часть)
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("is_authenticated");
      setIsAuthenticated(authStatus === 'true');

      // Добавляем обработчик события для обновления состояния при изменении localStorage
      const handleStorageChange = () => {
        const updatedAuthStatus = localStorage.getItem("is_authenticated");
        setIsAuthenticated(updatedAuthStatus === 'true');
      };

      window.addEventListener('storage', handleStorageChange);

      // Убираем обработчик при размонтировании компонента
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await request("users/logout", "GET");
      if (response.status === 200) {
        alert('Вы успешно вышли из системы!');
        localStorage.setItem("is_authenticated", 'false');
        router.push("/auth/login");
      } else {
        setError("Ошибка: " + response.data.message);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || "Ошибка регистрации";
      setError(errorMessage);
      console.log(error);
    }
  };

  return (
    <div className={isAuthenticated ? "" : "hidden"}>
      <header className="py-5 px-5 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Левая часть – заголовок */}
        <div>
          <h2 className="text-xl md:text-2xl text-center md:text-left">
            Информационный библиотечный комплекс
          </h2>
        </div>
        {/* Правая часть – меню навигации */}
        <div className="flex flex-row items-center gap-2 md:gap-4 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="text-sm px-2 py-1 md:px-0 md:py-0">
            Главная
          </Link>
          <Link href="/auth/register" className="text-sm px-2 py-1 md:px-0 md:py-0">
            Регистрация
          </Link>
          <Button
            type="submit"
            className="w-max text-sm px-3 py-1 md:px-4 md:py-2"
            onClick={logout}
          >
            Выйти
          </Button>
        </div>
      </header>
    </div>
  );
};
