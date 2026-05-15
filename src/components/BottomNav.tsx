"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, LogOut } from "lucide-react";
import { sounds } from "@/lib/sounds";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    sounds.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    setTimeout(() => router.push("/login"), 200);
  }

  function navigate(path: string) {
    if (pathname === path) return;
    sounds.tap();
    router.push(path);
  }

  const isHome = pathname === "/home";
  const isMovements = pathname === "/movements";

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex items-center justify-around px-8 z-50"
      style={{
        background: "#FFFFFF",
        height: "86px",
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -8px 30px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <button
        onClick={() => navigate("/home")}
        className="flex items-center justify-center"
        style={{
          color: isHome ? "#6C8FF8" : "#200E32",
          transition: "color 0.2s ease, transform 0.15s ease",
          transform: isHome ? "scale(1.1)" : "scale(1)",
        }}
      >
        <Home size={30} strokeWidth={isHome ? 2.5 : 2} />
      </button>

      <button
        onClick={() => navigate("/movements")}
        className="flex items-center justify-center"
        style={{
          color: isMovements ? "#6C8FF8" : "#200E32",
          transition: "color 0.2s ease, transform 0.15s ease",
          transform: isMovements ? "scale(1.1)" : "scale(1)",
        }}
      >
        <FileText size={30} strokeWidth={isMovements ? 2.5 : 2} />
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center"
        style={{
          color: "#200E32",
          transition: "color 0.2s ease, transform 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ef4444";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#200E32";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <LogOut size={30} strokeWidth={2} />
      </button>
    </nav>
  );
}
