"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, User, LogOut } from "lucide-react";
import { signOut } from "@/lib/helpers";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems: NavItem[] = [
    {
      id: "chats",
      label: "Chats",
      icon: MessageSquare,
      path: "/chat",
    },
    {
      id: "characters",
      label: "Characters",
      icon: Sparkles,
      path: "/characters",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  // Don't show on login page
  if (pathname === "/") {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/chat") {
      return pathname === "/chat" || pathname?.startsWith("/chat/");
    }
    return pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-lg border-t border-[var(--border)] safe-area-bottom"
    >
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-colors relative"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      active
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-[10px] text-white font-bold">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs mt-1 font-medium transition-colors ${
                    active
                      ? "text-[var(--primary)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}

          {/* Logout Button */}
          <motion.button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <LogOut className="w-6 h-6 text-[var(--muted-foreground)]" />
            <span className="text-xs mt-1 font-medium text-[var(--muted-foreground)]">
              Logout
            </span>
          </motion.button>
        </div>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </motion.nav>
  );
}

