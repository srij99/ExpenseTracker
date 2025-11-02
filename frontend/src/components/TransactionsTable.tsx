"use client"

import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2 } from "lucide-react"
import DateRangePicker from "./DateRangePicker"
import { DateRange } from "react-day-picker"
import { API_BASE_URL } from "@/config/apiConfig"
import { toast } from "react-toastify"

interface Transaction {
  _id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

interface Props {
  transactions: Transaction[]
  categories: string[]
  onUpdate: (id: string, act: string) => void
  onDelete: (id: string) => void
}

export default function TransactionsTable({ transactions, categories, onUpdate, onDelete }: Props) {
  const token = useSelector((state: RootState) => state.auth.token)
  const [type, setType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [page, setPage] = useState<number>(1)

  // 👇 local state for filtered results
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[] | null>(null)

  const itemsPerPage = 10
  const dataToDisplay = filteredTransactions || transactions
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage)

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return dataToDisplay.slice(start, start + itemsPerPage)
  }, [dataToDisplay, page])

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams()
      if (type) params.append("type", type)
      if (category) params.append("category", category)
      if (dateRange?.from) params.append("from", dateRange.from.toISOString())
      if (dateRange?.to) params.append("to", dateRange.to.toISOString())

      const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()

      if (res.ok) {
        setFilteredTransactions(data)
        toast.success("Filtered transactions loaded!")
      } else {
        toast.error(data.message || "Failed to fetch filtered transactions")
      }
    } catch (error) {
      console.error("Error fetching filtered transactions:", error)
      toast.error("Something went wrong while filtering transactions")
    }
  }

  const clearFilters = async () => {
    setType("")
    setCategory("")
    setDateRange(undefined)
    setFilteredTransactions(null)
    toast.info("Filters cleared")
  }

  return (
    <div className="w-full mt-6 space-y-6 bg-zinc-900 shadow-2xl p-5 rounded-lg mt-5">
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[130px] bg-zinc-900 border-zinc-700 text-zinc-100">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[150px] bg-zinc-900 border-zinc-700 text-zinc-100">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <DateRangePicker value={dateRange} onChange={(range) => setDateRange(range)} />

          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearch}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 p-2 w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 cursor-pointer"
          >
            Clear Filters
          </Button>
        </div>

        {/* Add Transaction */}
        <Button
          onClick={() => onUpdate("null", "add")}
          variant="outline"
          className="bg-blue-600/20 border border-blue-600 text-blue-300 hover:bg-blue-600/30 hover:text-white cursor-pointer"
        >
          Add Transaction
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-zinc-800 text-zinc-200">
          <thead>
            <tr className="bg-zinc-800 text-zinc-300">
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => (
                <tr key={txn._id} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                  <td className="p-3">{txn.description}</td>
                  <td className={`p-3 font-semibold ${txn.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {txn.type === "income" ? `+ ₹${txn.amount}` : `- ₹${txn.amount}`}
                  </td>
                  <td className="p-3">{txn.category}</td>
                  <td className="p-3">
                    {new Date(txn.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <Edit
                      className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-blue-300"
                      onClick={() => onUpdate(txn._id, "edit")}
                    />
                    <Trash2
                      className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-red-300"
                      onClick={() => {
                        onDelete(txn._id)
                        if (paginatedTransactions.length <= 1 && page > 1) {
                          setPage(page - 1)
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-zinc-500 p-4">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Prev
          </Button>
          <span className="text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
