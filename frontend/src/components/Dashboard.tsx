"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  _id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

interface DashboardProps {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: DashboardProps) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-6 bg-zinc-900 shadow-2xl p-5 rounded-lg">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
        <Card className="bg-green-600/20 border-green-600 text-green-300">
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{totalIncome}</CardContent>
        </Card>

        <Card className="bg-red-600/20 border-red-600 text-red-300">
          <CardHeader>
            <CardTitle>Expense</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{totalExpense}</CardContent>
        </Card>

        <Card className="bg-blue-600/20 border-blue-600 text-blue-300">
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{balance}</CardContent>
        </Card>
      </div>
    </div>
  )
}
