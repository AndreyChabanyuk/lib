"use client"
import { cn } from "@/lib/utils"
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
import axios from "axios"
import qs from "qs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  // Функционал входа

  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter()
  
  const handleSubmit = async (e) => {
     e.preventDefault()
     
     try {
           const response = await axios.post("http://82.202.137.19/users/login", qs.stringify({
           username,
           password,
         }),{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
         })
         console.log(response)
         if (response.data.is_authenticated) {
           localStorage.setItem("role",response.data.role)
            router.push("/")
         } else {
          setError("Ошибка" + response.data.message)
         }
 
         // Сохраните токен в localStorage или в контексте
     /*     localStorage.setItem("token", response.data.token) */
         // Перенаправление на главную страницу
        
       } catch (error) {
         const errorMessage = error?.response ? error?.response?.data.message : "Ошибка регистрации";
         setError(errorMessage)
       }
 }
 const checkAuth = async() => {
  
  try {
    const response = await axios.get("http://82.202.137.19/users/check_auth")
    setIsAuthenticated(response.data.is_authenticated)
    alert('Вы успешно зарегистрированы')
  } catch(error) {
    console.log(error)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks

 }
 useEffect(() => {
  console.log(isAuthenticated)
  checkAuth(); // Проверяем авторизацию при загрузке компонента
}, [isAuthenticated]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Войдите в свою учетную запись</CardTitle>
          <CardDescription>
            Введите свой логин чтобы войти в аккаунт
        
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
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Забыли пароль?
                  </a>
                </div>
                <Input id="password" type="password" 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль" required />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Войти
              </Button>
              
            </div>
            <div className="mt-4 text-center text-sm">
              У вас нет учетной записи?{" "}
              <Link href="/register" className="underline underline-offset-4 text-base font-bold ">
                Зарегистрируйтесь
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
