import { LoginForm } from "@/components/ui/login-form"





const Login = () => {
    console.log('Base URL:', process.env.NEXT_APP_DB_URL);
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-[500px]">
            
            <LoginForm />
            
            </div>
        </div>
    )
}


export default Login