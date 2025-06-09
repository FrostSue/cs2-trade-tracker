import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  const trades = await db.trade.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      buyDate: "desc",
    },
  });

  return NextResponse.json(trades);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  const { itemName, buyPrice } = await req.json();

  const trade = await db.trade.create({
    data: {
      itemName,
      buyPrice,
      userId: session.user.id,
    },
  });

  return NextResponse.json(trade);
}