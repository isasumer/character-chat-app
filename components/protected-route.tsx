"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "./ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading && !auth?.user) {
      router.push("/");
    }
  }, [auth?.loading, auth?.user, router]);

  if (auth?.loading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!auth?.user) {
    return <LoadingScreen message="Redirecting..." />;
  }

  return <>{children}</>;
}

