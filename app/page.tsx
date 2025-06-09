import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Dashboard } from "@/app/(main)/(dashboard)/_components/dashboard";

// This tells Next.js to always render this page dynamically
// instead of trying to create a static version at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If there's no session or no user in the session,
  // redirect the user to the sign-in page.
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // If the user is logged in, fetch their trades from the database.
  const trades = await db.trade.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      buyDate: "desc",
    },
  });

  // Render the Dashboard component with the user's trades.
  return <Dashboard initialTrades={trades} />;
}