import Image from "next/image";
import arrowUp from "@/assets/arrowUp.png";
import arrowDown from "@/assets/arrowDown.png";
import arrowTwo from "@/assets/arrowTwo.png";

interface Transaction {
  id: number;
  title: string;
  amount: string;
  transactionType: string;
  date: string;
}

const TYPE_CONFIG = {
  SUS: {
    label: "Pago de suscripción",
    color: "#B946FF",
    bg: "#F5E6FF",
    icon: arrowTwo,
  },
  CASH_IN: {
    label: "Pago recibido",
    color: "#10b981",
    bg: "#d1fae5",
    icon: arrowDown,
  },
  CASH_OUT: {
    label: "Pago enviado",
    color: "#f97316",
    bg: "#ffedd5",
    icon: arrowUp,
  },
} as const;

const PP = "var(--font-poppins)";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const config = TYPE_CONFIG[transaction.transactionType as keyof typeof TYPE_CONFIG] ?? {
    label: transaction.transactionType,
    color: "#9ca3af",
    bg: "#f3f4f6",
    icon: arrowTwo,
  };

  return (
    <div
      style={{
        width: "366px",
        height: "92px",
        borderRadius: "16px",
        background: "#FFFFFF",
        boxShadow: "0 8px 30px 0 rgba(0, 0, 0, 0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "12px",
        flexShrink: 0,
      }}
    >
      {/* Ícono (fondo incluido en el PNG) */}
      <Image src={config.icon} alt={config.label} width={44} height={44} style={{ flexShrink: 0 }} />

      {/* Título + subtítulo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: PP, fontWeight: 500, fontSize: "16px", lineHeight: "22px",
          color: "#616E7C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {transaction.title}
        </p>
        <p style={{ fontFamily: PP, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "#AAAAAA" }}>
          {config.label}
        </p>
      </div>

      {/* Monto */}
      <span style={{ fontFamily: PP, fontWeight: 500, fontSize: "14px", lineHeight: "18px", color: config.color, flexShrink: 0 }}>
        ${transaction.amount}
      </span>
    </div>
  );
}
