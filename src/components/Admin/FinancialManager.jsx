import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useNotification } from '../Shared/NotificationSystem'
import { Modal } from '../Shared/Modal'
import { Button } from '../Shared/Button'
import { 
  FiPlus, 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiBarChart,
  FiPieChart,
  FiDownload
} from 'react-icons/fi'

export const FinancialManager = () => {
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month') // week, month, year
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'Feed',
    store_name: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [incomeForm, setIncomeForm] = useState({
    description: '',
    amount: '',
    source: 'Egg Sales',
    date: new Date().toISOString().split('T')[0]
  })

  const { showSuccess, showError } = useNotification()

  const expenseCategories = [
    'Feed', 'Medication', 'Equipment', 'Labor', 'Utilities', 
    'Transportation', 'Maintenance', 'Supplies', 'Other'
  ]

  const incomeSources = [
    'Egg Sales', 'Chicken Sales', 'Chick Sales', 'Equipment Sales', 'Other'
  ]

  useEffect(() => {
    fetchFinancialData()
  }, [selectedPeriod])

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      const startDate = getStartDate(selectedPeriod)
      
      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false })

      if (expenseError) throw expenseError

      // Fetch income
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false })

      if (incomeError) throw incomeError

      setExpenses(expenseData || [])
      setIncome(incomeData || [])
    } catch (error) {
      console.error('Error fetching financial data:', error)
      showError('Failed to load financial data')
    }
    setLoading(false)
  }

  const getStartDate = (period) => {
    const now = new Date()
    switch (period) {
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        return weekStart.toISOString().split('T')[0]
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      case 'year':
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseForm,
          amount: parseFloat(expenseForm.amount)
        }])

      if (error) throw error

      showSuccess('Expense added successfully!')
      setShowExpenseModal(false)
      setExpenseForm({
        description: '',
        amount: '',
        category: 'Feed',
        store_name: '',
        date: new Date().toISOString().split('T')[0]
      })
      // Refresh data immediately
      await fetchFinancialData()
    } catch (error) {
      console.error('Error adding expense:', error)
      showError('Failed to add expense')
    }
  }

  const handleAddIncome = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('income')
        .insert([{
          ...incomeForm,
          amount: parseFloat(incomeForm.amount)
        }])

      if (error) throw error

      showSuccess('Income added successfully!')
      setShowIncomeModal(false)
      setIncomeForm({
        description: '',
        amount: '',
        source: 'Egg Sales',
        date: new Date().toISOString().split('T')[0]
      })
      // Refresh data immediately
      await fetchFinancialData()
    } catch (error) {
      console.error('Error adding income:', error)
      showError('Failed to add income')
    }
  }

  const calculateTotals = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0)
    const profit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100) : 0

    return { totalExpenses, totalIncome, profit, profitMargin }
  }

  const { totalExpenses, totalIncome, profit, profitMargin } = calculateTotals()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">Track expenses, income, and calculate profits</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">₦{totalIncome.toLocaleString()}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₦{totalExpenses.toLocaleString()}</p>
            </div>
            <FiTrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{profit.toLocaleString()}
              </p>
            </div>
            <FiDollarSign className={`w-8 h-8 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </p>
            </div>
            <FiPieChart className={`w-8 h-8 ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus />
          Add Expense
        </Button>
        <Button
          onClick={() => setShowIncomeModal(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FiPlus />
          Add Income
        </Button>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-600">{expense.category} • {expense.store_name}</p>
                  <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-red-600">-₦{expense.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Income */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Income</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {income.slice(0, 10).map((inc) => (
              <div key={inc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{inc.description}</p>
                  <p className="text-sm text-gray-600">{inc.source}</p>
                  <p className="text-xs text-gray-500">{new Date(inc.date).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-green-600">+₦{inc.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add Expense">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
              <input
                type="number"
                step="0.01"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                value={expenseForm.store_name}
                onChange={(e) => setExpenseForm({ ...expenseForm, store_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Add Expense</Button>
            <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal */}
      <Modal isOpen={showIncomeModal} onClose={() => setShowIncomeModal(false)} title="Add Income">
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
              <input
                type="number"
                step="0.01"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={incomeForm.source}
                onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {incomeSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={incomeForm.date}
              onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Add Income</Button>
            <Button type="button" variant="outline" onClick={() => setShowIncomeModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}