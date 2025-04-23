"use client"
import axios from "axios";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useMyAxios from "@/app/composables/useMyAxios";





export const Header = () => {

   
    const [error, setError] = useState("")
    const { request } = useMyAxios()
    const router = useRouter()
    
    const logout = async (e) => {
       e.preventDefault()
       
       try {
             const response = await request("users/logout","GET")
             console.log(response)
           
           if (response.status === 200) {
              alert('Вы успешно вышли из системы!')
              localStorage.setItem("isAuthenticated",'false')
              router.push("/login")

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
    <>
      <div>Header
      </div>
      <div>
        <Button type="submit" className="w-max" onClick={logout}>
          Выйти
        </Button>
      </div>
    </>
  );
};
