import { LoginForm } from "@/components/ui/login-form"
import { AuthProvider } from "../context/AuthContext"




const Login = () => {
    
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-[500px]">
            <AuthProvider>
            <LoginForm />
            </AuthProvider>
            </div>
        </div>
    )
}


export default Login