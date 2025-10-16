"use client";

import {
  AnimatePresence,
  Features,
  Footer,
  LoginCard,
  LoginHeader,
} from "./components";
import useHomeStart from "@/hooks";

export default function Home() {
  useHomeStart();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatePresence />
      <div className="flex flex-col items-center justify-center  gap-4 relative z-10 w-full max-w-md">
        <LoginHeader />
        <Features />
        <LoginCard />
        <Footer />
      </div>
    </div>
  );
}
