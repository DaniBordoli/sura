"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { CreditCard } from "@/components/CreditCard";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { sounds } from "@/lib/sounds";

interface Card {
  id: number;
  issuer: string;
  name: string;
  expDate: string;
  lastDigits: number;
  balance: string;
  currency: string;
}

interface Transaction {
  id: number;
  title: string;
  amount: string;
  transactionType: string;
  date: string;
}

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Carlos");
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");
    const name = localStorage.getItem("userName") ?? sessionStorage.getItem("userName");

    if (!token) {
      router.push("/login");
      return;
    }

    if (name) setUserName(name);

    async function fetchData() {
      try {
        const [cardsRes, movementsRes] = await Promise.all([
          fetch("/api/surabank/cards", { headers: { Authorization: token! } }),
          fetch("/api/surabank/movements/last", { headers: { Authorization: token! } }),
        ]);

        const cardsData = await cardsRes.json();
        const movementsData = await movementsRes.json();

        if (cardsData.success) setCards(cardsData.data);
        if (movementsData.success) setTransactions(movementsData.data);
      } catch {
        // silenciar errores de red
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  function handleCardSwap() {
    sounds.cardSwap();
    setActiveCard(activeCard === 0 ? 1 : 0);
    setCardKey((k) => k + 1);
  }

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
      <div className="flex items-start justify-between px-6 pt-12 pb-4 animate-fade-up">
        <div>
          <p className="text-sm" style={{ color: "#717E95", fontFamily: "var(--font-poppins)" }}>
            Hola
          </p>
          <h2
            className="text-2xl"
            style={{ fontFamily: "var(--font-poppins)", fontWeight: 700, color: "#334154" }}
          >
            {userName}
          </h2>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => { sounds.tap(); router.push("/movements"); }}
            className="transition-all p-1"
            style={{ color: "#717E95" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#005CEE")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#717E95")}
          >
            <Search size={22} />
          </button>
          <button
            className="transition-all p-1"
            style={{ color: "#717E95" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#005CEE")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#717E95")}
          >
            <Bell size={22} />
          </button>
        </div>
      </div>

      {/* Carrusel de tarjetas con peek */}
      {cards.length > 0 && (
        <div className="mb-8 animate-fade-up delay-100" style={{ paddingLeft: "24px", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {/* Tarjeta activa siempre primero */}
            <div key={`active-${cardKey}`} className="animate-card-in">
              <CreditCard card={cards[activeCard]} active={true} />
            </div>
            {/* Tarjeta inactiva siempre a la derecha */}
            {cards.length > 1 && (
              <div
                key={`inactive-${cardKey}`}
                className="animate-card-in delay-100"
                onClick={handleCardSwap}
                style={{ cursor: "pointer" }}
              >
                <CreditCard card={cards[activeCard === 0 ? 1 : 0]} active={false} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Últimos movimientos */}
      <div className="flex-1 px-6">
        <div className="mb-4 animate-fade-up delay-150">
          <h3
            style={{
              fontFamily: "var(--font-poppins)",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "26px",
              letterSpacing: "0px",
              color: "#334154",
            }}
          >
            Últimos movimientos
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className={`animate-fade-up delay-${Math.min(200 + i * 50, 350)}`}
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <TransactionItem transaction={tx} />
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-sm text-center py-8 animate-fade-in" style={{ color: "#717E95" }}>
              Sin movimientos recientes
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
