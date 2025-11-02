"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Transaction = {
  _id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export default function ChartsSection({ transactions }: { transactions: Transaction[] }) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString())
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())

  // === PIE CHART DATA ===
  const pieData = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() + 1 === parseInt(selectedMonth) && d.getFullYear() === parseInt(selectedYear)
    })

    const income = filtered.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)
    const expense = filtered.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0)

    return [
      { name: "Income", value: income },
      { name: "Expense", value: expense }
    ]
  }, [transactions, selectedMonth, selectedYear])

  // === BAR CHART DATA ===
  const barData = useMemo(() => {
    const data: { month: string; income: number; expense: number }[] = []
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(0, i).toLocaleString("default", { month: "short" })
      const monthTransactions = transactions.filter((t) => {
        const d = new Date(t.date)
        return d.getFullYear() === parseInt(selectedYear) && d.getMonth() === i
      })
      const income = monthTransactions.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0)
      const expense = monthTransactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0)
      data.push({ month: monthName, income, expense })
    }
    return data
  }, [transactions, selectedYear])

  const COLORS = ["#4ade80", "#f87171"] // green, red

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full bg-zinc-900 shadow-2xl p-5 rounded-lg mt-5">
      {/* === PIE CHART CARD === */}
      <Card className="w-full md:w-1/2 bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Income vs Expense</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString("default", { month: "short" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* === BAR CHART CARD === */}
      <Card className="w-full md:w-1/2 bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Monthly Income vs Expense</CardTitle>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4ade80" name="Income" />
              <Bar dataKey="expense" fill="#f87171" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
