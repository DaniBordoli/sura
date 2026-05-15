import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "user@suragaming.com" },
    update: {},
    create: {
      name: "Carlos",
      email: "user@suragaming.com",
      password: "SURA2026!$",
      token: "sura-token-ficticio-2026",
      cards: {
        create: [
          {
            issuer: "Mastercard",
            name: "Carlos Sura",
            expDate: "02/30",
            lastDigits: 1234,
            balance: "978.85",
            currency: "USD",
          },
          {
            issuer: "Visa",
            name: "Carlos Sura",
            expDate: "08/28",
            lastDigits: 5678,
            balance: "2450.00",
            currency: "USD",
          },
        ],
      },
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        title: "Adobe",
        amount: "125",
        transactionType: "SUS",
        date: "2026-05-14",
        userId: user.id,
      },
      {
        title: "Camila Montenegro",
        amount: "95",
        transactionType: "CASH_IN",
        date: "2026-05-13",
        userId: user.id,
      },
      {
        title: "Figma",
        amount: "125",
        transactionType: "SUS",
        date: "2026-05-12",
        userId: user.id,
      },
      {
        title: "Leonardo Echazu",
        amount: "95",
        transactionType: "CASH_OUT",
        date: "2026-05-11",
        userId: user.id,
      },
      {
        title: "Juan David",
        amount: "95",
        transactionType: "CASH_IN",
        date: "2026-05-10",
        userId: user.id,
      },
    ],
  });

  console.log("Seed completado:", user.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
