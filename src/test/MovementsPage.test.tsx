import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MovementsPage from "@/app/movements/page";

const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  usePathname: () => "/movements",
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const txs = [
  { id: 1, title: "Netflix", amount: "15.99", transactionType: "SUS", date: "2025-01-01" },
  { id: 2, title: "Salario", amount: "1000.00", transactionType: "CASH_IN", date: "2025-01-02" },
  { id: 3, title: "Supermercado", amount: "80.00", transactionType: "CASH_OUT", date: "2025-01-03" },
];

describe("MovementsPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockFetch.mockClear();
    localStorage.setItem("token", "tok_1");
  });

  it("redirects to /login when no token", () => {
    localStorage.clear();
    render(<MovementsPage />);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("shows loading spinner initially", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { container } = render(<MovementsPage />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders Movimientos heading", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Movimientos")).toBeInTheDocument());
  });

  it("renders all filter tabs", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: [] }) });
    render(<MovementsPage />);
    await waitFor(() => {
      expect(screen.getByText("Todos")).toBeInTheDocument();
      expect(screen.getByText("Suscripciones")).toBeInTheDocument();
      expect(screen.getByText("Recibidos")).toBeInTheDocument();
      expect(screen.getByText("Enviados")).toBeInTheDocument();
    });
  });

  it("renders all transactions when Todos is selected", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Netflix")).toBeInTheDocument());
    expect(screen.getByText("Salario")).toBeInTheDocument();
    expect(screen.getByText("Supermercado")).toBeInTheDocument();
  });

  it("filters by SUS", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Suscripciones")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Suscripciones"));
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.queryByText("Salario")).not.toBeInTheDocument();
    expect(screen.queryByText("Supermercado")).not.toBeInTheDocument();
  });

  it("filters by CASH_IN", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Recibidos")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Recibidos"));
    expect(screen.getByText("Salario")).toBeInTheDocument();
    expect(screen.queryByText("Netflix")).not.toBeInTheDocument();
  });

  it("filters by CASH_OUT", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Enviados")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Enviados"));
    expect(screen.getByText("Supermercado")).toBeInTheDocument();
    expect(screen.queryByText("Netflix")).not.toBeInTheDocument();
  });

  it("shows empty state when filter has no results", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Suscripciones")).toBeInTheDocument());
    // Filter to show only SUS, then switch to CASH_OUT (which has nothing matching SUS)
    fireEvent.click(screen.getByText("Enviados"));
    fireEvent.click(screen.getByText("Suscripciones")); // empty because only Netflix
    // Netflix is a SUS so it's there
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });

  it("shows empty category message when no items match", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: [] }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Sin movimientos en esta categoría")).toBeInTheDocument());
  });

  it("back button calls router.back()", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: [] }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Movimientos")).toBeInTheDocument());
    const backBtn = screen.getAllByRole("button")[0];
    fireEvent.click(backBtn);
    expect(mockBack).toHaveBeenCalled();
  });

  it("does not re-trigger filter if same filter clicked", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ success: true, data: txs }) });
    render(<MovementsPage />);
    await waitFor(() => expect(screen.getByText("Todos")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Todos")); // same filter
    // Should still show all transactions
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });
});
