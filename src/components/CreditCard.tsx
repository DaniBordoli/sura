"use client";

import Image from "next/image";
import visaIcon from "@/assets/visaIcon.png";

interface Card {
  id: number;
  issuer: string;
  name: string;
  expDate: string;
  lastDigits: number;
  balance: string;
  currency: string;
}

const PP = "var(--font-poppins)";

export function CreditCard({ card, active = true }: { card: Card; active?: boolean }) {
  const isMastercard = card.issuer.toLowerCase() === "mastercard";

  const width = active ? 348 : 330;
  const height = active ? 190 : 160;
  const bg = active ? "#005CEE" : "#F9B7B7";

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "24px",
        transition: "width 0.3s ease, height 0.3s ease",
        background: bg,
        boxShadow: "0 8px 30px 0 rgba(0, 0, 0, 0.06)",
        padding: "20px 24px",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Círculos decorativos */}
      <div style={{
        position: "absolute", width: "180px", height: "180px", borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", top: "-40px", right: "-30px",
      }} />
      <div style={{
        position: "absolute", width: "120px", height: "120px", borderRadius: "50%",
        background: "rgba(255,255,255,0.04)", bottom: "-30px", left: "30px",
      }} />

      {/* Fila 1: Balance label + logo emisora */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: PP, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "#FFFFFF" }}>
          Balance
        </span>
        {isMastercard ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#EB001B", marginRight: "-8px", zIndex: 1 }} />
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#F79E1B" }} />
          </div>
        ) : (
          <Image src={visaIcon} alt="Visa" width={48} height={48} />
        )}
      </div>

      {/* Fila 2: Badge USD + monto */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "48px", height: "30px", borderRadius: "6px",
          background: "linear-gradient(135deg, #89A5FB, #6C8FF8)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontFamily: PP, fontWeight: 500, fontSize: "12px", color: "#FFFFFF" }}>
            {card.currency}
          </span>
        </div>
        <span style={{ fontFamily: PP, fontWeight: 500, fontSize: "22px", lineHeight: "28px", color: "#FFFFFF" }}>
          {parseFloat(card.balance).toFixed(2)}
        </span>
      </div>

      {/* Fila 3: Número de tarjeta */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ fontFamily: PP, fontWeight: 500, fontSize: "22px", lineHeight: "28px", color: "#FFFFFF", letterSpacing: "0.15em" }}>
            ****
          </span>
        ))}
        <span style={{ fontFamily: PP, fontWeight: 500, fontSize: "22px", lineHeight: "28px", color: "#FFFFFF", letterSpacing: "0.05em" }}>
          {card.lastDigits}
        </span>
      </div>

      {/* Fila 4: Nombre + fecha vencimiento */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontFamily: PP, fontWeight: 400, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>
          {card.name}
        </span>
        {/* Exp Date specs pendientes */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: PP, fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>Exp. Date</p>
          <p style={{ fontFamily: PP, fontWeight: 500, fontSize: "12px", color: "#FFFFFF" }}>{card.expDate}</p>
        </div>
      </div>
    </div>
  );
}
