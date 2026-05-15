import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mockFindUnique },
    transaction: { findMany: mockFindMany },
  },
}));

// ─── Login ───────────────────────────────────────────────────────────────────
describe("POST /api/surabank/login", () => {
  beforeEach(() => { mockFindUnique.mockReset(); });

  it("returns 400 when body is missing fields", async () => {
    const { POST } = await import("@/app/api/surabank/login/route");
    const req = new Request("http://localhost/api/surabank/login", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 401 for unknown user", async () => {
    mockFindUnique.mockResolvedValue(null);
    const { POST } = await import("@/app/api/surabank/login/route");
    const req = new Request("http://localhost/api/surabank/login", {
      method: "POST",
      body: JSON.stringify({ email: "bad@test.com", password: "wrong" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("returns 401 for wrong password", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1, name: "Carlos", email: "carlos@test.com",
      password: "correct", token: "tok_1",
    });
    const { POST } = await import("@/app/api/surabank/login/route");
    const req = new Request("http://localhost/api/surabank/login", {
      method: "POST",
      body: JSON.stringify({ email: "carlos@test.com", password: "wrong" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with token for valid credentials", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1, name: "Carlos", email: "carlos@test.com",
      password: "pass123", token: "tok_abc",
    });
    const { POST } = await import("@/app/api/surabank/login/route");
    const req = new Request("http://localhost/api/surabank/login", {
      method: "POST",
      body: JSON.stringify({ email: "carlos@test.com", password: "pass123" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("token", "tok_abc");
    expect(data.data).toHaveProperty("name", "Carlos");
  });
});

// ─── Cards ────────────────────────────────────────────────────────────────────
describe("GET /api/surabank/cards", () => {
  beforeEach(() => { mockFindUnique.mockReset(); });

  it("returns 401 without Authorization header", async () => {
    const { GET } = await import("@/app/api/surabank/cards/route");
    const req = new Request("http://localhost/api/surabank/cards");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 for invalid token", async () => {
    mockFindUnique.mockResolvedValue(null);
    const { GET } = await import("@/app/api/surabank/cards/route");
    const req = new Request("http://localhost/api/surabank/cards", {
      headers: { Authorization: "invalid-token" },
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns cards array for valid token", async () => {
    const cards = [
      { id: 1, issuer: "visa", name: "Carlos", expDate: "12/27", lastDigits: 4242, balance: "1000.00", currency: "USD" },
    ];
    mockFindUnique.mockResolvedValue({ id: 1, name: "Carlos", token: "tok_1", cards });
    const { GET } = await import("@/app/api/surabank/cards/route");
    const req = new Request("http://localhost/api/surabank/cards", {
      headers: { Authorization: "tok_1" },
    });
    const res = await GET(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual(cards);
  });

  it("returns empty array when user has no cards", async () => {
    mockFindUnique.mockResolvedValue({ id: 1, cards: [] });
    const { GET } = await import("@/app/api/surabank/cards/route");
    const req = new Request("http://localhost/api/surabank/cards", {
      headers: { Authorization: "tok_1" },
    });
    const res = await GET(req);
    const data = await res.json();
    expect(data.data).toEqual([]);
  });
});

// ─── Movements ────────────────────────────────────────────────────────────────
describe("GET /api/surabank/movements/last", () => {
  beforeEach(() => { mockFindUnique.mockReset(); mockFindMany.mockReset(); });

  it("returns 401 without Authorization header", async () => {
    const { GET } = await import("@/app/api/surabank/movements/last/route");
    const req = new Request("http://localhost/api/surabank/movements/last");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 for invalid token", async () => {
    mockFindUnique.mockResolvedValue(null);
    const { GET } = await import("@/app/api/surabank/movements/last/route");
    const req = new Request("http://localhost/api/surabank/movements/last", {
      headers: { Authorization: "bad-tok" },
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns last 5 transactions for valid token", async () => {
    mockFindUnique.mockResolvedValue({ id: 1 });
    const txs = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1, title: `Tx ${i}`, amount: "10.00", transactionType: "CASH_OUT", date: "2025-01-01",
    }));
    mockFindMany.mockResolvedValue(txs);
    const { GET } = await import("@/app/api/surabank/movements/last/route");
    const req = new Request("http://localhost/api/surabank/movements/last", {
      headers: { Authorization: "tok_1" },
    });
    const res = await GET(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(5);
  });

  it("returns empty array when no movements", async () => {
    mockFindUnique.mockResolvedValue({ id: 1 });
    mockFindMany.mockResolvedValue([]);
    const { GET } = await import("@/app/api/surabank/movements/last/route");
    const req = new Request("http://localhost/api/surabank/movements/last", {
      headers: { Authorization: "tok_1" },
    });
    const res = await GET(req);
    const data = await res.json();
    expect(data.data).toEqual([]);
  });
});
