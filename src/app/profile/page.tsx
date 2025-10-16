"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button, Avatar, Card } from "@/components/ui";

function ProfileContent() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-0">
      <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-[var(--muted-foreground)]">
            Manage your account settings
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                src={auth?.user?.user_metadata?.avatar_url || ""}
                alt={auth?.user?.user_metadata?.full_name || "User"}
                fallback={auth?.user?.email?.charAt(0).toUpperCase() || "U"}
                size="xl"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {auth?.user?.user_metadata?.full_name || "User"}
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {auth?.user?.email}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-[var(--muted-foreground)]" />
                <span className="text-[var(--muted-foreground)]">Email:</span>
                <span className="font-medium">{auth?.user?.email}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <User className="w-5 h-5 text-[var(--muted-foreground)]" />
                <span className="text-[var(--muted-foreground)]">User ID:</span>
                <span className="font-mono text-xs">
                  {auth?.user?.id?.slice(0, 8)}...
                </span>
              </div>

              {auth?.user?.created_at && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-[var(--muted-foreground)]" />
                  <span className="text-[var(--muted-foreground)]">
                    Member since:
                  </span>
                  <span className="font-medium">
                    {formatDate(auth.user.created_at)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <Button
            variant="outline"
            size="large"
            onClick={handleSignOut}
            icon={<LogOut className="w-5 h-5" />}
            className="w-full justify-start"
          >
            Sign Out
          </Button>

          <Button
            variant="destructive"
            size="large"
            onClick={handleDeleteAccount}
            icon={<Trash2 className="w-5 h-5" />}
            className="w-full justify-start"
          >
            Delete Account
          </Button>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-[var(--muted-foreground)]"
        >
          <p>Character Chat App v1.0.0</p>
          <p className="mt-1">Built with Next.js, Supabase & Groq AI</p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

