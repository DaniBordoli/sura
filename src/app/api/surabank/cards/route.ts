import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ success: false, data: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { token },
    include: { cards: true },
  });

  if (!user) {
    return NextResponse.json({ success: false, data: null }, { status: 401 });
  }

  return NextResponse.json({ success: true, data: user.cards });
}
