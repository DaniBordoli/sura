import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionItem } from "@/components/TransactionItem";

const base = {
  id: 1,
  title: "Netflix",
  amount: "15.99",
  transactionType: "SUS",
  date: "2025-01-01",
};

describe("TransactionItem", () => {
  it("renders title", () => {
    render(<TransactionItem transaction={base} />);
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });

  it("renders amount with $ prefix", () => {
    render(<TransactionItem transaction={base} />);
    expect(screen.getByText("$15.99")).toBeInTheDocument();
  });

  it("renders SUS label", () => {
    render(<TransactionItem transaction={base} />);
    expect(screen.getByText("Pago de suscripción")).toBeInTheDocument();
  });

  it("renders CASH_IN label", () => {
    render(<TransactionItem transaction={{ ...base, transactionType: "CASH_IN" }} />);
    expect(screen.getByText("Pago recibido")).toBeInTheDocument();
  });

  it("renders CASH_OUT label", () => {
    render(<TransactionItem transaction={{ ...base, transactionType: "CASH_OUT" }} />);
    expect(screen.getByText("Pago enviado")).toBeInTheDocument();
  });

  it("renders unknown type with raw label", () => {
    render(<TransactionItem transaction={{ ...base, transactionType: "UNKNOWN" }} />);
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
  });

  it("applies correct amount color for SUS", () => {
    const { container } = render(<TransactionItem transaction={base} />);
    const amount = container.querySelector("span");
    // Amount span is the last span in the component
    const spans = container.querySelectorAll("span");
    const amountSpan = spans[spans.length - 1];
    expect(amountSpan).toHaveStyle({ color: "#B946FF" });
  });

  it("applies correct amount color for CASH_IN", () => {
    const { container } = render(
      <TransactionItem transaction={{ ...base, transactionType: "CASH_IN" }} />
    );
    const spans = container.querySelectorAll("span");
    const amountSpan = spans[spans.length - 1];
    expect(amountSpan).toHaveStyle({ color: "#10b981" });
  });

  it("applies correct amount color for CASH_OUT", () => {
    const { container } = render(
      <TransactionItem transaction={{ ...base, transactionType: "CASH_OUT" }} />
    );
    const spans = container.querySelectorAll("span");
    const amountSpan = spans[spans.length - 1];
    expect(amountSpan).toHaveStyle({ color: "#f97316" });
  });

  it("truncates long title with ellipsis style", () => {
    const long = "A".repeat(80);
    const { container } = render(<TransactionItem transaction={{ ...base, title: long }} />);
    const title = container.querySelector("p");
    expect(title).toHaveStyle({ overflow: "hidden" });
  });
});
