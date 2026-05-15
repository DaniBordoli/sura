import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ success: false, data: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { token } });

  if (!user) {
    return NextResponse.json({ success: false, data: null }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 5,
  });

  return NextResponse.json({ success: true, data: transactions });
}
