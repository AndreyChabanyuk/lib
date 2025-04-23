"use client";

import { Exhibitions } from "@/components/shared/Exhibitions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
/* import { useAuth } from "./context/AuthContext"; */

export default function Home() {
  const router = useRouter();
  /* const { isAuthenticated, setIsAuthenticated } = useAuth(); */
  
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    console.log(auth)
    if(!auth){
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Exhibitions />
    </>
  );
}
