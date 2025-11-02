"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import Dashboard from "@/components/Dashboard"
import ChartsSection from "@/components/ChartsSection"
import Loader from "@/components/Loader" // 👈 custom loader component
import { API_BASE_URL } from "@/config/apiConfig"
import TransactionsTable from "@/components/TransactionsTable"
import TransactionsForm, { TransactionFormData } from "@/components/TransactionsForm"

interface Transaction {
  _id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export default function Home() {
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const openAdd = () => {
    setModalMode("add")
    setSelectedTx(null)
    setModalOpen(true)
  }
  const openEdit = (tx: Transaction) => {
    setModalMode("edit")
    setSelectedTx(tx)
    setModalOpen(true)
  }

  const handleModalSubmit = async (payload: TransactionFormData) => {
    try {
      const url =
        modalMode === "add" ? `${API_BASE_URL}/transactions` : `${API_BASE_URL}/transactions/${selectedTx?._id}`
      const method = modalMode === "add" ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          amount: Number(payload.amount),
          date: payload.date.toISOString()
        })
      })

      const json = await res.json()
      if (!res.ok) {
        toast.error(json.message || "Failed to save")
        return false
      }

      await fetchAllTransactions()
      return true
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
      return false
    }
  }

  const fetchAllTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (res.ok) {
        setTransactions(data)
      } else {
        toast.error(data.message || "Failed to fetch transactions")
      }
    } catch (error) {
      toast.error("Something went wrong while fetching transactions")
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Transaction deleted successfully")
        fetchAllTransactions()
      } else {
        toast.error(data.message || "Failed to delete transaction")
      }
    } catch (error) {
      toast.error("Something went wrong while deleting transaction")
      console.error("Error deleting transaction:", error)
    }
  }

  const onUpdate = (id: string, act: string) => {
    try {
      if (act === "add") {
        openAdd()
      } else if (act === "edit") {
        const tx = transactions.find((t) => t._id === id)
        if (tx) openEdit(tx)
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error("Error:", error)
    }
  }

  const categories: string[] = useMemo(() => {
    const unique = Array.from(new Set(transactions?.map((t) => t.category)))
    return unique
  }, [transactions])

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    fetchAllTransactions()
  }, [token, router])

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      <Dashboard transactions={transactions} />
      <ChartsSection transactions={transactions} />
      <TransactionsTable transactions={transactions} categories={categories} onDelete={onDelete} onUpdate={onUpdate} />
      <TransactionsForm
        open={modalOpen}
        mode={modalMode}
        initialData={
          selectedTx
            ? {
                type: selectedTx.type,
                amount: String(selectedTx.amount),
                category: selectedTx.category,
                description: selectedTx.description,
                date: new Date(selectedTx.date)
              }
            : null
        }
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}
