# SuraBank 🏦

Plataforma de banca móvil web construida como challenge técnico. Simula una app de finanzas personal con autenticación, carrusel de tarjetas y registro de movimientos.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS v4 + Shadcn/ui |
| Tipografías | Inter + Poppins (next/font) |
| Base de datos | SQLite vía Prisma v5 |
| ORM | Prisma Client v5 |
| Iconos | Lucide React |
| Testing | Vitest + Testing Library |
| Linting | ESLint 9 + Prettier |
| Deploy | Render (Node.js web service) |

---

## Features implementados

### Pantallas
- **Login** — autenticación con email y contraseña. Recordarme persiste en `localStorage`, sin recordar usa `sessionStorage`.
- **Home** — carrusel de tarjetas con peek de la tarjeta inactiva, lista de últimos movimientos.
- **Movimientos** — listado completo con filtros por tipo (Todos / Suscripciones / Recibidos / Enviados).

### API REST
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/surabank/login` | Autenticación por email + password |
| GET | `/api/surabank/cards` | Tarjetas del usuario autenticado |
| GET | `/api/surabank/movements/last` | Últimos 5 movimientos |

### Bonus — Trofeo Sura
- **Animaciones** — `fadeUp` escalonado en cada pantalla, `cardSlideIn` al hacer swap de tarjeta, shake del formulario en error, ripple en botón de login, escala en filtros activos.
- **Sonidos** — Web Audio API sin archivos externos: arpeggio de éxito al login, whoosh al swapear tarjeta, click en navegación, arpeggio descendente al logout, buzz en error.
- **ESLint + Prettier** — reglas estrictas: `no-explicit-any`, `consistent-type-imports`, `exhaustive-deps`, `eqeqeq`, `no-var` y más.
- **Tests** — 83 tests, cobertura **87%** (statements/branches/functions/lines) sobre la codebase propia.

---

## Credenciales de prueba

```
Email:    user@suragaming.com
Password: SURA2026!$
```

---

## Cómo levantar el proyecto localmente

### Requisitos
- Node.js 18+
- npm

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variable de entorno
echo 'DATABASE_URL="file:./dev.db"' > .env

# 3. Crear la base de datos y cargar datos de prueba
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el browser.

### Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm test             # Ejecutar tests
npm run test:coverage # Tests con reporte de cobertura
npm run lint         # ESLint
npm run lint:fix     # ESLint con autofix
npm run format       # Prettier (write)
npm run db:seed      # Seedear la base de datos
```

---

## Deploy en Render

El proyecto incluye `render.yaml` con toda la configuración lista.

> **Por qué Render y no Vercel:** Vercel usa funciones serverless donde SQLite no puede compartirse entre invocaciones. Render corre un servidor Node.js persistente, lo que permite que SQLite funcione normalmente.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/surabank/     # Endpoints REST
│   ├── home/             # Pantalla principal
│   ├── login/            # Pantalla de login
│   └── movements/        # Pantalla de movimientos
├── assets/               # Íconos PNG (flechas, visa)
├── components/
│   ├── BottomNav.tsx     # Navegación inferior
│   ├── CreditCard.tsx    # Tarjeta de crédito
│   └── TransactionItem.tsx
├── lib/
│   ├── prisma.ts         # Singleton Prisma Client
│   └── sounds.ts         # Web Audio API — efectos de sonido
└── test/                 # Tests Vitest + Testing Library
prisma/
├── schema.prisma         # Modelos: User, Card, Transaction
└── seed.ts               # Datos de prueba
```
