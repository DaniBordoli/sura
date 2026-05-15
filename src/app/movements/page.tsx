"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { ChevronLeft } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface Transaction {
  id: number;
  title: string;
  amount: string;
  transactionType: string;
  date: string;
}

const FILTERS = ["Todos", "SUS", "CASH_IN", "CASH_OUT"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<string, string> = {
  Todos: "Todos",
  SUS: "Suscripciones",
  CASH_IN: "Recibidos",
  CASH_OUT: "Enviados",
};

const PP = "var(--font-poppins)";

export default function MovementsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchMovements() {
      try {
        const res = await fetch("/api/surabank/movements/last", {
          headers: { Authorization: token! },
        });
        const data = await res.json();
        if (data.success) setTransactions(data.data);
      } catch {
        // silenciar
      } finally {
        setLoading(false);
      }
    }

    fetchMovements();
  }, [router]);

  function handleFilter(filter: Filter) {
    if (filter === activeFilter) return;
    sounds.tap();
    setActiveFilter(filter);
    setListKey((k) => k + 1);
  }

  const filtered =
    activeFilter === "Todos"
      ? transactions
      : transactions.filter((t) => t.transactionType === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#f9fafc" }}>
        <div className="w-8 h-8 border-2 border-[#005CEE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "#f9fafc" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-12 pb-6 animate-fade-up">
        <button
          onClick={() => { sounds.tap(); router.back(); }}
          style={{ color: "#717E95", transition: "color 0.2s, transform 0.15s" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#005CEE";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#717E95";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontFamily: PP, fontWeight: 500, fontSize: "20px", lineHeight: "26px", color: "#334154" }}>
          Movimientos
        </h1>
      </div>

      {/* Filtros */}
      <div
        className="flex gap-2 px-6 mb-6 overflow-x-auto pb-1 animate-fade-up delay-100"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className="flex-shrink-0"
            style={{
              fontFamily: PP,
              fontWeight: 500,
              fontSize: "12px",
              padding: "6px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: activeFilter === filter ? "#005CEE" : "#EBEBEB",
              color: activeFilter === filter ? "#FFFFFF" : "#717E95",
              transition: "background 0.25s ease, color 0.25s ease, transform 0.15s ease",
              transform: activeFilter === filter ? "scale(1.05)" : "scale(1)",
            }}
          >
            {FILTER_LABELS[filter]}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex-1 px-6" key={listKey}>
        <div className="flex flex-col gap-3">
          {filtered.map((tx, i) => (
            <div
              key={tx.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <TransactionItem transaction={tx} />
            </div>
          ))}
          {filtered.length === 0 && (
            <p
              className="text-sm text-center py-16 animate-fade-in"
              style={{ color: "#AAAAAA", fontFamily: PP }}
            >
              Sin movimientos en esta categoría
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
