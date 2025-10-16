"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  MessageSquare,
  Sparkles,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { BottomNav } from "./BottomNav";

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on smaller desktop screens
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't show layout on login page
  if (pathname === "/") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      key: "/chat",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chats",
      onClick: () => router.push("/chat"),
    },
    {
      key: "/characters",
      icon: <Sparkles className="w-5 h-5" />,
      label: "Characters",
      onClick: () => router.push("/characters"),
    },
    {
      key: "/profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut className="w-5 h-5" />,
      label: "Logout",
      onClick: handleSignOut,
      danger: true,
    },
  ];

  // Get active menu key based on pathname
  const getActiveKey = () => {
    if (pathname?.startsWith("/chat")) return "/chat";
    if (pathname?.startsWith("/characters")) return "/characters";
    if (pathname?.startsWith("/profile")) return "/profile";
    return "/chat";
  };

  // Mobile view: show bottom nav only
  if (isMobile) {
    return (
      <>
        <div className="min-h-screen">{children}</div>
        <BottomNav />
      </>
    );
  }

  // Desktop view: show sidebar
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        width={250}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        theme="light"
        className="border-r border-[var(--border)]"
      >
        {/* Logo/Brand */}
        <div
          className="flex items-center justify-center h-16 border-b border-[var(--border)] cursor-pointer"
          onClick={() => router.push("/chat")}
        >
          {collapsed ? (
            <MessageCircle className="w-8 h-8 text-[var(--primary)]" />
          ) : (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-[var(--primary)]" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Character Chat
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          style={{
            border: "none",
            marginTop: "16px",
          }}
        />
      </Sider>

      {/* Main Content */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <Content
          style={{
            minHeight: "100vh",
            overflow: "initial",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

