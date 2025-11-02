"use client"

import React, { useEffect, useState, startTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"

export interface TransactionFormData {
  type: "income" | "expense" | ""
  amount: string // keep as string in form, convert before submit
  category: string
  description: string
  date: Date
}

interface TransactionsFormProps {
  open: boolean
  mode: "add" | "edit"
  initialData?: TransactionFormData | null
  categories?: string[]
  onClose: () => void
  /**
   * onSubmit should perform the API call and return a Promise<boolean>
   * resolve true on success, false on failure (or throw).
   */
  onSubmit: (payload: TransactionFormData) => Promise<boolean>
}

const EMPTY_FORM: TransactionFormData = {
  type: "",
  amount: "",
  category: "",
  description: "",
  date: new Date()
}

export default function TransactionsForm({
  open,
  mode,
  initialData = null,
  categories = [],
  onClose,
  onSubmit
}: TransactionsFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form when modal opens. Use startTransition to avoid "sync setState in effect" warning.
  useEffect(() => {
    if (!open) return
    startTransition(() => {
      if (mode === "edit" && initialData) {
        setFormData({
          type: initialData.type || "",
          amount: initialData.amount ?? "",
          category: initialData.category ?? "",
          description: initialData.description ?? "",
          date: initialData.date ? new Date(initialData.date) : new Date()
        })
      } else {
        setFormData(EMPTY_FORM)
      }
    })
  }, [open, mode, initialData])

  const validate = (): string | null => {
    if (!formData.type) return "Please select type (Income / Expense)."
    if (!formData.amount || Number(formData.amount) <= 0) return "Amount must be a positive number."
    if (!formData.category || formData.category.trim().length === 0) return "Category is required."
    if (formData.category.length > 30) return "Category must be <= 30 characters."
    if (!formData.description || formData.description.trim().length === 0) return "Description is required."
    if (formData.description.length > 50) return "Description must be <= 50 characters."
    if (!formData.date) return "Please pick a date."
    return null
  }

  const handleSubmit = async () => {
    const v = validate()
    if (v) {
      toast.error(v)
      return
    }

    setIsSubmitting(true)
    try {
      // ensure amount is normalized (number) in parent - but send as string here
      const success = await onSubmit(formData)
      if (success) {
        toast.success(mode === "add" ? "Transaction added successfully" : "Transaction updated successfully")
        onClose()
      } else {
        // if parent returns false, show generic message (parent may toast specific)
        toast.error("Failed to save transaction")
      }
    } catch (err) {
      console.error("submit error:", err)
      toast.error("Something went wrong while saving transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose()
      }}
    >
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-zinc-100 max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Transaction" : "Edit Transaction"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Type */}
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData((p) => ({ ...p, type: value as TransactionFormData["type"] }))}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Amount */}
          <Input
            type="number"
            min={0}
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
            className="bg-zinc-800 border-zinc-700 text-zinc-100"
            disabled={isSubmitting}
          />

          {/* Category with suggestions */}
          <Input
            type="text"
            placeholder="Category"
            maxLength={30}
            list="categories"
            value={formData.category}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
            className="bg-zinc-800 border-zinc-700 text-zinc-100"
            disabled={isSubmitting}
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          {/* Description */}
          <Input
            type="text"
            placeholder="Description"
            maxLength={50}
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="bg-zinc-800 border-zinc-700 text-zinc-100"
            disabled={isSubmitting}
          />

          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-zinc-800 border-zinc-700 text-zinc-100"
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "dd MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl w-auto shadow-lg text-zinc-100">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData((p) => ({ ...p, date: date || new Date() }))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            className="bg-zinc-800 border-zinc-700 text-zinc-100"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-blue-600/20 border border-blue-600 text-blue-300 hover:bg-blue-600/30 hover:text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (mode === "add" ? "Adding..." : "Updating...") : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
