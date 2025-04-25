"use client"
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useMyAxios from "@/composables/useMyAxios";
import Link from "next/link";


export const HeaderLogin = () => {

   
    const [setError] = useState("")
    const { request } = useMyAxios()
    const router = useRouter()
    
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
    <header className="py-5 px-5 flex justify-between">
      <div>
        
        
      </div>
      <div className="flex items-center gap-4">

        {/* <Link href="/auth/register">Регистрация</Link> */}
        {/* <Button type="submit" className="w-max" onClick={logout}>
          Выйти
        </Button> */}
      </div>
    </header>
  );
};
