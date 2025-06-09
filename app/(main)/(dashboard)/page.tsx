import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Dashboard } from "./_components/dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const trades = await db.trade.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      buyDate: "desc",
    },
  });

  return <Dashboard initialTrades={trades} />;
}