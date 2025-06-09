"use client";

import { useState } from "react";
import type { Trade } from "@prisma/client";

interface DashboardProps {
  initialTrades: Trade[];
}

export function Dashboard({ initialTrades }: DashboardProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);

  // TODO: Implement summary statistics calculation
  const summaryStats = {
    cashOnHand: 1000, // Placeholder
    allSalesCount: trades.filter(t => t.status === 'SOLD').length,
    unsoldBuyTotal: trades.filter(t => t.status === 'UNSOLD').reduce((sum, t) => sum + t.buyPrice, 0),
    unsoldItemCount: trades.filter(t => t.status === 'UNSOLD').length,
    totalProfit: 0, // Placeholder for calculated total profit
    commissionTotal: trades.reduce((sum, t) => sum + (t.siteCommission || 0), 0),
    cashTotal: 0, // Placeholder for calculated cash total
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CS:GO Trade Dashboard</h1>

      {/* Summary Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="font-bold">Cash on Hand</h3>
          <p>${summaryStats.cashOnHand.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="font-bold">Total Profit</h3>
          <p>${summaryStats.totalProfit.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-bold">Unsold Buy Total</h3>
          <p>${summaryStats.unsoldBuyTotal.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-orange-100 rounded-lg">
          <h3 className="font-bold">Commission Total</h3>
          <p>${summaryStats.commissionTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Trade</button>
      </div>

      {/* Trades Table */}
      <div>
        {/* TODO: Implement a proper data table component with inline editing.
            - The "Add" button should open a form to enter Item Name and Buy Price.
            - Clicking a row should allow editing Sell Price and Site Commission.
            - On submitting a Sell Price, the API will auto-set the Sell Date and Status.
        */}
        <div className="rounded-lg border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Buy Price</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{trade.itemName}</td>
                    <td className="p-4 align-middle">${trade.buyPrice.toFixed(2)}</td>
                    <td className="p-4 align-middle">{trade.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}