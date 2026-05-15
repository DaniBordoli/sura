"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { sounds } from "@/lib/sounds";

const PP = "var(--font-poppins)";

const subtitle: React.CSSProperties = {
  fontFamily: PP,
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0px",
  color: "#717E95",
  textAlign: "center",
};

const labelStyle: React.CSSProperties = {
  fontFamily: PP,
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "22px",
  letterSpacing: "0px",
  color: "#334154",
};

const inputStyle: React.CSSProperties = {
  fontFamily: PP,
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  background: "#FFFFFF",
  color: "#1a1a1a",
  borderRadius: "12px",
  height: "54px",
  padding: "0 16px",
  width: "100%",
  outline: "none",
  border: "none",
  boxShadow: "0 8px 30px 0 rgba(0, 0, 0, 0.06)",
  transition: "box-shadow 0.2s ease, transform 0.15s ease",
};

const btnStyle: React.CSSProperties = {
  fontFamily: PP,
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "22px",
  letterSpacing: "0px",
  color: "#FFFFFF",
  background: "#005CEE",
  borderRadius: "16px",
  padding: "16px",
  width: "100%",
  border: "none",
  cursor: "pointer",
  transition: "background 0.2s ease, transform 0.15s ease, opacity 0.2s ease",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeForm, setShakeForm] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const addRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const circle = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    circle.className = "ripple-circle";
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/surabank/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        sounds.error();
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 450);
        setError("Credenciales incorrectas");
        return;
      }

      sounds.loginSuccess();
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", data.data.token);
      storage.setItem("userName", data.data.name);
      setTimeout(() => router.push("/home"), 350);
    } catch {
      sounds.error();
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .login-input::placeholder {
          font-family: var(--font-poppins);
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: #AAAAAA;
        }
        .login-input:focus {
          box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.06), 0 0 0 2px rgba(0, 92, 238, 0.3);
          transform: translateY(-1px);
        }
        .login-btn:hover:not(:disabled) { background: #0047cc !important; }
        .login-btn:active:not(:disabled) { transform: scale(0.97) !important; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="flex flex-col flex-1 min-h-screen px-6" style={{ background: "#f9fafc" }}>
        {/* Logo + subtítulo */}
        <div
          className="flex flex-col items-center animate-fade-up"
          style={{ marginBottom: "101px", marginTop: "124px" }}
        >
          <h1
            className="animate-scale-in"
            style={{
              fontFamily: PP,
              fontSize: "40px",
              fontWeight: 500,
              lineHeight: "60.21px",
              letterSpacing: "-1.56px",
              color: "#005CEE",
            }}
          >
            Surabank
          </h1>
          <p style={subtitle} className="mt-2 px-4 animate-fade-in delay-150">
            Comienza a manejar tu vida financiera
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-5 flex-1 ${shakeForm ? "animate-shake" : ""}`}
        >
          {/* Email */}
          <div className="flex flex-col gap-2 animate-fade-up delay-100">
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              style={inputStyle}
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-2 animate-fade-up delay-150">
            <label style={labelStyle}>Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                style={{ ...inputStyle, padding: "0 48px 0 16px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-all"
                style={{ color: "#AAAAAA", transform: "translateY(-50%) scale(1)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#005CEE")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#AAAAAA")}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Recordarme */}
          <div className="flex items-center gap-2 animate-fade-up delay-200">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                border: "1.5px solid #DBDBDB",
                appearance: "none",
                backgroundColor: remember ? "#005CEE" : "#DBDBDB",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background-color 0.2s ease",
                backgroundImage: remember
                  ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 8l3.5 3.5L13 4.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`
                  : "none",
                backgroundSize: "100%",
              }}
            />
            <label
              htmlFor="remember"
              style={{
                fontFamily: PP,
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#AAAAAA",
                cursor: "pointer",
              }}
            >
              Recordarme
            </label>
          </div>

          {/* Error */}
          {error && (
            <p
              className="animate-fade-in"
              style={{ fontFamily: PP, fontSize: "14px", color: "#ef4444", textAlign: "center" }}
            >
              {error}
            </p>
          )}

          {/* Spacer + Botón al fondo */}
          <div className="flex-1" />
          <div className="pb-10 animate-fade-up delay-250">
            <button
              ref={btnRef}
              type="submit"
              disabled={loading}
              className="login-btn btn-ripple"
              style={btnStyle}
              onClick={addRipple}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
