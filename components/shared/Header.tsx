"use client"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useMyAxios from "@/composables/useMyAxios";
import Link from "next/link";


export const Header = () => {

   
    const [setError] = useState("")
    const { request } = useMyAxios()
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const authStatus = localStorage.getItem("is_authenticated");
    console.log(authStatus)
    useEffect(() => {
      // Проверяем значение в localStorage при монтировании компонента
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
    }, []);
    const logout = async (e) => {
       e.preventDefault()
       
       try {
             const response = await request("users/logout","GET")
             console.log(response)
           
           if (response.status === 200) {
              alert('Вы успешно вышли из системы!')
              localStorage.setItem("is_authenticated",'false')
              router.push("/auth/login")

           } else {
            setError("Ошибка" + response.data.message)
           } 
         } catch (error) {
           const errorMessage = error?.response ? error?.response?.data.message : "Ошибка регистрации";
           setError(errorMessage)
           console.log(error)
         }
   }
  

  return (
    <div className={isAuthenticated ? "" : "hidden"}>
    <header className="py-5 px-5 flex justify-between">
      <div>
        <h2 className="text-2xl">Информационный библиотечный комплекс</h2>
        
      </div>
      <div className="flex items-center gap-4">
        <Link href="/">Главная</Link>
        <Link href="/auth/register">Регистрация</Link>
        <Button type="submit" className="w-max" onClick={logout}>
          Выйти
        </Button>
      </div>
    </header>
    </div>
  );
};
