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

import qs from "qs"
import { useRouter } from "next/navigation"
import {  useState } from "react"
import useMyAxios from "@/composables/useMyAxios"


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  // Функционал входа
  const { request } = useMyAxios()
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  
  const handleSubmit = async (e) => {
     e.preventDefault()
      try{
          const response = await request("users/login",'POST', 
            qs.stringify({
              username,
              password,
            }),
              {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          )
      console.log(response)
        if (response.data.message == 'Успешный вход') {
        alert('Вы успешно авторизовались!')
        localStorage.setItem("is_authenticated",'true')
        router.push("/")
        const authResp = await request("users/check_auth", "GET");
        console.log(authResp)
        } else {
          setError("Ошибка" + ' ' + response.data.message)
        } 
         setError(response.data.error)
      }catch(err) {
        setError(err.response.data.error)
        console.error('Ошибка при входе', err)
      }

 }

  
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
              <Button type="submit" className="w-full" size="lg">
                Войти
              </Button>
              
            </div>
            <div className="mt-4 text-center text-sm">
              У вас нет учетной записи?{" "}
              <Link href="/auth/register" className="underline underline-offset-4 text-base font-bold ">
                Зарегистрируйтесь
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
