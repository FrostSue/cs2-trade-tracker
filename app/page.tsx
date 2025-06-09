"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Dashboard } from "@/components/dashboard";
import type { Trade } from "@prisma/client";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      // Session is still being fetched, do nothing yet.
      return;
    }

    if (status === "unauthenticated") {
      // If the user is not authenticated, redirect them to the sign-in page.
      signIn("github"); // Or your preferred provider
      return;
    }

    // If the user is authenticated, fetch their trades.
    const fetchTrades = async () => {
      try {
        const response = await fetch("/api/trades");
        if (response.ok) {
          const data = await response.json();
          setTrades(data);
        }
      } catch (error) {
        console.error("Failed to fetch trades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, [status]);

  if (isLoading || status === "loading") {
    return <p className="text-center p-8">Loading...</p>;
  }

  if (session) {
    return <Dashboard initialTrades={trades} />;
  }

  // This part should ideally not be reached due to the redirect,
  // but it's good practice to have a fallback.
  return <p className="text-center p-8">Redirecting to sign-in...</p>;
}