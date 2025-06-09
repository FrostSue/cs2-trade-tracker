import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  const {
    params: { id },
  } = routeContextSchema.parse(context);
  const body = await req.json();

  // If a sellPrice is provided, automatically set sellDate and status
  if (body.sellPrice) {
    body.sellDate = new Date();
    body.status = "SOLD";
  }

  const trade = await db.trade.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: body,
  });

  return NextResponse.json(trade);
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  const {
    params: { id },
  } = routeContextSchema.parse(context);

  await db.trade.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return new Response(null, { status: 204 });
}