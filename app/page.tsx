"use client";

import { Exhibitions } from "@/components/shared/Exhibitions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if(!isAuthenticated){
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Exhibitions />
    </>
  );
}
