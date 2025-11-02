import Transaction from "../models/Transaction.js"

// @desc    Get all transactions (filtered by user)
// @route   GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const { type, category, from, to } = req.query

    // Start with user's transactions
    const query = { createdBy: req.user.id }

    // Add filters dynamically
    if (type) query.type = type
    if (category) query.category = category

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    } else if (from) {
      query.date = { $gte: new Date(from) }
    } else if (to) {
      query.date = { $lte: new Date(to) }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 })

    res.json(transactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add new transaction
// @route   POST /api/transactions
export const addTransaction = async (req, res) => {
  const { type, amount, description, category, date } = req.body

  if (!type || !amount || !category) {
    return res.status(400).json({ message: "Please provide all required fields" })
  }

  try {
    const transaction = await Transaction.create({
      type,
      amount,
      description,
      category,
      date,
      createdBy: req.user.id
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update transaction
// @route   PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (transaction.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    if (transaction.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await transaction.deleteOne()
    res.json({ message: "Transaction removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
