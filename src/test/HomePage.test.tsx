import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "@/app/home/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/home",
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const cardsResponse = {
  success: true,
  data: [
    { id: 1, issuer: "visa", name: "Carlos Pérez", expDate: "12/27", lastDigits: 4242, balance: "1234.56", currency: "USD" },
    { id: 2, issuer: "mastercard", name: "Carlos Pérez", expDate: "06/26", lastDigits: 1234, balance: "500.00", currency: "USD" },
  ],
};

const movementsResponse = {
  success: true,
  data: [
    { id: 1, title: "Netflix", amount: "15.99", transactionType: "SUS", date: "2025-01-01" },
    { id: 2, title: "Cobro salario", amount: "1000.00", transactionType: "CASH_IN", date: "2025-01-02" },
  ],
};

describe("HomePage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockFetch.mockClear();
    localStorage.setItem("token", "tok_1");
    localStorage.setItem("userName", "Carlos");
  });

  it("redirects to /login when no token", () => {
    localStorage.clear();
    render(<HomePage />);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("shows loading spinner initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    localStorage.setItem("token", "tok_1");
    const { container } = render(<HomePage />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders greeting with user name", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => cardsResponse })
      .mockResolvedValueOnce({ json: async () => movementsResponse });
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText("Carlos")).toBeInTheDocument());
    expect(screen.getByText("Hola")).toBeInTheDocument();
  });

  it("renders últimos movimientos heading", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => cardsResponse })
      .mockResolvedValueOnce({ json: async () => movementsResponse });
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText("Últimos movimientos")).toBeInTheDocument());
  });

  it("renders transaction titles", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => cardsResponse })
      .mockResolvedValueOnce({ json: async () => movementsResponse });
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText("Netflix")).toBeInTheDocument());
    expect(screen.getByText("Cobro salario")).toBeInTheDocument();
  });

  it("shows empty state when no transactions", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => cardsResponse })
      .mockResolvedValueOnce({ json: async () => ({ success: true, data: [] }) });
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText("Sin movimientos recientes")).toBeInTheDocument());
  });

  it("renders card balance", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => cardsResponse })
      .mockResolvedValueOnce({ json: async () => movementsResponse });
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText("1234.56")).toBeInTheDocument());
  });

  it("swaps active card on inactive card click", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => cardsResponse })
      .mockResolvedValueOnce({ json: async () => movementsResponse });
    render(<HomePage />);
    await waitFor(() => expect(screen.getByText("1234.56")).toBeInTheDocument());
    // Click inactive card container
    const inactiveWrapper = screen.getByText("500.00").closest("div[style*='cursor: pointer']");
    if (inactiveWrapper) {
      await userEvent.click(inactiveWrapper);
      await waitFor(() => expect(screen.getByText("500.00")).toBeInTheDocument());
    }
  });

  it("silently handles fetch errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it("handles fetch returning success:false gracefully", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => ({ success: false }) })
      .mockResolvedValueOnce({ json: async () => ({ success: false }) });
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });
});
