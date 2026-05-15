import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CreditCard } from "@/components/CreditCard";

const visaCard = {
  id: 1,
  issuer: "visa",
  name: "Carlos Pérez",
  expDate: "12/27",
  lastDigits: 4242,
  balance: "1234.56",
  currency: "USD",
};

const mastercardCard = { ...visaCard, id: 2, issuer: "mastercard" };

describe("CreditCard", () => {
  it("renders cardholder name", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByText("Carlos Pérez")).toBeInTheDocument();
  });

  it("renders balance formatted to 2 decimals", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByText("1234.56")).toBeInTheDocument();
  });

  it("renders currency badge", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders exp date", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByText("12/27")).toBeInTheDocument();
  });

  it("renders last 4 digits", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByText("4242")).toBeInTheDocument();
  });

  it("active card has blue background", () => {
    const { container } = render(<CreditCard card={visaCard} active />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ background: "#005CEE" });
  });

  it("inactive card has pink background", () => {
    const { container } = render(<CreditCard card={visaCard} active={false} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ background: "#F9B7B7" });
  });

  it("active card is wider than inactive", () => {
    const { container: activeContainer } = render(<CreditCard card={visaCard} active />);
    const { container: inactiveContainer } = render(<CreditCard card={visaCard} active={false} />);
    const activeCard = activeContainer.firstChild as HTMLElement;
    const inactiveCard = inactiveContainer.firstChild as HTMLElement;
    expect(activeCard.style.width).toBe("348px");
    expect(inactiveCard.style.width).toBe("330px");
  });

  it("renders visa image for visa issuer", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByAltText("Visa")).toBeInTheDocument();
  });

  it("renders mastercard circles for mastercard issuer", () => {
    const { container } = render(<CreditCard card={mastercardCard} active />);
    // Mastercard renders 2 colored circles, no Visa img
    expect(screen.queryByAltText("Visa")).not.toBeInTheDocument();
    const circles = container.querySelectorAll('[style*="border-radius: 50%"]');
    expect(circles.length).toBeGreaterThan(0);
  });

  it("renders Balance label", () => {
    render(<CreditCard card={visaCard} active />);
    expect(screen.getByText("Balance")).toBeInTheDocument();
  });

  it("rounds balance to 2 decimal places", () => {
    render(<CreditCard card={{ ...visaCard, balance: "100" }} active />);
    expect(screen.getByText("100.00")).toBeInTheDocument();
  });
});
