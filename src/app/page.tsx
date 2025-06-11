"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/produtos");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-blue-500">Redirecionando...</div>
    </div>
  );
}
