import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/ui";

export default function useHomeStart() {
    const auth = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!auth?.loading && auth?.user) {
        router.push("/chat");
      }
    }, [auth?.loading, auth?.user, router]);
  
    if (auth?.loading) {
      return <LoadingScreen message="Loading..." />;
    }
  
    if (auth?.user) {
      return <LoadingScreen message="Redirecting..." />;
    }
  
}