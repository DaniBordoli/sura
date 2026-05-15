import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/login",
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("LoginPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockFetch.mockClear();
  });

  it("renders Surabank title", () => {
    render(<LoginPage />);
    expect(screen.getByText("Surabank")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Comienza a manejar/i)).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Ingresa tu email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresa tu contraseña")).toBeInTheDocument();
  });

  it("renders Recordarme checkbox", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Recordarme")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /Ingresar/i })).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("Ingresa tu contraseña") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
    // Eye button is the second button (first is submit-like, but actually there's an eye button)
    const eyeBtn = screen.getAllByRole("button").find((b) => b.getAttribute("type") === "button");
    expect(eyeBtn).toBeDefined();
    fireEvent.click(eyeBtn!);
    expect(passwordInput.type).toBe("text");
  });

  it("toggles password back to hidden", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("Ingresa tu contraseña") as HTMLInputElement;
    const eyeBtn = screen.getAllByRole("button").find((b) => b.getAttribute("type") === "button")!;
    fireEvent.click(eyeBtn);
    fireEvent.click(eyeBtn);
    expect(passwordInput.type).toBe("password");
  });

  it("toggles remember checkbox", () => {
    render(<LoginPage />);
    const checkbox = screen.getByLabelText("Recordarme") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("shows error message on failed login", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: false }),
    });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu email"), {
      target: { value: "bad@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "wrong" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Ingresar/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText("Credenciales incorrectas")).toBeInTheDocument();
    });
  });

  it("navigates to /home on successful login", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: { token: "tok", name: "Carlos" } }),
    });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu email"), {
      target: { value: "carlos@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "pass" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Ingresar/i }).closest("form")!);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    }, { timeout: 1000 });
  });

  it("shows network error message on fetch failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu email"), {
      target: { value: "a@a.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "p" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Ingresar/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText("Error al conectar con el servidor")).toBeInTheDocument();
    });
  });
});
