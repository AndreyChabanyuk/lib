"use client"

import { cn } from "@/lib/utils"
import qs from 'qs';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import useMyAxios from "@/composables/useMyAxios";


export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

// Функционал регистрации
const { request } = useMyAxios()
const [username, setUserName] = useState("")

 const [password, setPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")
 const [error, setError] = useState("")
 const router = useRouter()
 
 const handleSubmit = async (e) => {
    e.preventDefault()

    if(password !== confirmPassword){
        setError('Пароли не совпадают')
        return
    }
    try {
          await request("/users/register", 'POST', qs.stringify({
          username,
          password,
          password_confirm: confirmPassword
        }),{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        router.push("/auth/login")
      } catch (error) {
        const errorMessage = error?.response ? error?.response?.data.message : "Ошибка регистрации";
        setError(errorMessage)
      }
}


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>
            Зарегистрируйте свой аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Логин</Label>
                <Input
                  id="text"
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Введите логин"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                  
                </div>
                <Input id="password" type="password" 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Повторный пароль</Label>
                  
                </div>
                <Input id="password" type="password" 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Подтвердите пароль" required />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Зарегистрироваться
              </Button>
              
            </div>
            <div className="mt-4 text-center text-sm">
              У вас есть учетная запись?{" "}
              <Link href="/auth/login" className="underline underline-offset-4 text-base font-bold ">
                Войдите
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
